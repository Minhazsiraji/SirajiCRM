import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  inverted = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  inverted?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "eyebrow flex items-center gap-2.5",
            align === "center" && "justify-center",
            inverted ? "text-brand-300" : "text-brand-600",
          )}
        >
          <span aria-hidden className="h-px w-6 bg-current opacity-50" />
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "display-2 mt-4",
          inverted ? "text-paper" : "text-ink-900",
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "mt-5 text-[17px] leading-relaxed",
            inverted ? "text-ink-300" : "text-ink-500",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}

export function Section({
  className,
  children,
  id,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", className)}>
      {children}
    </section>
  );
}
