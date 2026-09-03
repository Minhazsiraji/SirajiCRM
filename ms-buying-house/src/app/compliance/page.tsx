import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/cta-band";
import { Check, Shield } from "@/components/icons";
import { certifications } from "@/content/process";

export const metadata: Metadata = {
  title: "Compliance & quality",
  description:
    "How M&S vets partner factories — social audit, structural and fire safety, subcontracting control — and how inline QA and AQL inspection protect your order.",
  alternates: { canonical: "/compliance" },
};

const screening = [
  {
    title: "Social compliance",
    body: "Valid third-party audit (BSCI, SMETA or WRAP) with the corrective-action plan closed out. We read the findings, not just the certificate date.",
  },
  {
    title: "Structural & fire safety",
    body: "Current building, fire and electrical safety status, including remediation history under the national and international safety programmes.",
  },
  {
    title: "Wages & working hours",
    body: "Payroll and attendance records checked against the legal minimum wage and overtime limits, with worker interviews conducted away from management.",
  },
  {
    title: "No unauthorised subcontracting",
    body: "Contractually prohibited, and checked in practice. Every process step is declared up front — including washing, printing and embroidery units.",
  },
  {
    title: "Chemical & effluent management",
    body: "Restricted-substance policy in force, and functioning effluent treatment at any wet-processing unit in the chain.",
  },
  {
    title: "Ongoing re-screening",
    body: "Approval is not permanent. Units are re-checked on a rolling schedule and immediately after any incident, audit downgrade or ownership change.",
  },
];

const qaStages = [
  {
    stage: "Pre-production",
    body: "PP meeting on the factory floor with the sewing and quality teams, the approved PP sample, the bulk fabric inspection report and a signed TNA.",
  },
  {
    stage: "Inline",
    body: "Inspection at the sewing line during the run, typically at 20% and 50% output, with photographed defect reports issued the same day.",
  },
  {
    stage: "Mid-line & finishing",
    body: "Measurement checks against the approved size set, plus wash, print and embroidery quality verified before the goods reach packing.",
  },
  {
    stage: "Final random inspection",
    body: "Inspected to AQL 2.5 for major and 1.5 for minor defects as standard, or to your own protocol. Third-party inspection coordinated on request.",
  },
];

export default function CompliancePage() {
  return (
    <>
      <PageHero
        eyebrow="Compliance & quality"
        title="We check the factory before your order does."
        lead="A compliance failure is not a paperwork problem — it is a shipment held, a retailer delisting you, and a story you have to answer for. So the screening happens before we place anything, and it keeps happening while the order runs."
      />

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Factory screening"
            title="What a unit has to clear before we place an order in it."
            lead="Six checks, all of them documented. If a factory cannot evidence one of them, it does not go on the shortlist — regardless of how good the price is."
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink-100 bg-ink-100 md:grid-cols-2 lg:grid-cols-3">
            {screening.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 70}>
                <div className="h-full bg-paper p-8">
                  <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-600">
                    <Shield width={19} height={19} />
                  </span>
                  <h3 className="mt-5 font-display text-[17px] font-semibold text-ink-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="relative overflow-hidden border-y border-ink-100 bg-ink-950 text-paper">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid text-white/[0.045]"
        />
        <Container className="relative">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-4">
              <SectionHeading
                inverted
                eyebrow="Quality assurance"
                title="Four checkpoints, not one."
                lead="Final inspection is the last place you want to find a problem. Our QA is on the line while the goods are still being made."
              />
            </div>
            <ol className="lg:col-span-8">
              {qaStages.map((item, i) => (
                <Reveal key={item.stage} as="li" delay={i * 70}>
                  <div className="flex gap-6 border-b border-white/10 py-7 first:pt-0">
                    <span className="font-display text-2xl font-semibold text-brand-400/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-paper">
                        {item.stage}
                      </h3>
                      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-400">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Standards"
            title="Certifications across our partner base."
            lead="Not every factory holds every certification. We match the unit to the standard your buyer or retailer actually requires, and send you the current certificate before production starts."
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink-100 bg-ink-100 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((cert, i) => (
              <Reveal key={cert.name} delay={(i % 4) * 60}>
                <div className="h-full bg-paper p-7 text-center">
                  <p className="font-display text-xl font-semibold tracking-tight text-ink-900">
                    {cert.name}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-500">
                    {cert.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-12 flex flex-col gap-6 rounded-2xl border border-brand-200 bg-brand-50 p-8 sm:flex-row sm:items-center sm:p-10">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
                <Check width={22} height={22} strokeWidth={2} />
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold text-ink-900">
                  Bring your own code of conduct
                </h3>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-600">
                  If your business runs its own supplier code or requires a
                  specific audit scheme, send it with your enquiry. We will map
                  it against our partner base and tell you which units already
                  comply and which would need to be brought up to it.
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <CtaBand
        title="Want to see the audit file before you commit?"
        body="Ask us for the compliance profile of the unit we are proposing. You will get the current audit status, certification list and remediation history before a single order is placed."
      />
    </>
  );
}
