import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { Accordion } from "@/components/accordion";
import { CtaBand } from "@/components/cta-band";
import { faqs } from "@/content/faqs";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Minimum order quantities, lead times, commission, factory visits, shipping terms and what happens when quality goes wrong.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Straight answers to the questions buyers ask first."
        lead="If yours is not here, ask it directly — we would rather answer a hard question now than discover the misunderstanding at pre-production."
      />

      <Section>
        <Container className="max-w-3xl">
          <Accordion items={faqs} />
        </Container>
      </Section>

      <CtaBand
        title="Still deciding whether we are the right fit?"
        body="Send the question. If the honest answer is that another partner suits your programme better, we will say so — it costs us nothing and saves you a season."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
