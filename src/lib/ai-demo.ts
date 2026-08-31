/**
 * Deterministic "AI" generation for the KarigarAI demo.
 * Everything here is derived from what the artisan actually typed or spoke,
 * so regenerating produces genuinely different — but still relevant — output.
 */

export interface ListingInput {
  description: string;
  language: string;
  category?: string;
  materialCost: number;
  labourHours: number;
  complexity: number; // 1–5
}

export interface GeneratedListing {
  title: string;
  titleHi: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string[];
  craft: string;
  material: string;
  story: string;
  translations: { label: string; text: string }[];
}

interface CraftProfile {
  craft: string;
  category: string;
  subcategory: string;
  material: string;
  noun: string;
  nounHi: string;
  tags: string[];
  technique: string;
}

const PROFILES: { match: RegExp; profile: CraftProfile }[] = [
  {
    match: /pottery|vase|ceramic|clay pot|मिट्टी|फूलदान|blue pottery/i,
    profile: {
      craft: "Jaipur Blue Pottery",
      category: "Home Decor",
      subcategory: "Vases & Pots",
      material: "Quartz powder, glass frit, natural oxides",
      noun: "Blue Pottery Vase",
      nounHi: "ब्लू पॉटरी फूलदान",
      tags: ["blue pottery", "jaipur", "handpainted", "cobalt", "gi craft"],
      technique: "Freehand cobalt motif over a low-fired quartz body",
    },
  },
  {
    match: /silk|saree|sari|scarf|stole|dupatta|weav|loom|zari|कपड़ा|साड़ी/i,
    profile: {
      craft: "Banarasi Handloom",
      category: "Textiles",
      subcategory: "Stoles & Scarves",
      material: "Mulberry silk, metallic zari",
      noun: "Handwoven Silk Stole",
      nounHi: "हस्तनिर्मित रेशमी स्टोल",
      tags: ["handloom", "silk", "zari", "banarasi", "wedding"],
      technique: "Pit-loom weaving with hand-inserted zari borders",
    },
  },
  {
    match: /brass|dhokra|metal|bronze|bell metal|पीतल|मूर्ति|figurine|sculpt/i,
    profile: {
      craft: "Dhokra Lost-Wax Casting",
      category: "Art & Sculpture",
      subcategory: "Figurines",
      material: "Bell metal brass, beeswax, river clay",
      noun: "Dhokra Brass Figurine",
      nounHi: "ढोकरा पीतल मूर्ति",
      tags: ["dhokra", "brass", "tribal art", "lost wax", "collectible"],
      technique: "Lost-wax casting; the clay mould is broken after every pour",
    },
  },
  {
    match: /wood|carv|sheesham|rosewood|teak|box|लकड़ी|नक्काशी/i,
    profile: {
      craft: "Rajasthani Wood Carving",
      category: "Home Decor",
      subcategory: "Storage & Boxes",
      material: "Seasoned rosewood, brass fittings",
      noun: "Hand-Carved Wooden Box",
      nounHi: "नक्काशीदार लकड़ी का बॉक्स",
      tags: ["woodcarving", "rosewood", "handmade", "storage", "gift"],
      technique: "Deep-relief chisel carving with a hand-forged clasp",
    },
  },
  {
    match: /diya|lamp|terracotta|diwali|दीया|festive|candle/i,
    profile: {
      craft: "Bastar Terracotta",
      category: "Festive",
      subcategory: "Lamps & Diyas",
      material: "River clay, natural unglazed finish",
      noun: "Terracotta Diya Set",
      nounHi: "टेराकोटा दीया सेट",
      tags: ["terracotta", "diya", "diwali", "clay", "sustainable"],
      technique: "Wheel-thrown, sun-dried and kiln-fired in small batches",
    },
  },
  {
    match: /paint|madhubani|warli|pattachitra|canvas|wall|चित्र|पेंटिंग/i,
    profile: {
      craft: "Madhubani Folk Painting",
      category: "Art & Sculpture",
      subcategory: "Wall Art",
      material: "Natural pigments on treated board",
      noun: "Hand-Painted Folk Artwork",
      nounHi: "हस्तचित्रित लोक कलाकृति",
      tags: ["madhubani", "folk art", "handpainted", "wall decor", "mithila"],
      technique: "Double-line Kachni technique drawn with a bamboo-twig brush",
    },
  },
  {
    match: /jewel|neckl|earring|bangle|silver|गहन|आभूषण/i,
    profile: {
      craft: "Tribal Silver Jewellery",
      category: "Jewellery",
      subcategory: "Necklaces & Earrings",
      material: "Oxidised silver alloy, natural stone",
      noun: "Handcrafted Silver Jewellery",
      nounHi: "हस्तनिर्मित चाँदी का आभूषण",
      tags: ["jewellery", "silver", "tribal", "handmade", "gift"],
      technique: "Hand-hammered and oxidised, finished with a stone setting",
    },
  },
];

const FALLBACK: CraftProfile = {
  craft: "Indian Handicraft",
  category: "Home Decor",
  subcategory: "Handmade Objects",
  material: "Natural, locally sourced materials",
  noun: "Handmade Craft Piece",
  nounHi: "हस्तनिर्मित कलाकृति",
  tags: ["handmade", "artisanal", "india", "craft", "gift"],
  technique: "Made entirely by hand in small batches",
};

const ADJECTIVES = ["Hand-Painted", "Artisan-Made", "Heritage", "Hand-Finished", "Signature"];
const OPENERS = [
  "Made entirely by hand",
  "Shaped slowly, the traditional way",
  "Crafted in a small home workshop",
  "Worked by hand from start to finish",
  "Built the way it has been for generations",
];
const STORY_LINES = [
  "Every piece carries the small irregularities that only a human hand leaves behind.",
  "The maker learned this craft as a child, beside a parent who learned it the same way.",
  "No two pieces leave this workshop identical — the motif is drawn fresh each time.",
  "It takes patience more than tools: most of the work is waiting for the material to be ready.",
];

function pickProfile(text: string): CraftProfile {
  return PROFILES.find((p) => p.match.test(text))?.profile ?? FALLBACK;
}

function keywords(text: string): string[] {
  const stop = new Set([
    "this","that","with","from","have","made","make","making","very","hand","the","and","for","its",
    "it's","is","are","was","were","yeh","hai","aur","mein","ka","ki","ke","को","है","और","में","से",
  ]);
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[.,!?;:()"']/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3 && !stop.has(w)),
    ),
  ).slice(0, 4);
}

export function generateListing(input: ListingInput, variant = 0): GeneratedListing {
  const text = input.description.trim();
  const profile = pickProfile(text);
  const kw = keywords(text);
  const adj = ADJECTIVES[variant % ADJECTIVES.length]!;
  const opener = OPENERS[variant % OPENERS.length]!;
  const storyLine = STORY_LINES[variant % STORY_LINES.length]!;

  const days = Math.max(1, Math.round(input.labourHours / 6));
  const complexityWord =
    input.complexity >= 4 ? "intricate" : input.complexity >= 3 ? "detailed" : "clean, simple";

  const title = `${adj} ${profile.noun}`;
  const description = [
    `${opener}, this ${profile.noun.toLowerCase()} takes roughly ${input.labourHours} hours of work — about ${days} working ${days === 1 ? "day" : "days"}.`,
    `${profile.technique}. The finish is ${complexityWord}, and the materials are ${profile.material.toLowerCase()}.`,
    text ? `In the maker's own words: “${text.slice(0, 180)}${text.length > 180 ? "…" : ""}”` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const tags = Array.from(new Set([...profile.tags, ...kw])).slice(0, 8);

  return {
    title,
    titleHi: profile.nounHi,
    description,
    category: input.category && input.category !== "Auto-detect" ? input.category : profile.category,
    subcategory: profile.subcategory,
    tags,
    craft: profile.craft,
    material: profile.material,
    story: `${storyLine} ${days > 4 ? `This one took ${days} days.` : "It was finished in a single stretch of focused work."}`,
    translations: [
      { label: "English", text: `${title} — ${profile.craft}, handmade in India.` },
      { label: "हिन्दी", text: `${profile.nounHi} — ${days} दिन की मेहनत, पूरी तरह हाथ से बनाया गया।` },
      { label: "தமிழ்", text: `${profile.nounHi} — கையால் செய்யப்பட்ட ${days} நாள் உழைப்பு.` },
      { label: "বাংলা", text: `${profile.nounHi} — সম্পূর্ণ হাতে তৈরি, ${days} দিনের পরিশ্রম।` },
    ],
  };
}

export interface PriceResult {
  suggested: number;
  min: number;
  max: number;
  marginPct: number;
  breakdown: { label: string; value: number; note: string }[];
}

const CATEGORY_MULTIPLIER: Record<string, number> = {
  "Home Decor": 1.05,
  Textiles: 1.2,
  "Art & Sculpture": 1.25,
  Festive: 0.85,
  Jewellery: 1.3,
};

export function computePricing(input: ListingInput, category: string): PriceResult {
  const material = Math.max(0, Math.round(input.materialCost));
  const hourly = 95; // fair-wage benchmark used by the demo engine
  const labour = Math.round(input.labourHours * hourly);
  const complexity = Math.round((labour + material) * (input.complexity - 1) * 0.14);
  const catMult = CATEGORY_MULTIPLIER[category] ?? 1;
  const base = material + labour + complexity;
  const market = Math.round(base * (catMult - 1) + base * 0.08);
  const margin = Math.round((base + market) * 0.12);
  const suggested = Math.max(120, Math.round((base + market + margin) / 10) * 10);

  return {
    suggested,
    min: Math.round((suggested * 0.88) / 10) * 10,
    max: Math.round((suggested * 1.16) / 10) * 10,
    marginPct: Math.round((margin / suggested) * 100),
    breakdown: [
      {
        label: "Material cost",
        value: material,
        note: "What you paid for raw material, entered by you",
      },
      {
        label: "Labour",
        value: labour,
        note: `${input.labourHours} hours at a ₹${hourly}/hour fair-wage benchmark`,
      },
      {
        label: "Craft complexity",
        value: complexity,
        note: `Complexity level ${input.complexity} of 5 — skill premium over plain work`,
      },
      {
        label: "Market signals",
        value: market,
        note: `Comparable ${category.toLowerCase()} listings support this uplift`,
      },
      { label: "Estimated margin", value: margin, note: "Buffer after packaging and platform costs" },
    ],
  };
}
