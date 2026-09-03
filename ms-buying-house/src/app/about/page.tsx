import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { StatBand } from "@/components/stat-band";
import { CtaBand } from "@/components/cta-band";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "M&S Buying House is a Dhaka-based apparel sourcing partner working with global brands, retailers and wholesalers — how we work and what we hold ourselves to.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    title: "Say the difficult thing early",
    body: "If a target price is not achievable, if a delivery date is unrealistic, or if a factory is the wrong fit, you hear it at the quotation stage. Late honesty is just a delay with an apology attached.",
  },
  {
    title: "One file, one owner",
    body: "A named merchandiser carries your programme from costing to shipment. They know the fabric, the fit history and the factory's habits — because that context is what prevents mistakes.",
  },
  {
    title: "The factory is not a secret",
    body: "You know which unit is making your goods, and you are welcome inside it. Agents who hide the factory are protecting their margin, not your supply chain.",
  },
  {
    title: "Paid when it ships",
    body: "Our commission is settled against shipped goods. It keeps our incentives pointed at the same thing yours are — product on a vessel, on time, correct.",
  },
];

const team = [
  {
    role: "Merchandising",
    body: "Costing, development, approvals and the weekly status report. Your day-to-day contact and the person who chases the factory when a date slips.",
  },
  {
    role: "Quality assurance",
    body: "In-factory inspectors covering inline, mid-line and final inspection, reporting with photographs against your approved samples and AQL.",
  },
  {
    role: "Compliance",
    body: "Factory screening, audit review, corrective-action follow-up and the documentation your buyers ask for at onboarding.",
  },
  {
    role: "Logistics & documentation",
    body: "Booking, consolidation, export clearance and the document set — so goods and paperwork move together.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="A buying house built around the parts that usually go wrong."
        lead={`M&S Buying House has worked out of Dhaka since ${site.founded}, placing programmes for brands, retailers and wholesalers who need Bangladesh to work without having to move to it.`}
      />

      <Section>
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-7">
              <SectionHeading
                eyebrow="Our position"
                title="Sourcing is not the hard part. Holding it together is."
              />
              <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-ink-600">
                <p>
                  Bangladesh has no shortage of capable factories. What it has
                  is a matching problem: thousands of units of wildly different
                  quality, capacity and compliance standing, and a buyer on the
                  other side of the world with no reliable way to tell them
                  apart before the order is already running.
                </p>
                <p>
                  That gap is where money is lost — a unit that took a
                  programme it did not have the machines for, a costing that
                  quietly changed the fabric, a delivery date that was never
                  achievable, a compliance certificate that expired two audits
                  ago.
                </p>
                <p>
                  We exist to close it. We know which units genuinely fit a
                  given product, we cost it in the open, and we put our own
                  people on the sewing line while it is being made. When
                  something goes wrong, it is ours to fix before it becomes
                  yours to explain.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-ink-100 bg-sand-100/60 p-8 sm:p-10">
                <h3 className="font-display text-xl font-semibold text-ink-900">
                  Who we work with
                </h3>
                <ul className="mt-6 space-y-5 text-[15px] leading-relaxed text-ink-600">
                  <li>
                    <strong className="block font-semibold text-ink-900">
                      Retailers &amp; wholesalers
                    </strong>
                    Repeat and seasonal programmes at volume, with fixed
                    delivery windows and retailer compliance requirements.
                  </li>
                  <li>
                    <strong className="block font-semibold text-ink-900">
                      Emerging &amp; DTC brands
                    </strong>
                    First and second production runs, where the tech pack still
                    needs work and the minimums have to be negotiated.
                  </li>
                  <li>
                    <strong className="block font-semibold text-ink-900">
                      Uniform &amp; workwear buyers
                    </strong>
                    Specification-driven contracts where consistency across
                    repeat orders matters more than novelty.
                  </li>
                  <li>
                    <strong className="block font-semibold text-ink-900">
                      Importers &amp; distributors
                    </strong>
                    Multi-category books consolidated across several factories
                    into single shipments.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <StatBand />

      <Section>
        <Container>
          <SectionHeading
            eyebrow="How we operate"
            title="Four commitments we will be held to."
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink-100 bg-ink-100 sm:grid-cols-2">
            {principles.map((item, i) => (
              <Reveal key={item.title} delay={(i % 2) * 80}>
                <div className="h-full bg-paper p-8 sm:p-10">
                  <span className="font-display text-[13px] font-semibold text-brand-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold text-ink-900">
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

      <Section className="border-t border-ink-100 bg-sand-100/50">
        <Container>
          <SectionHeading
            eyebrow="The team"
            title="Four functions, one accountable office."
            lead="Wherever your enquiry starts, it is handled by people who sit in the same building and share the same file."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((item, i) => (
              <Reveal key={item.role} delay={(i % 4) * 70}>
                <div className="h-full rounded-2xl border border-ink-100 bg-paper p-7">
                  <h3 className="font-display text-lg font-semibold text-ink-900">
                    {item.role}
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

      <CtaBand />
    </>
  );
}
