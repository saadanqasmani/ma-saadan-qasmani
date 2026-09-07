"use client";

import { useState } from "react";
import { highestBranch } from "@/content/site";
import { DirectOrderForm } from "@/components/forms/DirectOrderForm";

export function PurchasePanel() {
  const [tab, setTab] = useState<"amazon" | "direct">("amazon");

  return (
    <div>
      <div className="flex gap-1 border-b border-ink-text/10">
        <button
          type="button"
          onClick={() => setTab("amazon")}
          className={`px-5 py-3 text-xs uppercase tracking-[0.16em] transition-colors ${
            tab === "amazon"
              ? "border-b-2 border-gold-bright text-gold-bright"
              : "text-ink-text-muted hover:text-ink-text"
          }`}
        >
          EU &amp; Americas
        </button>
        <button
          type="button"
          onClick={() => setTab("direct")}
          className={`px-5 py-3 text-xs uppercase tracking-[0.16em] transition-colors ${
            tab === "direct"
              ? "border-b-2 border-gold-bright text-gold-bright"
              : "text-ink-text-muted hover:text-ink-text"
          }`}
        >
          Türkiye &amp; Pakistan
        </button>
      </div>

      <div className="mt-10 max-w-xl">
        {tab === "amazon" ? (
          <div>
            <p className="text-sm text-ink-text-muted">
              Available for readers in {highestBranch.purchase.amazon.regions} through Amazon.
            </p>
            {highestBranch.purchase.amazon.url ? (
              <a
                href={highestBranch.purchase.amazon.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block border border-gold/50 px-8 py-3 text-xs uppercase tracking-[0.2em] text-gold-bright transition-colors hover:border-gold-bright hover:bg-gold/10"
              >
                Buy on Amazon
              </a>
            ) : (
              <p className="mt-6 border border-ink-text/15 px-6 py-4 text-sm text-ink-text-muted">
                The Amazon link will appear here once available.
              </p>
            )}
          </div>
        ) : (
          <div>
            <p className="mb-8 text-sm text-ink-text-muted">
              {highestBranch.purchase.direct.note} Orders are reviewed individually — payment
              and shipping details are sent to you directly once confirmed.
            </p>
            <DirectOrderForm />
          </div>
        )}
      </div>
    </div>
  );
}
