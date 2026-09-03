type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} width="16" height="16" aria-hidden {...props}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg {...base} width="16" height="16" aria-hidden {...props}>
      <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
    </svg>
  );
}

export function Tshirt(props: IconProps) {
  return (
    <svg {...base} width="24" height="24" aria-hidden {...props}>
      <path d="M8.5 3 4 5.5 5.6 10l1.9-.7V21h9V9.3l1.9.7L20 5.5 15.5 3a3.5 3.5 0 0 1-7 0Z" />
    </svg>
  );
}

export function Factory(props: IconProps) {
  return (
    <svg {...base} width="24" height="24" aria-hidden {...props}>
      <path d="M3 21h18M4 21V10l5 3.2V10l5 3.2V10l5 3.2V21M4 10 5 3h3l.8 5.6" />
    </svg>
  );
}

export function Shield(props: IconProps) {
  return (
    <svg {...base} width="24" height="24" aria-hidden {...props}>
      <path d="M12 3 5 5.8v5.4c0 4.3 2.9 8.2 7 9.5 4.1-1.3 7-5.2 7-9.5V5.8L12 3Z" />
      <path d="m9 12 2.2 2.2L15.4 10" />
    </svg>
  );
}

export function Leaf(props: IconProps) {
  return (
    <svg {...base} width="24" height="24" aria-hidden {...props}>
      <path d="M5 19c0-8 5-13 15-13 0 9-4.5 13-10 13a5 5 0 0 1-5-5Z" />
      <path d="M4 21c2.5-4.5 5.5-7.4 9.5-9.5" />
    </svg>
  );
}

export function Ship(props: IconProps) {
  return (
    <svg {...base} width="24" height="24" aria-hidden {...props}>
      <path d="M3 17.5c1.6 0 1.6 1.5 3.2 1.5s1.6-1.5 3.2-1.5 1.6 1.5 3.2 1.5 1.6-1.5 3.2-1.5 1.6 1.5 3.2 1.5" />
      <path d="M5 15 4 10.5h16L19 15M8 10.5V6h8v4.5M12 3v3" />
    </svg>
  );
}

export function Sparkle(props: IconProps) {
  return (
    <svg {...base} width="24" height="24" aria-hidden {...props}>
      <path d="M12 3.5 13.9 9 19.5 11 13.9 13 12 18.5 10.1 13 4.5 11 10.1 9 12 3.5Z" />
    </svg>
  );
}

export function Mail(props: IconProps) {
  return (
    <svg {...base} width="18" height="18" aria-hidden {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m3.8 7 7.1 5.2a2 2 0 0 0 2.2 0L20.2 7" />
    </svg>
  );
}

export function Phone(props: IconProps) {
  return (
    <svg {...base} width="18" height="18" aria-hidden {...props}>
      <path d="M6.5 3.5h3l1.4 4-2 1.4a12 12 0 0 0 5.2 5.2l1.4-2 4 1.4v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
    </svg>
  );
}

export function Pin(props: IconProps) {
  return (
    <svg {...base} width="18" height="18" aria-hidden {...props}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function Shirt(props: IconProps) {
  return (
    <svg {...base} width="24" height="24" aria-hidden {...props}>
      <path d="M9 3 12 6.5 15 3l4.5 2.4-1.4 4.3-1.6-.6V21H7.5V9.1l-1.6.6L4.5 5.4 9 3Z" />
      <path d="M12 6.5V13" />
    </svg>
  );
}

export function Pants(props: IconProps) {
  return (
    <svg {...base} width="24" height="24" aria-hidden {...props}>
      <path d="M7 3h10l.8 18h-4L12 11l-1.8 10h-4L7 3Z" />
      <path d="M7.2 7.5h9.6" />
    </svg>
  );
}

export function Jacket(props: IconProps) {
  return (
    <svg {...base} width="24" height="24" aria-hidden {...props}>
      <path d="M9.5 3 12 5l2.5-2 4.5 2.6V21H5V5.6L9.5 3Z" />
      <path d="M12 5v16M9.5 3l1 3M14.5 3l-1 3" />
    </svg>
  );
}

export function Sweater(props: IconProps) {
  return (
    <svg {...base} width="24" height="24" aria-hidden {...props}>
      <path d="M8.5 3h7l4 3.2-2 4.2-1.5-1V21h-8V9.4l-1.5 1-2-4.2L8.5 3Z" />
      <path d="M9.8 12.5 12 15l2.2-2.5M9.8 16 12 18.5l2.2-2.5" />
    </svg>
  );
}

export function Onesie(props: IconProps) {
  return (
    <svg {...base} width="24" height="24" aria-hidden {...props}>
      <path d="M9 3h6l3.5 2.2-1.6 3.6-1.4-.8V15l-1.5 6h-4L8.5 15V8l-1.4.8L5.5 5.2 9 3Z" />
      <path d="M10.2 15h3.6" />
    </svg>
  );
}

export const serviceIcons = {
  sourcing: Factory,
  development: Sparkle,
  costing: Tshirt,
  quality: Check,
  compliance: Shield,
  logistics: Ship,
} as const;

export const categoryIcons = {
  knitwear: Tshirt,
  "woven-tops": Shirt,
  denim: Pants,
  outerwear: Jacket,
  sweaters: Sweater,
  kidswear: Onesie,
} as const;
