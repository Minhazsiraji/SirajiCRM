import { Container } from "./container";
import { Button } from "./button";
import { ArrowRight } from "./icons";
import { site } from "@/content/site";

export function CtaBand({
  title = "Have a tech pack, a sketch, or just a reference garment?",
  body = "Send it over. You will get a feasibility read, an indicative price band and a realistic lead time — usually within two working days, and always from a person, not a form letter.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink-900 text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-weave text-white/[0.04]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-24 size-[34rem] rounded-full bg-brand-500/18 blur-3xl"
      />
      <Container className="relative">
        <div className="flex flex-col items-start gap-10 py-20 sm:py-24 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="display-2 text-paper">{title}</h2>
            <p className="mt-5 text-[17px] leading-relaxed text-ink-300">
              {body}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button href="/contact" variant="primary" size="lg">
              Request a quote
              <ArrowRight />
            </Button>
            <Button href={`mailto:${site.email}`} variant="ghost" size="lg">
              Email the sourcing desk
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
