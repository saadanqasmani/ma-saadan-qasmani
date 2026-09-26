import { Panel } from "@/components/edviko/portal/parts";
import type { Group } from "@/lib/edviko/kpi";

/**
 * The measures, with the ones that cannot be computed shown as such.
 *
 * A dashboard that silently omits what it cannot measure teaches its readers
 * that the list is complete. This one leaves the gaps in, greyed, with what
 * it would take to fill them, which is also the honest version of a roadmap.
 */
export function Kpis({ groups }: { groups: Group[] }) {
  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      {groups.map((g) => (
        <Panel key={g.id} title={g.label} aside={g.note}>
          <div style={{ display: "grid", gap: "1.1rem" }}>
            {g.kpis.map((k) => (
              <div
                key={k.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "5.5rem 1fr",
                  gap: "1rem",
                  alignItems: "baseline",
                  borderTop: "1px solid var(--line)",
                  paddingTop: "0.9rem",
                }}
              >
                <span
                  className="ev-tile__n"
                  style={{
                    fontSize: "1.5rem",
                    color: k.value === null ? "var(--text-faint)" : undefined,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {k.value === null ? "—" : k.unit === "%" ? `${k.value}%` : k.value}
                </span>
                <div style={{ minWidth: 0 }}>
                  <p className="ev-body" style={{ fontWeight: 600 }}>
                    {k.label}
                    {k.of && (
                      <span className="ev-small" style={{ color: "var(--text-faint)", fontWeight: 400 }}>
                        {" "}of {k.of}
                      </span>
                    )}
                    {k.lowerIsBetter && k.value !== null && (
                      <span className="ev-small" style={{ color: "var(--text-faint)", fontWeight: 400 }}> · lower is better</span>
                    )}
                  </p>
                  <p className="ev-small" style={{ color: "var(--text-soft)", marginTop: "0.2rem" }}>{k.means}</p>
                  {k.missing && (
                    <p className="ev-small" style={{ color: "var(--paid)", marginTop: "0.25rem" }}>
                      Not measured yet. {k.missing}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      ))}
    </div>
  );
}
