import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { IRIS_COOKIE, tokenIsValid } from "@/lib/irisGate";

/**
 * Two gates, on two unrelated paths.
 *
 * The admin one keeps the session cookie fresh and turns away anonymous
 * visitors before a dashboard page renders; the layout checks the admins
 * allowlist as well, so this is the cheap first gate rather than the only
 * one.
 *
 * The IRIS one refuses the explainer film to anyone who has not entered the
 * access code. It has to live here because the film is a file in public/,
 * and a page cannot guard a file it does not serve.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/iris-explainer.html") return irisGate(request);

  return adminGate(request);
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
  matcher: ["/admin/:path*", "/iris-explainer.html"],
};
