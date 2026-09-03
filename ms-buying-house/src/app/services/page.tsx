import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/cta-band";
import { Check, serviceIcons } from "@/components/icons";
import { services } from "@/content/services";
import { process } from "@/content/process";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Factory sourcing, product development, open costing, inline quality assurance, compliance audit and shipping — the full buying-house service from Dhaka.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="A full buying office, without the overhead of opening one."
        lead="Setting up your own sourcing office in Dhaka means an office, a payroll, a QA team and years of factory relationships. We are that team, working for your programme."
      />

      <Section>
        <Container>
          <div className="space-y-4">
            {services.map((service, i) => {
              const Icon =
                serviceIcons[service.slug as keyof typeof serviceIcons];
              return (
                <Reveal key={service.slug} as="article" delay={40}>
                  <div id={service.slug} className="scroll-mt-28 rounded-2xl border border-ink-100 bg-paper p-8 sm:p-10 lg:p-12">
                    <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
                      <div className="lg:col-span-5">
                        <div className="flex items-center gap-4">
                          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-ink-900 text-brand-300">
                            <Icon width={22} height={22} />
                          </span>
                          <span className="font-display text-[13px] font-semibold text-ink-300">
                            {String(i + 1).padStart(2, "0")} / 06
                          </span>
                        </div>
                        <h2 className="mt-6 font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
                          {service.title}
                        </h2>
                        <p className="mt-4 text-[16px] leading-relaxed text-ink-500">
                          {service.summary}
                        </p>
                      </div>
                      <div className="lg:col-span-7">
                        <ul className="grid gap-3 sm:grid-cols-2">
                          {service.points.map((point) => (
                            <li
                              key={point}
                              className="flex items-start gap-3 rounded-xl bg-sand-100/70 px-4 py-4 text-[15px] leading-relaxed text-ink-700"
                            >
                              <Check
                                className="mt-0.5 shrink-0 text-brand-600"
                                strokeWidth={2}
                              />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section className="border-t border-ink-100 bg-sand-100/50">
        <Container>
          <SectionHeading
            eyebrow="Engagement model"
            title="How we charge, plainly."
            lead="One commission on the FOB value, agreed in writing before development begins. Enquiry, feasibility and costing cost you nothing."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Commission on FOB",
                body: "A single agreed percentage of the shipped FOB value. No development fees, no sample handling charges, no surprises on the invoice.",
              },
              {
                title: "You see the factory price",
                body: "Costing sheets show the factory's number and our commission separately. You always know what the garment costs and what the service costs.",
              },
              {
                title: "Paid on performance",
                body: "Commission is settled against shipped goods. If a shipment does not go, we do not get paid for it — which is exactly the incentive you want.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-ink-100 bg-paper p-8">
                  <h3 className="font-display text-lg font-semibold text-ink-900">
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

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Timeline"
            title="What a typical programme looks like."
          />
          <ol className="mt-12 border-l border-ink-100">
            {process.map((item, i) => (
              <Reveal key={item.step} as="li" delay={i * 60}>
                <div className="relative pb-10 pl-8 sm:pl-12">
                  <span
                    aria-hidden
                    className="absolute top-1.5 -left-[6.5px] size-3 rounded-full border-2 border-paper bg-brand-500"
                  />
                  <span className="eyebrow text-brand-600">Step {item.step}</span>
                  <h3 className="mt-2 font-display text-xl font-semibold text-ink-900">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-ink-500">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
