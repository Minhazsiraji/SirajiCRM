/** Native <details> disclosure — keyboard accessible and works without JS. */
export function Accordion({
  items,
}: {
  items: readonly { q: string; a: string }[];
}) {
  return (
    <div className="divide-y divide-ink-100 border-y border-ink-100">
      {items.map((item) => (
        <details key={item.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 font-display text-[17px] font-medium text-ink-900 transition-colors hover:text-brand-600 [&::-webkit-details-marker]:hidden">
            {item.q}
            <span
              aria-hidden
              className="relative mt-1.5 grid size-6 shrink-0 place-items-center rounded-full border border-ink-200 text-ink-500 transition-colors group-open:border-brand-500 group-open:bg-brand-500 group-open:text-white"
            >
              <span className="absolute h-[1.5px] w-2.5 bg-current" />
              <span className="absolute h-2.5 w-[1.5px] bg-current transition-transform duration-300 group-open:rotate-90 group-open:scale-y-0" />
            </span>
          </summary>
          <p className="max-w-2xl pr-10 pb-6 text-[15px] leading-relaxed text-ink-500">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
