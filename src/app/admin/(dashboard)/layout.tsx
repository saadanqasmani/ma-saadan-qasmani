import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { RESOURCES } from "@/lib/admin/resources";
import { NotConnected } from "@/components/admin/ui";
import { signOut } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const CONTENT_LINKS = [
  { href: "/admin/settings", label: "Site text" },
  { href: "/admin/book", label: "The novel" },
  { href: "/admin/media", label: "Files" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured) return <NotConnected />;

  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const authored = RESOURCES.filter((r) => r.mode === "crud");
  const inbox = RESOURCES.filter((r) => r.mode === "inbox");

  return (
    <div className="flex min-h-full flex-1 flex-col lg:flex-row">
      <aside className="border-b border-line bg-canvas px-6 py-6 lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-7 lg:py-8">
        <Link href="/admin" className="font-display text-xl">
          The desk
        </Link>

        <nav className="mt-8 space-y-7 text-sm">
          <div>
            <p className="eyebrow">Content</p>
            <ul className="mt-3 space-y-1.5">
              {CONTENT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink-soft transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
              {authored.map((r) => (
                <li key={r.key}>
                  <Link
                    href={`/admin/${r.key}`}
                    className="text-ink-soft transition-colors hover:text-ink"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Inbox</p>
            <ul className="mt-3 space-y-1.5">
              {inbox.map((r) => (
                <li key={r.key}>
                  <Link
                    href={`/admin/${r.key}`}
                    className="text-ink-soft transition-colors hover:text-ink"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-line pt-6">
            <Link href="/" className="text-ink-soft transition-colors hover:text-ink">
              View the site →
            </Link>
            <p className="mt-4 truncate text-xs text-ink-faint">{user.email}</p>
            <form action={signOut}>
              <button
                type="submit"
                className="mt-2 text-xs uppercase tracking-[0.14em] text-ink-faint underline-offset-4 hover:text-ink hover:underline"
              >
                Sign out
              </button>
            </form>
          </div>
        </nav>
      </aside>

      <div className="min-w-0 flex-1 px-6 py-8 sm:px-10 sm:py-12">{children}</div>
    </div>
  );
}
