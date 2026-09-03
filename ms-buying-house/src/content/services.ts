export type Service = {
  slug: string;
  title: string;
  summary: string;
  points: string[];
};

export const services: Service[] = [
  {
    slug: "sourcing",
    title: "Factory sourcing & matching",
    summary:
      "We place your programme with the unit that actually fits it — by product type, machine capacity, MOQ appetite and compliance profile, not by whoever has a free slot.",
    points: [
      "Capacity mapping against your seasonal calendar",
      "Capability audit before a single sample is cut",
      "Backup unit identified for every core style",
      "Direct factory pricing — no hidden layers",
    ],
  },
  {
    slug: "development",
    title: "Product development & sampling",
    summary:
      "From a sketch, a tech pack or a reference garment to an approved counter sample, managed by a merchandiser who answers in your working hours.",
    points: [
      "Tech pack drafting and correction",
      "Fabric, trim and wash development",
      "Proto, fit, size-set and PP sample cycles",
      "Lab dips, strike-offs and handloom approvals",
    ],
  },
  {
    slug: "costing",
    title: "Costing & negotiation",
    summary:
      "Open-costing breakdowns you can interrogate line by line, so you know what you are paying for fabric, trims, CM and freight.",
    points: [
      "Line-by-line CM and consumption analysis",
      "Yarn and fabric market benchmarking",
      "Duty and trade-preference guidance (EU GSP, UK DCTS)",
      "Target-price engineering without silent substitutions",
    ],
  },
  {
    slug: "quality",
    title: "Quality assurance",
    summary:
      "Our QA team sits inside the factory, not in an inbox. Inline inspection catches problems while they are still cheap to fix.",
    points: [
      "Pre-production meeting on every style",
      "Inline and mid-line inspection reports with photos",
      "Final random inspection to AQL 2.5 / 1.5",
      "Third-party inspection coordination on request",
    ],
  },
  {
    slug: "compliance",
    title: "Compliance & factory audit",
    summary:
      "Every partner unit is screened for social, structural and environmental compliance before it touches your order — and re-screened while it runs.",
    points: [
      "Social audit review (BSCI, SEDEX/SMETA, WRAP)",
      "Structural, fire and electrical safety status",
      "Unauthorised subcontracting controls",
      "Buyer code-of-conduct alignment",
    ],
  },
  {
    slug: "logistics",
    title: "Shipping & documentation",
    summary:
      "Booking, inspection, documents and export clearance handled together, so the goods and the paperwork arrive in the same week.",
    points: [
      "Ex-factory tracking against the master TNA",
      "Consolidation and carton-plan optimisation",
      "FOB, CFR, CIF and DDP handling",
      "L/C, TT and document set preparation",
    ],
  },
];
