export type Category = {
  slug: string;
  title: string;
  blurb: string;
  items: string[];
  moq: string;
  tone: "emerald" | "ink" | "clay" | "sand";
};

export const categories: Category[] = [
  {
    slug: "knitwear",
    title: "Knitwear & jersey",
    blurb:
      "The backbone of Bangladeshi manufacturing — high-volume, repeatable, and where our factory base is deepest.",
    items: ["T-shirts & tanks", "Polo shirts", "Hoodies & sweatshirts", "Leggings & joggers", "Pyjama & lounge sets"],
    moq: "From 1,000 pcs / colour",
    tone: "emerald",
  },
  {
    slug: "woven-tops",
    title: "Woven tops & shirting",
    blurb:
      "Yarn-dyed, printed and solid shirting programmes with the finishing detail formal buyers expect.",
    items: ["Formal & casual shirts", "Blouses", "Tunics", "Overshirts", "Uniform shirting"],
    moq: "From 800 pcs / style",
    tone: "ink",
  },
  {
    slug: "denim",
    title: "Denim & bottoms",
    blurb:
      "Full wash development with laser, ozone and reduced-water finishing at partner laundries.",
    items: ["Jeans — all fits", "Denim jackets & skirts", "Chinos", "Cargo & utility pants", "Shorts"],
    moq: "From 1,200 pcs / wash",
    tone: "clay",
  },
  {
    slug: "outerwear",
    title: "Outerwear & workwear",
    blurb:
      "Padded, quilted and shell construction, including recycled and RDS-certified fillings.",
    items: ["Puffer & padded jackets", "Softshell & windbreakers", "Parkas", "Hi-vis workwear", "Coveralls"],
    moq: "From 500 pcs / style",
    tone: "ink",
  },
  {
    slug: "sweaters",
    title: "Sweaters & flat knit",
    blurb:
      "3GG to 16GG on computerised flat-knit machines, plus hand-linked finishing where the design calls for it.",
    items: ["Pullovers & cardigans", "Cable & jacquard knits", "Knit dresses", "Beanies & accessories"],
    moq: "From 600 pcs / colour",
    tone: "sand",
  },
  {
    slug: "kidswear",
    title: "Kidswear & baby",
    blurb:
      "Age-appropriate safety compliance built into development — cords, small parts, flammability and nickel testing.",
    items: ["Newborn & bodysuits", "Boys' & girls' sets", "School uniform", "Sleepwear", "Character licensing support"],
    moq: "From 1,000 pcs / style",
    tone: "emerald",
  },
];
