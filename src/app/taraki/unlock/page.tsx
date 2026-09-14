import { UnlockForm } from "@/components/taraki/UnlockForm";

/**
 * The one page under /taraki the middleware lets through without a cookie.
 *
 * It names nothing. Somebody who reaches it by guessing the URL learns that
 * a code exists and not one thing more.
 */
export default function UnlockPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
      <div className="tk-card" style={{ padding: "2rem", width: "min(22rem, 100%)" }}>
        <UnlockForm />
      </div>
    </main>
  );
}
