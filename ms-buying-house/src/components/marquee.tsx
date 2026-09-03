/** Infinite horizontal ticker. The list is duplicated so the loop is seamless. */
export function Marquee({ items }: { items: readonly string[] }) {
  const doubled = [...items, ...items];

  return (
    <div
      className="relative flex overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <ul className="flex shrink-0 animate-[marquee] items-center gap-10 pr-10">
        {doubled.map((item, i) => (
          <li
            key={`${item}-${i}`}
            aria-hidden={i >= items.length}
            className="flex shrink-0 items-center gap-10 font-display text-[15px] font-medium whitespace-nowrap text-ink-400"
          >
            {item}
            <span aria-hidden className="size-1 rounded-full bg-brand-400" />
          </li>
        ))}
      </ul>
    </div>
  );
}
