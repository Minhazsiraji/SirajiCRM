import Link from "next/link";
import { cn } from "@/lib/cn";

const styles = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-[0_1px_2px_rgba(6,10,9,0.16)]",
  dark: "bg-ink-900 text-paper hover:bg-ink-800 active:bg-ink-950",
  light: "bg-paper text-ink-900 hover:bg-white active:bg-sand-100",
  outline:
    "border border-ink-200 text-ink-800 hover:border-ink-900 hover:bg-ink-900 hover:text-paper",
  ghost:
    "border border-white/25 text-paper hover:bg-white/10 hover:border-white/45",
} as const;

const sizes = {
  md: "h-11 px-5 text-[14px]",
  lg: "h-13 px-6.5 text-[15px]",
} as const;

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: {
  href: string;
  variant?: keyof typeof styles;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200",
        styles[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
