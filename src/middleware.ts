import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { IRIS_COOKIE, tokenIsValid } from "@/lib/irisGate";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

/**
 * Three jobs, on three unrelated paths.
 *
 * The language one is the reason every request comes through here. English
 * keeps the bare paths the site has always had, so /work is still /work and
 * nothing already linked or indexed moves; the app underneath is organised
 * by language, so /work is rewritten to /en/work on the way in. A rewrite
 * rather than a redirect: the reader's URL does not change, and the
 * prerendered English page is the one that answers.
 *
 * Nobody is redirected by their browser's language header. A visitor who
 * asked for a page in English gets it in English, and the switcher in the
 * header is what changes that. Guessing would break shared links and give
 * search engines a different page than the one they asked for.
 *
 * The admin gate keeps the session cookie fresh and turns away anonymous
 * visitors before a dashboard page renders; the layout checks the admins
 * allowlist as well, so this is the cheap first gate rather than the only
 * one.
 *
 * The IRIS gate refuses the explainer film to anyone who has not entered the
 * access code. It has to live here because the film is a file in public/,
 * and a page cannot guard a file it does not serve.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/iris-explainer.html") return irisGate(request);
  if (pathname.startsWith("/admin")) return adminGate(request);

  return languageRewrite(request);
}

/** Puts the English site back under the locale segment it now lives in. */
function languageRewrite(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  // Already asking for a language by name: that segment is the locale.
  if (isLocale(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

/** Sends an uncoded visitor back to the page that asks for the code. */
async function irisGate(request: NextRequest) {
  const unlocked = await tokenIsValid(request.cookies.get(IRIS_COOKIE)?.value);
  if (unlocked) return NextResponse.next();

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/work/iris";
  redirectUrl.search = "";
  redirectUrl.hash = "film";
  return NextResponse.redirect(redirectUrl);
}

async function adminGate(request: NextRequest) {
  const response = NextResponse.next({ request });

  // Accept both the public names and the ones the Vercel/Supabase
  // integration injects, so the gate works whichever way the project was set
  // up. Read inline rather than imported: middleware runs on the edge.
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || process.env.SUPABASE_URL?.trim();
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.SUPABASE_ANON_KEY?.trim();

  // Not configured: let the page render its own "not connected" notice.
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLogin = request.nextUrl.pathname.startsWith("/admin/login");

  if (!user && !isLogin) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  /**
   * Everything except the framework's own paths, the API, and files served
   * from public/ — a request for /logo.png is not a page and has no
   * language. The IRIS film is the one file that is matched anyway, because
   * it is the one file behind a gate.
   */
  matcher: [
    "/((?!_next/|api/|.*\\.[^/]+$).*)",
    "/iris-explainer.html",
  ],
};
