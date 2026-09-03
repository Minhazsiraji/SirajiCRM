import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { ContactForm } from "@/components/contact-form";
import { Mail, Phone, Pin } from "@/components/icons";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send M&S Buying House your tech pack, sketch or reference garment for a feasibility read, indicative pricing and a realistic lead time.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what you are making."
        lead="A tech pack is ideal, but a photograph and a target price is enough to start. You will get feasibility, an indicative price band and a realistic lead time — usually within two working days."
      />

      <Section>
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            <aside className="lg:col-span-5">
              <div className="rounded-2xl border border-ink-100 bg-sand-100/60 p-8">
                <h2 className="font-display text-xl font-semibold text-ink-900">
                  Sourcing desk
                </h2>
                <ul className="mt-6 space-y-5 text-[15px]">
                  <li className="flex gap-3.5">
                    <Mail className="mt-0.5 shrink-0 text-brand-600" />
                    <div>
                      <span className="block text-[13px] font-semibold text-ink-400">
                        Email
                      </span>
                      <a
                        href={`mailto:${site.email}`}
                        className="text-ink-900 hover:text-brand-600"
                      >
                        {site.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3.5">
                    <Phone className="mt-0.5 shrink-0 text-brand-600" />
                    <div>
                      <span className="block text-[13px] font-semibold text-ink-400">
                        Phone / WhatsApp
                      </span>
                      <a
                        href={`tel:${site.phone.replace(/\s/g, "")}`}
                        className="text-ink-900 hover:text-brand-600"
                      >
                        {site.phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3.5">
                    <Pin className="mt-0.5 shrink-0 text-brand-600" />
                    <div>
                      <span className="block text-[13px] font-semibold text-ink-400">
                        Office
                      </span>
                      <span className="text-ink-900">
                        {site.address.line1}
                        <br />
                        {site.address.line2}
                        <br />
                        {site.address.country}
                      </span>
                    </div>
                  </li>
                </ul>
                <p className="mt-7 border-t border-ink-200 pt-5 text-[14px] leading-relaxed text-ink-500">
                  Office hours are {site.hours}. Enquiries sent over the weekend
                  are answered on Sunday morning Dhaka time.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-ink-100 bg-paper p-8">
                <h2 className="font-display text-lg font-semibold text-ink-900">
                  What to include
                </h2>
                <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-ink-600">
                  {[
                    "Product type, fabric and construction",
                    "Target quantity and colour breakdown",
                    "Target FOB price, if you have one",
                    "Required delivery window",
                    "Any certification your buyer requires",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-500"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[14px] leading-relaxed text-ink-500">
                  Have files? Send the enquiry first — we will reply with a
                  secure link for tech packs, artwork and reference images.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
