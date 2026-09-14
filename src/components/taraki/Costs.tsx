"use client";

import { useState } from "react";
import { useAccount } from "@/components/taraki/Account";
import { countries, hasAnyCosts } from "@/content/taraki/countries";
import {
  KIND_LABEL,
  LINES,
  emptyLines,
  money,
  moneyOf,
  prefill,
  totalsFor,
  type LineId,
  type Plan,
} from "@/lib/taraki/costs";

/**
 * What a degree costs, all of it.
 *
 * Pick a country and the lines we hold a source for fill themselves, marked
 * with where they came from. The rest are blank and stay blank until the
 * student puts their own number in, which is the honest way round: a filled
 * field looks researched whether or not it is.
 */
function startingLines(forCode: string): Record<LineId, number> {
  const country = countries.find((x) => x.code === forCode) ?? countries[0];
  const sourced = prefill(country).lines;
  return LINES.reduce(
    (acc, l) => ({ ...acc, [l.id]: sourced[l.id]?.amount ?? 0 }),
    emptyLines(),
  );
}

export function CostCalculator() {
  const account = useAccount();
  const withData = countries.filter(hasAnyCosts);
  const [code, setCode] = useState(withData[0]?.code ?? countries[0].code);
  const country = countries.find((c) => c.code === code) ?? countries[0];

  const filled = prefill(country);
  const [lines, setLines] = useState<Record<LineId, number>>(() => startingLines(code));
  const [years, setYears] = useState(4);
  const [scholarship, setScholarship] = useState(0);
  const [inflation, setInflation] = useState(0);
  const [budget, setBudget] = useState<number | null>(account?.budgetUsd ?? null);

  function pickCountry(next: string) {
    setCode(next);
    setLines(startingLines(next));
  }

  const currency = filled.currency ?? "EUR";
  const plan: Plan = { countryCode: code, currency, years, scholarship, budget, inflation, lines };
  const totals = totalsFor(plan);
  const proof = country.costs.proofOfFunds;

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <div className="tk-card" style={{ padding: "clamp(1.2rem, 3vw, 1.8rem)" }}>
        <label className="tk-label" htmlFor="tk-country" style={{ color: "var(--text-faint)" }}>
          Country
        </label>
        <select
          id="tk-country"
          className="tk-field"
          value={code}
          onChange={(e) => pickCountry(e.target.value)}
          style={{ marginTop: "0.6rem" }}
        >
          {withData.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
          {countries.filter((c) => !hasAnyCosts(c)).map((c) => (
            <option key={c.code} value={c.code}>
              {c.name} (nothing sourced yet)
            </option>
          ))}
        </select>
        {country.summary && (
          <p className="tk-small" style={{ marginTop: "0.8rem", color: "var(--text-soft)" }}>{country.summary}</p>
        )}
        {!hasAnyCosts(country) && (
          <p className="tk-small" style={{ marginTop: "0.8rem", color: "var(--paid)" }}>
            We hold no sourced figure for {country.name} yet, so every line below starts empty. Your own numbers still
            add up correctly.
          </p>
        )}
      </div>

      <div className="tk-card" style={{ padding: "clamp(1.2rem, 3vw, 1.8rem)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <span className="tk-label" style={{ color: "var(--text-faint)" }}>One year, in {currency}</span>
          <span className="tk-small" style={{ color: "var(--text-faint)" }}>
            {totals.blank.length > 0 ? `${totals.blank.length} lines still empty` : "Every line filled"}
          </span>
        </div>

        <div style={{ marginTop: "1.2rem", display: "grid", gap: "0.9rem" }}>
          {LINES.map((l) => {
            const source = filled.lines[l.id];
            return (
              <div key={l.id} style={{ display: "grid", gap: "0.35rem" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <label className="tk-body" htmlFor={`line-${l.id}`} style={{ fontWeight: 600 }}>
                    {l.label}
                  </label>
                  {source?.figure ? (
                    <a
                      href={source.figure.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tk-small"
                      style={{ color: "var(--accent)" }}
                    >
                      {KIND_LABEL[source.figure.kind]} · {source.figure.source}
                    </a>
                  ) : (
                    <span className="tk-small" style={{ color: "var(--text-faint)" }}>Your number</span>
                  )}
                </div>
                <input
                  id={`line-${l.id}`}
                  className="tk-field"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={lines[l.id] || ""}
                  placeholder="0"
                  onChange={(e) => setLines({ ...lines, [l.id]: Math.max(0, Number(e.target.value) || 0) })}
                />
                <p className="tk-small" style={{ color: "var(--text-faint)" }}>
                  {l.note}
                  {l.monthly && source ? " Filled from a monthly figure, multiplied by twelve." : ""}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="tk-card" style={{ padding: "clamp(1.2rem, 3vw, 1.8rem)", display: "grid", gap: "1rem" }}>
        <span className="tk-label" style={{ color: "var(--text-faint)" }}>The rest of the sum</span>
        <Field label="How many years is the degree" value={years} onChange={(n) => setYears(Math.max(1, Math.min(8, n)))} />
        <Field label={`Scholarship per year, in ${currency}`} value={scholarship} onChange={setScholarship} />
        <Field
          label={`What your family can put in per year, in ${currency}`}
          value={budget ?? 0}
          onChange={(n) => setBudget(n)}
        />
        <div>
          <label className="tk-body" htmlFor="tk-infl" style={{ fontWeight: 600 }}>
            Assume costs rise by this much a year
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginTop: "0.4rem" }}>
            <input
              id="tk-infl"
              type="range"
              min={0}
              max={15}
              step={1}
              value={inflation}
              onChange={(e) => setInflation(Number(e.target.value))}
              style={{ flex: 1, accentColor: "var(--accent)" }}
            />
            <span className="tk-body" style={{ minWidth: "3ch", fontVariantNumeric: "tabular-nums" }}>{inflation}%</span>
          </div>
          <p className="tk-small" style={{ marginTop: "0.3rem", color: "var(--text-faint)" }}>
            Your assumption, not a forecast. It is here because the fifth year of a degree never costs what the first
            one did, and no plan that ignores it survives contact with a fee letter.
          </p>
        </div>
      </div>

      <div className="tk-card" style={{ padding: "clamp(1.4rem, 3vw, 2rem)", borderColor: "var(--accent)" }}>
        <span className="tk-label" style={{ color: "var(--accent)" }}>The answer</span>
        <div style={{ marginTop: "1.2rem", display: "grid", gap: "1rem" }}>
          <Total label="One year" value={money(totals.perYear, currency)} />
          <Total label={`All ${years} years`} value={money(totals.whole, currency)} />
          {scholarship > 0 && <Total label="After the scholarship" value={money(totals.afterScholarship, currency)} />}
          {totals.gap !== null && (
            <Total
              label={totals.gap > 0 ? "Short by" : "Covered, with room of"}
              value={money(Math.abs(totals.gap), currency)}
              tone={totals.gap > 0 ? "var(--paid)" : "var(--free)"}
              big
            />
          )}
        </div>

        {totals.gap === null && (
          <p className="tk-small" style={{ marginTop: "1.2rem", color: "var(--text-faint)" }}>
            Put in what your family can contribute and this will tell you the gap, which is the only number that
            decides anything.
          </p>
        )}
        {totals.blank.length > 0 && (
          <p className="tk-small" style={{ marginTop: "1.2rem", color: "var(--paid)" }}>
            {totals.blank.length} of {LINES.length} lines are still zero, so this total is lower than the truth.
            The ones people leave blank and then meet anyway are insurance, flights and personal spending.
          </p>
        )}
      </div>

      {proof && (
        <div className="tk-card" style={{ padding: "clamp(1.2rem, 3vw, 1.8rem)", borderColor: "var(--paid)" }}>
          <span className="tk-label" style={{ color: "var(--paid)" }}>Separate, and not an estimate</span>
          <h3 className="tk-h2" style={{ marginTop: "0.7rem" }}>
            {country.name} requires you to show {moneyOf(proof.low)} before a visa.
          </h3>
          <p className="tk-small" style={{ marginTop: "0.7rem", color: "var(--text-soft)" }}>
            This is a government requirement, not a guess at your spending. It decides whether you are allowed in,
            whatever your own budget says. {proof.note ?? ""}
          </p>
          <p className="tk-small" style={{ marginTop: "0.8rem" }}>
            <a href={proof.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
              {proof.source}
            </a>
            <span style={{ color: "var(--text-faint)" }}> · read {proof.asOf}{proof.verified ? "" : " · not yet checked against the issuing body"}</span>
          </p>
        </div>
      )}

      <p className="tk-small" style={{ color: "var(--text-faint)", maxWidth: "58ch" }}>
        Everything you type here stays on this device. Figures marked with a source came from the page linked beside
        them on the date shown; everything else is your own number and is treated as such.
      </p>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <label className="tk-body" htmlFor={`f-${label}`} style={{ fontWeight: 600 }}>{label}</label>
      <input
        id={`f-${label}`}
        className="tk-field"
        type="number"
        min={0}
        inputMode="numeric"
        value={value || ""}
        placeholder="0"
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        style={{ marginTop: "0.4rem" }}
      />
    </div>
  );
}

function Total({ label, value, tone, big }: { label: string; value: string; tone?: string; big?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem", borderTop: "1px solid var(--line)", paddingTop: "0.8rem" }}>
      <span className="tk-small" style={{ color: "var(--text-soft)" }}>{label}</span>
      <span
        className={big ? "tk-h2" : "tk-body"}
        style={{ color: tone ?? "var(--text)", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}
      >
        {value}
      </span>
    </div>
  );
}
