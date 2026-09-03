import { Container } from "./container";
import { Reveal } from "./reveal";
import { stats } from "@/content/site";

export function StatBand() {
  return (
    <div className="border-y border-ink-100 bg-sand-100/60">
      <Container>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 70}>
              <div>
                <dt className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
                  {stat.value}
                </dt>
                <dd className="mt-2.5">
                  <span className="block text-[14px] font-semibold text-ink-800">
                    {stat.label}
                  </span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-ink-500">
                    {stat.detail}
                  </span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </div>
  );
}
