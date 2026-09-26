"use client";

import { useState } from "react";
import { Panel } from "@/components/edviko/portal/parts";
import { STANDARD, type Thresholds } from "@/lib/edviko/pipeline";
import { FIELDS, isDefault, THRESHOLD_COOKIE, THRESHOLD_MAX_AGE } from "@/lib/edviko/thresholds";

/**
 * What this campus means by late.
 *
 * These seven numbers decide every colour on every screen in the product.
 * They are here rather than in the source because a school that answers a
 * student in three days and a school that answers in ten are both
 * defensible, and a threshold only a developer can change is a decision
 * taken on behalf of people they have never met.
 *
 * The form shows what each one does in words, because "quietRed: 30" is a
 * setting and "after this long with no contact at all, the case turns red"
 * is a policy, and this screen is the second thing.
 */
export function Settings({ current }: { current: Thresholds }) {
  const [draft, setDraft] = useState<Thresholds>(current);
  const [saved, setSaved] = useState(false);

  function set(key: keyof Thresholds, value: number) {
    setDraft((d) => ({ ...d, [key]: value }));
    setSaved(false);
  }

  function apply(next: Thresholds) {
    const value = encodeURIComponent(JSON.stringify(next));
    document.cookie = `${THRESHOLD_COOKIE}=${value}; path=/; max-age=${THRESHOLD_MAX_AGE}; samesite=lax`;
    setDraft(next);
    setSaved(true);
    // The dashboards are rendered on the server from this cookie, so they
    // have to be fetched again rather than re-rendered from what is here.
    window.location.reload();
  }

  return (
    <div style={{ display: "grid", gap: "1.25rem", maxWidth: "52rem" }}>
      <header>
        <h1 className="ev-h1" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>What this campus means by late</h1>
        <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.5rem" }}>
          Seven numbers decide every colour on every screen. Set them too tight and the whole campus
          is red, which is the same as no alarm at all. Set them too loose and a student goes quiet
          for a term before anybody notices.
        </p>
      </header>

      <Panel title="The service standard" aside={isDefault(draft) ? "As shipped" : "Changed"}>
        <div style={{ display: "grid", gap: "1.4rem" }}>
          {FIELDS.map((f) => (
            <div key={f.key}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "baseline", flexWrap: "wrap" }}>
                <label className="ev-body" htmlFor={`t-${f.key}`} style={{ fontWeight: 600 }}>{f.label}</label>
                <span className="ev-small" style={{ fontVariantNumeric: "tabular-nums", color: "var(--text-soft)" }}>
                  {draft[f.key]} {f.unit}
                </span>
              </div>
              <input
                id={`t-${f.key}`}
                type="range"
                min={f.min}
                max={f.max}
                step={f.unit === "× the standard" ? 0.5 : 1}
                value={draft[f.key]}
                onChange={(e) => set(f.key, Number(e.target.value))}
                style={{ width: "100%", marginTop: "0.5rem", accentColor: "var(--accent)" }}
              />
              <p className="ev-small" style={{ color: "var(--text-faint)", marginTop: "0.25rem" }}>{f.why}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.6rem", marginTop: "1.6rem", flexWrap: "wrap" }}>
          <button type="button" className="ev-btn ev-btn--primary" onClick={() => apply(draft)}>
            Apply to this campus
          </button>
          <button type="button" className="ev-btn ev-btn--ghost" onClick={() => apply(STANDARD)}>
            Back to the shipped standard
          </button>
          {saved && <span className="ev-small" style={{ alignSelf: "center", color: "var(--free)" }}>Applied.</span>}
        </div>
      </Panel>

      <p className="ev-small" style={{ color: "var(--text-faint)", maxWidth: "62ch" }}>
        Stored in a cookie on this browser, because the dashboards are built on the server and a
        value kept in the browser is not there when they are built. When there are accounts this
        becomes a campus setting that a supervisor sets once for everybody, and the screens will not
        have to change.
      </p>
    </div>
  );
}
