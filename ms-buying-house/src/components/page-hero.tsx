import { Container } from "./container";
import { Reveal } from "./reveal";

export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-ink-100 bg-ink-950 text-paper">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid text-white/[0.05]" />
        <div className="absolute -top-40 left-1/3 size-[34rem] rounded-full bg-brand-600/22 blur-[120px]" />
      </div>
      <Container className="relative">
        <div className="max-w-3xl py-20 sm:py-24">
          <Reveal>
            <p className="eyebrow flex items-center gap-2.5 text-brand-300">
              <span aria-hidden className="h-px w-6 bg-current opacity-50" />
              {eyebrow}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="display-1 mt-5 text-paper">{title}</h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-7 max-w-2xl text-[18px] leading-relaxed text-ink-300">
              {lead}
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
