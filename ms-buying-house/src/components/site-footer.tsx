import Link from "next/link";
import { Container } from "./container";
import { Logo } from "./logo";
import { Mail, Phone, Pin } from "./icons";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { categories } from "@/content/products";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-ink-300">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid text-white/[0.045]"
      />
      <Container className="relative">
        <div className="grid gap-12 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-4">
            <Logo inverted />
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-ink-400">
              {site.description}
            </p>
            <ul className="mt-6 space-y-3 text-[14px]">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2.5 text-ink-200 transition-colors hover:text-brand-300"
                >
                  <Mail className="shrink-0 text-brand-400" />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2.5 text-ink-200 transition-colors hover:text-brand-300"
                >
                  <Phone className="shrink-0 text-brand-400" />
                  {site.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-ink-400">
                <Pin className="mt-0.5 shrink-0 text-brand-400" />
                <span>
                  {site.address.line1}
                  <br />
                  {site.address.line2}, {site.address.country}
                </span>
              </li>
            </ul>
          </div>

          <FooterCol
            title="Services"
            className="md:col-span-3"
            links={services.map((s) => ({
              href: `/services#${s.slug}`,
              label: s.title,
            }))}
          />
          <FooterCol
            title="Products"
            className="md:col-span-3"
            links={categories.map((c) => ({
              href: `/products#${c.slug}`,
              label: c.title,
            }))}
          />
          <FooterCol
            title="Company"
            className="md:col-span-2"
            links={[
              { href: "/about", label: "About us" },
              { href: "/compliance", label: "Compliance" },
              { href: "/sustainability", label: "Sustainability" },
              { href: "/faq", label: "FAQ" },
              { href: "/contact", label: "Contact" },
            ]}
          />
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-[13px] text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>
            Dhaka, Bangladesh · Office hours {site.hours}
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  className,
}: {
  title: string;
  links: { href: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="eyebrow text-ink-500">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-[14px]">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="text-ink-300 transition-colors hover:text-brand-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
