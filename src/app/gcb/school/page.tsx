import { GcbNav } from "@/components/gcb/GcbNav";
import { Pane } from "@/components/gcb/Pane";

/**
 * What a school counsellor does, and which parts of it a website can do.
 *
 * Most of it we can. The reference and the transcript we cannot, and a
 * student who finds that out on the night of a deadline will not forgive
 * anyone. So it is said here, in the open, on its own page.
 */
export default function Page() {
  return (
    <>
      <GcbNav />
      <main className="gcb-shell" style={{ paddingBlock: "clamp(3rem, 7vw, 5rem) 6rem" }}>
        <p className="gcb-label gcb-rise" style={{ color: "var(--accent)" }}>
          Free · The counsellor&apos;s job, opened up
        </p>
        <h1 className="gcb-h1 gcb-rise" style={{ marginTop: "1.25rem", maxWidth: "20ch", animationDelay: "0.05s" }}>
          Most of what a counsellor does, you can do yourself.
        </h1>
        <p className="gcb-lead gcb-rise" style={{ marginTop: "1.25rem", maxWidth: "62ch", animationDelay: "0.1s" }}>
          Not all of it. Two things have to come from your school, and no website can do them
          for you. Everything else is on this site, free. Open a card to see what is involved.
        </p>

        <section style={{ marginTop: "3.5rem" }}>
          <h2 className="gcb-h2">What we do for you</h2>
          <div style={{ marginTop: "1.25rem", display: "grid", gap: "0.9rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            <Pane
              id="school-shortlist"
              title="Building your shortlist"
              summary="The long conversation about where you should even be applying."
              points={10}
            >
              <p className="gcb-body">
                A counsellor sits with you and narrows a world of universities down to eight or
                ten. They are weighing your grades, your money, your subject, and whether you
                would actually survive the place. Our matcher does the first three from published
                data. The fourth is a conversation, and it is the one worth paying for.
              </p>
            </Pane>

            <Pane
              id="school-equiv"
              title="Grade equivalence"
              summary="Turning O Level, A Level, Matric or FSc into a number a foreign university reads."
              points={10}
            >
              <p className="gcb-body">
                This is arithmetic with a lookup table, and counsellors charge for it because
                families do not know the table. Now you do. It is on the equivalence page, free,
                with the working shown so you can check it.
              </p>
            </Pane>

            <Pane
              id="school-deadlines"
              title="Deadlines across four systems"
              summary="UCAS, Common App, Uni-Assist and a dozen national portals, each with its own calendar."
              points={10}
            >
              <p className="gcb-body">
                Missing a deadline is the single most common way a good application dies. A
                counsellor keeps the calendar. So can a piece of software, and software does not
                take leave in December.
              </p>
            </Pane>

            <Pane
              id="school-docs"
              title="The document checklist"
              summary="What each country wants, in what format, certified by whom."
              points={10}
            >
              <p className="gcb-body">
                Attestation, translation, notarisation, apostille. Every country words it
                differently and none of it is hard once somebody writes it down in order.
              </p>
            </Pane>

            <Pane
              id="school-statement"
              title="The personal statement"
              summary="What admissions officers say they are reading it for."
              points={10}
            >
              <p className="gcb-body">
                We can tell you what the question is really asking and show you what a strong
                answer looks like. We will not write it for you. An admissions officer reads
                thousands of these and can tell.
              </p>
            </Pane>

            <Pane
              id="school-money"
              title="What it will actually cost"
              summary="Tuition, living costs, and the amount a visa requires you to prove."
              points={10}
            >
              <p className="gcb-body">
                With the source on every figure, so your parents can check it rather than take
                our word for it.
              </p>
            </Pane>
          </div>
        </section>

        <section style={{ marginTop: "4rem" }}>
          <h2 className="gcb-h2">What your school still has to do</h2>
          <p className="gcb-body" style={{ marginTop: "0.75rem", maxWidth: "58ch" }}>
            These two are not a gap in this site. They are structural: the receiving university
            requires them to come from your school, not from you and not from us.
          </p>

          <div style={{ marginTop: "1.5rem", display: "grid", gap: "0.9rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            <Pane
              id="school-reference"
              title="The reference"
              summary="UCAS takes one reference, from the school. Common App wants a counsellor recommendation."
              points={15}
              tone="var(--paid)"
            >
              <p className="gcb-body">
                For UCAS, the school submits a single reference, and the counsellor&apos;s job is
                to collect your teachers&apos; comments and turn them into one document. For US
                applications the counsellor writes their own recommendation alongside your
                teachers&apos;. You cannot file either yourself.
              </p>
              <p className="gcb-body" style={{ marginTop: "0.8rem" }}>
                What to do: ask your counsellor early, in writing, and give them something to
                work from. A teacher who likes you and has nothing specific to say writes a
                weaker letter than one who has your own notes in front of them.
              </p>
            </Pane>

            <Pane
              id="school-transcript"
              title="The transcript"
              summary="An official transcript is sent by a school official, sealed or through the portal."
              points={15}
              tone="var(--paid)"
            >
              <p className="gcb-body">
                A copy you print yourself is not an official transcript. It goes from the school
                to the university directly, and many universities will not open an application
                until it arrives. Predicted grades, where a system uses them, also come from the
                school.
              </p>
              <p className="gcb-body" style={{ marginTop: "0.8rem" }}>
                What to do: find out now who in your school does this, and what notice they need.
                In some schools it is weeks.
              </p>
            </Pane>
          </div>
        </section>

        <p className="gcb-small" style={{ marginTop: "3rem", maxWidth: "62ch" }}>
          Sources for how the reference and transcript work: UCAS and Common App published
          guidance for schools, and NACAC and IACAC material on the counsellor&apos;s role. To be
          cited properly on this page before launch.
        </p>
      </main>
    </>
  );
}
