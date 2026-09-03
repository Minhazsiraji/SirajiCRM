import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/cta-band";
import { Leaf } from "@/components/icons";

export const metadata: Metadata = {
  title: "Sustainability",
  description:
    "Certified organic and recycled materials, reduced-water denim finishing, traceable supply chains and honest reporting — sustainability handled as sourcing work, not marketing.",
  alternates: { canonical: "/sustainability" },
};

const pillars = [
  {
    title: "Materials with a certificate behind them",
    body: "GOTS organic cotton, GRS recycled polyester, BCI cotton and OEKO-TEX 100 tested fabrics — sourced with transaction certificates you can show a retailer, not a supplier's word.",
  },
  {
    title: "Water and energy in wet processing",
    body: "Denim finishing at partner laundries using laser and ozone in place of manual sanding and heavy rinsing, cutting water use per garment substantially against conventional processing.",
  },
  {
    title: "Traceability to the mill",
    body: "For programmes that need it, we document the chain back through the dye house and the mill, so your due-diligence reporting rests on records rather than assumptions.",
  },
  {
    title: "Waste and packaging",
    body: "Cutting-waste recovery to recycling partners, and polybag alternatives — recycled or FSC-certified paper packaging — costed properly at the quotation stage.",
  },
];

const honesty = [
  "We do not describe a fabric as sustainable without the certificate that supports it.",
  "Certified materials usually cost more. We show you the difference in the costing sheet rather than absorbing it into a headline price.",
  "Where a claim cannot be evidenced through the chain, we tell you it cannot — before it goes anywhere near your label or your website.",
];

export default function SustainabilityPage() {
  return (
    <>
      <PageHero
        eyebrow="Sustainability"
        title="Claims you can evidence, or we do not make them."
        lead="Responsible sourcing is not a page on a website — it is a certificate that survives an audit and a chain you can document. Here is what we can genuinely deliver, and where the limits are."
      />

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {pillars.map((pillar, i) => (
              <Reveal key={pillar.title} delay={(i % 2) * 80}>
                <div className="h-full rounded-2xl border border-ink-100 bg-paper p-8 sm:p-10">
                  <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <Leaf width={21} height={21} />
                  </span>
                  <h2 className="mt-6 font-display text-xl font-semibold text-ink-900">
                    {pillar.title}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
                    {pillar.body}
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
          className="pointer-events-none absolute inset-0 bg-weave text-white/[0.04]"
        />
        <Container className="relative">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <SectionHeading
                inverted
                eyebrow="Green manufacturing"
                title="Bangladesh is further along than its reputation suggests."
                lead="The country hosts one of the world's largest concentrations of LEED-certified apparel factories, several of them in our partner base. Rooftop solar, water recycling and heat recovery are increasingly normal in the newer units — not exceptional."
              />
            </div>
            <div className="lg:col-span-7">
              <h3 className="font-display text-xl font-semibold text-paper">
                Where we hold the line
              </h3>
              <ul className="mt-6 space-y-4">
                {honesty.map((item, i) => (
                  <Reveal key={item} as="li" delay={i * 70}>
                    <div className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.035] p-5 text-[15px] leading-relaxed text-ink-300">
                      <span
                        aria-hidden
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-400"
                      />
                      {item}
                    </div>
                  </Reveal>
                ))}
              </ul>
              <p className="mt-7 text-[14px] leading-relaxed text-ink-500">
                It is a slower way to sell a programme. It is also the only
                version that holds up when a retailer, a regulator or a customer
                asks you to prove it.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Building a certified programme?"
        body="Tell us the standard you need to meet — GOTS, GRS, OEKO-TEX or your own retailer's scheme — and we will come back with the units that already hold it and what it does to your cost."
      />
    </>
  );
}
