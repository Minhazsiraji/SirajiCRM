export const site = {
  name: "M&S Buying House",
  shortName: "M&S",
  tagline: "Bangladesh apparel sourcing, run like a partnership.",
  description:
    "M&S Buying House is a Dhaka-based apparel sourcing partner. We match global buyers with vetted Bangladeshi factories and own the programme end to end — costing, development, compliance, inline QA and on-time shipment.",
  // TODO: replace the placeholder contact details below with your live ones.
  email: "sourcing@msbuyinghouse.com",
  phone: "+880 1700 000 000",
  whatsapp: "+8801700000000",
  address: {
    line1: "Level 7, House 42, Road 11",
    line2: "Banani, Dhaka 1213",
    country: "Bangladesh",
  },
  hours: "Sun–Thu, 09:00–18:00 (GMT+6)",
  founded: 2014,
  social: {
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
  },
} as const;

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/compliance", label: "Compliance" },
  { href: "/sustainability", label: "Sustainability" },
  { href: "/about", label: "About" },
] as const;

// TODO: swap these for your audited figures before going live.
export const stats = [
  { value: "120+", label: "Global buyers served", detail: "Retailers, wholesalers and DTC brands across 4 continents" },
  { value: "45", label: "Vetted partner factories", detail: "Woven, knit, sweater and outerwear units under active audit" },
  { value: "18M", label: "Pieces shipped a year", detail: "Across replenishment, seasonal and capsule programmes" },
  { value: "97%", label: "On-time shipment rate", detail: "Measured against the buyer's original ex-factory date" },
] as const;

export const markets = [
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Spain",
  "Netherlands",
  "Canada",
  "Australia",
  "Japan",
  "UAE",
  "Poland",
  "Sweden",
] as const;
