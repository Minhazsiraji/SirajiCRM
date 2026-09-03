import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/cta-band";
import { categoryIcons, Check } from "@/components/icons";
import { categories } from "@/content/products";

export const metadata: Metadata = {
  title: "Product capability",
  description:
    "Knitwear, woven shirting, denim, outerwear, flat-knit sweaters and kidswear — sourced from vetted Bangladeshi factories with realistic minimums.",
  alternates: { canonical: "/products" },
};

const toneClasses = {
  emerald: "from-brand-500/28 via-brand-500/8 to-transparent text-brand-700",
  ink: "from-ink-900/20 via-ink-900/6 to-transparent text-ink-800",
  clay: "from-clay-500/28 via-clay-500/8 to-transparent text-clay-600",
  sand: "from-sand-300/80 via-sand-300/25 to-transparent text-ink-700",
} as const;

const fabrics = [
  "Combed & carded cotton jersey",
  "Organic cotton (GOTS)",
  "Recycled polyester (GRS)",
  "Cotton–elastane blends",
  "French terry & fleece",
  "Rib & interlock",
  "Poplin & twill",
  "Oxford & chambray",
  "Denim, 8–14 oz",
  "Corduroy",
  "Viscose & rayon",
  "Linen & linen blends",
  "Ripstop & taslan shell",
  "Melange & slub yarns",
];

const finishes = [
  "Screen, pigment & discharge print",
  "All-over & digital print",
  "Embroidery & appliqué",
  "Garment dye & wash",
  "Enzyme, stone & acid wash",
  "Laser & ozone denim finishing",
  "Sublimation",
  "Puff & high-density print",
];

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Product capability"
        title="What we make, and the minimums that come with it."
        lead="Our partner base is built around six categories. If your product sits outside them, ask anyway — we will tell you honestly whether we can place it well or whether you are better served elsewhere."
      />

      <Section>
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            {categories.map((category, i) => {
              const Icon = categoryIcons[category.slug as keyof typeof categoryIcons];
              return (
              <Reveal key={category.slug} as="article" delay={(i % 2) * 80}>
                <div
                  id={category.slug}
                  className="flex h-full scroll-mt-28 flex-col overflow-hidden rounded-2xl border border-ink-100 bg-paper"
                >
                  <div
                    className={`relative h-40 overflow-hidden bg-gradient-to-br ${toneClasses[category.tone]}`}
                  >
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-weave opacity-[0.09]"
                    />
                    <Icon
                      className="absolute -top-4 -right-4 size-40 opacity-[0.15]"
                      strokeWidth={0.7}
                      aria-hidden
                    />
                    <span className="absolute bottom-5 left-8 rounded-full bg-paper/85 px-3 py-1.5 font-display text-[12px] font-semibold tracking-wide uppercase backdrop-blur">
                      {category.moq}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-8">
                    <h2 className="font-display text-2xl font-semibold text-ink-900">
                      {category.title}
                    </h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
                      {category.blurb}
                    </p>
                    <ul className="mt-6 grid gap-2.5">
                      {category.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-3 text-[15px] text-ink-700"
                        >
                          <Check
                            className="shrink-0 text-brand-600"
                            strokeWidth={2}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section className="border-y border-ink-100 bg-sand-100/50">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeading eyebrow="Materials" title="Fabrics we work in." />
              <ul className="mt-8 flex flex-wrap gap-2">
                {fabrics.map((fabric) => (
                  <li
                    key={fabric}
                    className="rounded-full border border-ink-200 bg-paper px-3.5 py-2 text-[14px] text-ink-700"
                  >
                    {fabric}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeading
                eyebrow="Finishing"
                title="Prints, washes and embellishment."
              />
              <ul className="mt-8 flex flex-wrap gap-2">
                {finishes.map((finish) => (
                  <li
                    key={finish}
                    className="rounded-full border border-ink-200 bg-paper px-3.5 py-2 text-[14px] text-ink-700"
                  >
                    {finish}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Reveal>
            <div className="mt-14 rounded-2xl border border-ink-200 bg-paper p-8 sm:p-10">
              <h3 className="font-display text-xl font-semibold text-ink-900">
                A note on minimums
              </h3>
              <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink-500">
                The figures above are the practical minimums for a normal
                production run at a good price. They move — down with in-stock
                fabric or a repeat style, up if you need a bespoke yarn or a
                mill-specific finish. Tell us the volume you actually have and
                we will tell you what it makes possible, rather than quoting a
                number and renegotiating later.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <CtaBand
        title="Send us the product and we will tell you where it should be made."
        body="A photo, a sketch or a full tech pack is enough to start. We come back with feasibility, an indicative price band and the factory type that fits."
      />
    </>
  );
}
