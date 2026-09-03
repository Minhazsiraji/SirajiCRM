import { cn } from "@/lib/cn";

export function Logo({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-[10px] font-display text-[13px] font-bold tracking-tight",
          inverted
            ? "bg-brand-400 text-ink-950"
            : "bg-ink-900 text-brand-300",
        )}
      >
        M&amp;S
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[15px] font-semibold tracking-tight",
            inverted ? "text-paper" : "text-ink-900",
          )}
        >
          M&amp;S Buying House
        </span>
        <span
          className={cn(
            "mt-1 text-[10px] font-medium tracking-[0.18em] uppercase",
            inverted ? "text-ink-300" : "text-ink-400",
          )}
        >
          Sourcing from Bangladesh
        </span>
      </span>
    </span>
  );
}
