import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  // The dashboard must never be indexed, whatever robots.txt says.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-full flex-1 flex-col bg-canvas-light">{children}</div>;
}
