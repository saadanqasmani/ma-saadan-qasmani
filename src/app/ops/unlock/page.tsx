import { UnlockForm } from "@/components/ops/UnlockForm";

/**
 * The one page under /ops the middleware lets through without a cookie.
 * It names nothing.
 */
export default function OpsUnlockPage() {
  return (
    <main className="ops-unlock">
      <div className="g g--pop ops-unlock__card">
        <UnlockForm />
      </div>
    </main>
  );
}
