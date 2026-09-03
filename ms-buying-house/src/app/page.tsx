import Link from "next/link";
import { Container } from "@/components/container";
import { Button } from "@/components/button";
import { Reveal } from "@/components/reveal";
import { Section, SectionHeading } from "@/components/section";
import { StatBand } from "@/components/stat-band";
import { Marquee } from "@/components/marquee";
import { CtaBand } from "@/components/cta-band";
import { Accordion } from "@/components/accordion";
import { ArrowRight, Check, categoryIcons, serviceIcons } from "@/components/icons";
import { markets, site } from "@/content/site";
import { services } from "@/content/services";
import { categories } from "@/content/products";
import { process } from "@/content/process";
import { faqs } from "@/content/faqs";

const toneClasses = {
  emerald: "from-brand-500/25 via-brand-500/8 to-transparent text-brand-700",
  ink: "from-ink-900/18 via-ink-900/6 to-transparent text-ink-800",
  clay: "from-clay-500/25 via-clay-500/8 to-transparent text-clay-600",
  sand: "from-sand-300/70 via-sand-300/25 to-transparent text-ink-700",
} as const;

function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = categoryIcons[slug as keyof typeof categoryIcons];
  return Icon ? <Icon className={className} strokeWidth={0.8} aria-hidden /> : null;
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatBand />
      <ValueProps />
      <ServicesPreview />
      <ProductsPreview />
      <ProcessSection />
      <WhyBangladesh />
      <FaqPreview />
      <CtaBand />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-paper">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid text-white/[0.05]" />
        <div className="absolute -top-52 -left-32 size-[42rem] rounded-full bg-brand-600/25 blur-[120px]" />
        <div className="absolute -right-40 -bottom-52 size-[38rem] rounded-full bg-clay-500/14 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-16 py-20 sm:py-28 lg:grid-cols-12 lg:py-32">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 py-1.5 pr-4 pl-1.5 text-[13px] font-medium text-ink-200 backdrop-blur">
                <span className="rounded-full bg-brand-400 px-2.5 py-1 text-[11px] font-bold tracking-wide text-ink-950 uppercase">
                  Dhaka
                </span>
                Sourcing partner since {site.founded}
              </p>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="display-1 mt-7 max-w-xl text-paper">
                Your apparel supply chain in Bangladesh,{" "}
                <span className="text-brand-300">answered by name.</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-7 max-w-xl text-[18px] leading-relaxed text-ink-300">
                M&amp;S Buying House places global brands with vetted
                Bangladeshi factories — then owns the programme end to end.
                Costing, development, compliance, inline quality and on-time
                shipment, run by one merchandiser who knows your file.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button href="/contact" variant="primary" size="lg">
                  Request a quote
                  <ArrowRight />
                </Button>
                <Button href="/products" variant="ghost" size="lg">
                  Browse product categories
                </Button>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <ul className="mt-11 flex flex-wrap gap-x-7 gap-y-3 text-[14px] text-ink-300">
                {[
                  "No minimum-order guesswork",
                  "Open costing",
                  "Inline QA, not just final inspection",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="text-brand-400" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Abstract "programme card" — a graphic stand-in for photography. */}
          <Reveal delay={200} className="lg:col-span-5">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-brand-400/25 via-transparent to-clay-500/15 blur-xl"
              />
              <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.045] p-7 backdrop-blur-md">
                <div
                  aria-hidden
                  className="absolute -top-20 -right-20 size-56 rounded-full bg-weave text-white/[0.05]"
                />
                <p className="eyebrow text-brand-300">Live programme</p>
                <p className="mt-3 font-display text-2xl font-semibold text-paper">
                  AW26 · Organic jersey tee
                </p>

                <dl className="mt-7 space-y-4 text-[14px]">
                  {[
                    ["Factory", "Partner unit · Gazipur"],
                    ["Quantity", "24,000 pcs · 4 colours"],
                    ["Fabric", "180 gsm GOTS single jersey"],
                    ["Terms", "FOB Chattogram"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3.5"
                    >
                      <dt className="text-ink-400">{k}</dt>
                      <dd className="text-right font-medium text-paper">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-7">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-ink-400">Production status</span>
                    <span className="font-semibold text-brand-300">
                      Sewing · 68%
                    </span>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-brand-500 to-brand-300" />
                  </div>
                  <ul className="mt-5 grid grid-cols-4 gap-2 text-center text-[11px]">
                    {[
                      ["Sampling", true],
                      ["Fabric", true],
                      ["Sewing", true],
                      ["Shipment", false],
                    ].map(([stage, done]) => (
                      <li
                        key={stage as string}
                        className={
                          done
                            ? "rounded-lg bg-brand-500/15 py-2 font-medium text-brand-200"
                            : "rounded-lg bg-white/5 py-2 text-ink-500"
                        }
                      >
                        {stage as string}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-6 text-[12px] leading-relaxed text-ink-500">
                  Illustrative dashboard. Every buyer gets a weekly written
                  status against the agreed time-and-action calendar.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function ValueProps() {
  const items = [
    {
      title: "One merchandiser, not a queue",
      body: "You get a named contact who owns your file from costing through to shipment, and who works your hours when it matters. No handing you round a department.",
    },
    {
      title: "Open costing, always",
      body: "Fabric, trims, CM and freight, broken out line by line. If we hit a target price, you will see exactly which lever moved — never a silent substitution.",
    },
    {
      title: "Quality caught on the line",
      body: "Our QA sits inside the factory. Inline inspections through the sewing run mean defects get corrected while they are cheap, not discovered at final inspection.",
    },
    {
      title: "Compliance before the order",
      body: "Every partner unit is screened for social, structural and environmental compliance before it touches your goods — and re-screened while it runs them.",
    },
  ];

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Why buyers stay"
          title="A buying house should absorb risk, not add a layer to it."
          lead="Plenty of agents will forward your tech pack and take a margin. We take on the parts of the programme that actually go wrong — capacity, costing, quality and delivery — and answer for them."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink-100 bg-ink-100 sm:grid-cols-2">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <div className="h-full bg-paper p-8 transition-colors duration-300 hover:bg-sand-100/60 sm:p-10">
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
  );
}

function ServicesPreview() {
  return (
    <Section className="border-y border-ink-100 bg-sand-100/50">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="What we do"
            title="Everything between your brief and your warehouse."
          />
          <Link
            href="/services"
            className="group inline-flex shrink-0 items-center gap-2 text-[15px] font-medium text-ink-900 hover:text-brand-600"
          >
            All services
            <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = serviceIcons[service.slug as keyof typeof serviceIcons];
            return (
              <Reveal key={service.slug} delay={(i % 3) * 80}>
                <Link
                  href={`/services#${service.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-ink-100 bg-paper p-7 transition-all duration-300 hover:-translate-y-1 hover:border-ink-200 hover:shadow-[0_18px_40px_-24px_rgba(6,10,9,0.35)]"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-ink-900 text-brand-300 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                    <Icon width={20} height={20} />
                  </span>
                  <h3 className="mt-6 font-display text-lg font-semibold text-ink-900">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-500">
                    {service.summary}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-brand-600">
                    Read more
                    <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

function ProductsPreview() {
  return (
    <Section>
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Product capability"
            title="Six categories, deep factory coverage in each."
          />
          <Link
            href="/products"
            className="group inline-flex shrink-0 items-center gap-2 text-[15px] font-medium text-ink-900 hover:text-brand-600"
          >
            Full capability list
            <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => (
            <Reveal key={category.slug} delay={(i % 3) * 80}>
              <Link
                href={`/products#${category.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-paper transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(6,10,9,0.35)]"
              >
                <div
                  className={`relative h-36 overflow-hidden bg-gradient-to-br ${toneClasses[category.tone]}`}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-weave opacity-[0.09]"
                  />
                  <CategoryIcon
                    slug={category.slug}
                    className="absolute -top-3 -right-3 size-32 opacity-[0.16] transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute bottom-4 left-6 font-display text-[13px] font-semibold tracking-wide uppercase">
                    {category.moq}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-display text-lg font-semibold text-ink-900">
                    {category.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
                    {category.blurb}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {category.items.slice(0, 3).map((item) => (
                      <li
                        key={item}
                        className="rounded-full bg-sand-100 px-2.5 py-1 text-[12px] text-ink-600"
                      >
                        {item}
                      </li>
                    ))}
                    {category.items.length > 3 ? (
                      <li className="rounded-full bg-sand-100 px-2.5 py-1 text-[12px] text-ink-400">
                        +{category.items.length - 3}
                      </li>
                    ) : null}
                  </ul>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function ProcessSection() {
  return (
    <Section className="relative overflow-hidden border-y border-ink-100 bg-ink-950 text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid text-white/[0.045]"
      />
      <Container className="relative">
        <SectionHeading
          inverted
          eyebrow="How it runs"
          title="Six stages from enquiry to shipment."
          lead="Every programme follows the same spine, so you always know which stage you are in and what is due next."
        />

        <ol className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-2 lg:grid-cols-3">
          {process.map((item, i) => (
            <Reveal key={item.step} as="li" delay={(i % 3) * 80}>
              <div className="h-full bg-ink-950 p-8">
                <span className="font-display text-3xl font-semibold text-brand-400/70">
                  {item.step}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-paper">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

function WhyBangladesh() {
  return (
    <Section>
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Why Bangladesh"
              title="The second-largest apparel exporter in the world — if you can navigate it."
              lead="Bangladesh offers a depth of skilled sewing capacity, competitive costs and duty-free access to the EU and UK that few origins can match. The difficulty was never capability; it is knowing which of thousands of factories is right for your programme, and holding them to it."
            />
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/about" variant="dark">
                About M&amp;S
                <ArrowRight />
              </Button>
              <Button href="/compliance" variant="outline">
                How we vet factories
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  title: "Duty advantage",
                  body: "Duty-free access to the EU under EBA and to the UK under DCTS, subject to rules of origin we help you document correctly.",
                },
                {
                  title: "Depth of capacity",
                  body: "Thousands of export-oriented units across knit, woven, sweater and outerwear — including the vertically integrated mills that shorten lead times.",
                },
                {
                  title: "Green manufacturing",
                  body: "Bangladesh hosts one of the world's largest concentrations of LEED-certified apparel factories, several of them in our partner base.",
                },
                {
                  title: "Cost discipline",
                  body: "Competitive CM rates that hold up at volume — provided the costing is transparent and consumption is calculated honestly.",
                },
              ].map((item, i) => (
                <Reveal key={item.title} delay={i * 70}>
                  <div className="h-full rounded-2xl border border-ink-100 bg-sand-100/50 p-7">
                    <h3 className="font-display text-[17px] font-semibold text-ink-900">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
                      {item.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-ink-100 pt-10">
          <p className="eyebrow mb-6 text-center text-ink-400">
            Shipping to buyers in
          </p>
          <Marquee items={markets} />
        </div>
      </Container>
    </Section>
  );
}

function FaqPreview() {
  return (
    <Section className="border-t border-ink-100 bg-sand-100/50">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="Common questions"
              title="The things buyers ask first."
              lead="Minimums, lead times, how we charge, and what happens when something goes wrong."
            />
            <Link
              href="/faq"
              className="group mt-7 inline-flex items-center gap-2 text-[15px] font-medium text-ink-900 hover:text-brand-600"
            >
              See all questions
              <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="lg:col-span-8">
            <Accordion items={faqs.slice(0, 5)} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
