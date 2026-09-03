"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "./container";
import { Logo } from "./logo";
import { ArrowRight } from "./icons";
import { nav } from "@/content/site";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on navigation, and lock the page behind it while open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-ink-100 bg-paper/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <Container>
        <div className="flex h-18 items-center justify-between gap-4">
          <Link href="/" aria-label="M&S Buying House — home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors",
                    active
                      ? "bg-ink-900/5 text-ink-900"
                      : "text-ink-500 hover:text-ink-900",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/contact"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-ink-900 px-5 text-[14px] font-medium text-paper transition-colors hover:bg-brand-600"
            >
              Request a quote
              <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="-mr-2 grid size-11 place-items-center rounded-full text-ink-800 transition-colors hover:bg-ink-900/5 lg:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className="relative block h-3.5 w-5">
              <span
                className={cn(
                  "absolute left-0 block h-[1.5px] w-5 bg-current transition-all duration-300",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-[1.5px] w-5 bg-current transition-all duration-300",
                  open ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>
      </Container>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className={cn(
          "overflow-hidden border-t border-ink-100 bg-paper transition-[max-height] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden",
          open ? "max-h-[32rem]" : "max-h-0 border-t-transparent",
        )}
      >
        <Container className="py-4">
          <ul className="flex flex-col">
            {[...nav, { href: "/faq", label: "FAQ" }].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between border-b border-ink-100 py-3.5 font-display text-lg font-medium text-ink-900"
                >
                  {item.label}
                  <ArrowRight className="text-ink-300" />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="mt-5 flex h-12 items-center justify-center rounded-full bg-brand-500 font-medium text-white"
          >
            Request a quote
          </Link>
        </Container>
      </div>
    </header>
  );
}
