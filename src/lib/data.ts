import pottery from "@/assets/product-pottery.jpg";
import scarf from "@/assets/product-scarf.jpg";
import brass from "@/assets/product-brass.jpg";
import woodbox from "@/assets/product-woodbox.jpg";
import diya from "@/assets/product-diya.jpg";
import madhubani from "@/assets/product-madhubani.jpg";
import type { Artisan, Message, Order, Product } from "./types";

export const productImages = [pottery, scarf, brass, woodbox, diya, madhubani];

export const artisans: Artisan[] = [
  {
    id: "a1",
    slug: "meera-devi",
    name: "Meera Devi",
    craft: "Blue Pottery",
    location: "Jaipur, Rajasthan",
    experience: 22,
    tagline: "Third-generation blue pottery from the lanes of Jaipur.",
    story:
      "I learned this craft at eleven, sitting beside my father in a small workshop off Kishanpole Bazaar. Blue pottery uses no clay at all — quartz, glass, fuller's earth and a prayer. Every vase takes nine days: shaping, drying, drawing the motifs freehand, and one nervous night beside the kiln. My hands know the exact moment the surface is ready for the cobalt.",
    languages: ["Hindi", "Rajasthani", "English"],
    rating: 4.9,
    initials: "MD",
  },
  {
    id: "a2",
    slug: "rafiq-ansari",
    name: "Rafiq Ansari",
    craft: "Banarasi Handloom",
    location: "Varanasi, Uttar Pradesh",
    experience: 30,
    tagline: "Zari weaving on a pit loom that has run for four generations.",
    story:
      "The loom in my house is older than me. A single Banarasi dupatta can take eighteen days — the zari is real, the motifs come from Mughal jaali windows. When people ask why it costs what it costs, I tell them: you are not buying cloth, you are buying eighteen mornings.",
    languages: ["Hindi", "Urdu", "Bhojpuri"],
    rating: 4.8,
    initials: "RA",
  },
  {
    id: "a3",
    slug: "sunita-hansda",
    name: "Sunita Hansda",
    craft: "Dhokra & Terracotta",
    location: "Bastar, Chhattisgarh",
    experience: 15,
    tagline: "Lost-wax brass casting from the tribal belt of Bastar.",
    story:
      "Dhokra is 4,000 years old and every piece is made only once — the clay mould is broken to release the brass. There are no copies in my work. I also shape terracotta lamps in the monsoon months when the brass furnace cannot be lit.",
    languages: ["Hindi", "Gondi"],
    rating: 4.7,
    initials: "SH",
  },
];

export const products: Product[] = [
  {
    id: "p1",
    artisanId: "a1",
    title: "Hand-Painted Blue Pottery Vase",
    titleHi: "हस्तनिर्मित ब्लू पॉटरी फूलदान",
    description:
      "A quartz-bodied Jaipur blue pottery vase, painted freehand with cobalt floral vines and finished with a 24k-look gold rim. Fired at low temperature over nine days, making each piece unique in tone.",
    story:
      "Meera drew these vines from the jaali windows of Hawa Mahal, a motif her father taught her before she could read.",
    category: "Home Decor",
    subcategory: "Vases & Pots",
    tags: ["blue pottery", "jaipur", "handpainted", "cobalt", "gift", "eco-friendly"],
    price: 3200,
    image: pottery,
    rating: 4.9,
    reviews: 48,
    views: 4820,
    sold: 36,
    craft: "Jaipur Blue Pottery",
    material: "Quartz powder, glass frit, natural oxides",
    createdAt: "2026-06-11",
  },
  {
    id: "p2",
    artisanId: "a2",
    title: "Banarasi Silk Zari Stole",
    titleHi: "बनारसी सिल्क ज़री स्टोल",
    description:
      "Pure mulberry silk stole handwoven on a pit loom with real gold-toned zari borders. Eighteen days on the loom, finished with hand-knotted tassels.",
    story:
      "Rafiq's loom has run in the same room since 1948; this border pattern is called 'shikargah'.",
    category: "Textiles",
    subcategory: "Stoles & Scarves",
    tags: ["banarasi", "silk", "zari", "handloom", "wedding", "luxury"],
    price: 5400,
    image: scarf,
    rating: 4.8,
    reviews: 61,
    views: 6210,
    sold: 44,
    craft: "Banarasi Handloom",
    material: "Mulberry silk, metallic zari",
    createdAt: "2026-05-28",
  },
  {
    id: "p3",
    artisanId: "a3",
    title: "Dhokra Brass Tribal Figurine",
    titleHi: "ढोकरा पीतल आदिवासी मूर्ति",
    description:
      "Lost-wax cast brass figurine from Bastar. The clay mould is destroyed after casting, so no two pieces are alike. Hand-filed and polished to a warm antique finish.",
    story: "Sunita casts only in the dry months — the furnace cannot breathe in Bastar rain.",
    category: "Art & Sculpture",
    subcategory: "Figurines",
    tags: ["dhokra", "bastar", "brass", "tribal art", "lost wax", "collectible"],
    price: 4750,
    image: brass,
    rating: 4.7,
    reviews: 27,
    views: 2940,
    sold: 19,
    craft: "Dhokra Lost-Wax Casting",
    material: "Bell metal brass, beeswax, river clay",
    createdAt: "2026-06-02",
  },
  {
    id: "p4",
    artisanId: "a1",
    title: "Carved Rosewood Keepsake Box",
    titleHi: "नक्काशीदार शीशम आभूषण बॉक्स",
    description:
      "Solid rosewood box with deep-relief floral jaali carving and a hand-forged brass clasp. Velvet-lined interior, ideal for jewellery and heirlooms.",
    story: "The lattice repeats a temple screen pattern from Sanganer, carved entirely by chisel.",
    category: "Home Decor",
    subcategory: "Storage & Boxes",
    tags: ["woodcarving", "rosewood", "jewellery box", "handmade", "gift"],
    price: 2890,
    image: woodbox,
    rating: 4.6,
    reviews: 33,
    views: 3105,
    sold: 25,
    craft: "Rajasthani Wood Carving",
    material: "Seasoned rosewood, brass",
    createdAt: "2026-04-19",
  },
  {
    id: "p5",
    artisanId: "a3",
    title: "Terracotta Diya Set of Six",
    titleHi: "टेराकोटा दीया सेट (छह)",
    description:
      "Wheel-thrown terracotta oil lamps in a stacking set of six, sun-dried and kiln-fired. Unglazed natural clay finish that darkens beautifully with use.",
    story: "Shaped on a wheel Sunita's mother still turns by hand every Diwali season.",
    category: "Festive",
    subcategory: "Lamps & Diyas",
    tags: ["terracotta", "diya", "diwali", "clay", "festive", "sustainable"],
    price: 640,
    image: diya,
    rating: 4.9,
    reviews: 118,
    views: 8940,
    sold: 212,
    craft: "Bastar Terracotta",
    material: "River clay, natural finish",
    createdAt: "2026-03-08",
  },
  {
    id: "p6",
    artisanId: "a2",
    title: "Madhubani Painted Wall Plate",
    titleHi: "मधुबनी चित्रित दीवार प्लेट",
    description:
      "Hand-painted Madhubani wall plate in natural ochre and lamp-black pigments, using the traditional double-line Kachni technique with a fish-and-vine motif.",
    story: "The fish motif is a Mithila blessing for abundance, painted with a bamboo-twig brush.",
    category: "Art & Sculpture",
    subcategory: "Wall Art",
    tags: ["madhubani", "mithila", "folk art", "wall decor", "handpainted"],
    price: 1980,
    image: madhubani,
    rating: 4.8,
    reviews: 52,
    views: 5120,
    sold: 61,
    craft: "Madhubani Folk Painting",
    material: "Natural pigments on treated board",
    createdAt: "2026-05-02",
  },
];

export const orders: Order[] = [
  {
    id: "ORD-2418",
    productId: "p2",
    buyerName: "Ananya Rao",
    city: "Bengaluru",
    qty: 1,
    amount: 5400,
    status: "Pending",
    placedAt: "2026-08-29",
  },
  {
    id: "ORD-2417",
    productId: "p1",
    buyerName: "David Lin",
    city: "Singapore",
    qty: 2,
    amount: 6400,
    status: "Confirmed",
    placedAt: "2026-08-28",
  },
  {
    id: "ORD-2416",
    productId: "p5",
    buyerName: "Kavya Menon",
    city: "Kochi",
    qty: 4,
    amount: 2560,
    status: "Packed",
    placedAt: "2026-08-27",
  },
  {
    id: "ORD-2415",
    productId: "p3",
    buyerName: "Rohit Sharma",
    city: "Delhi",
    qty: 1,
    amount: 4750,
    status: "Shipped",
    placedAt: "2026-08-25",
  },
  {
    id: "ORD-2414",
    productId: "p6",
    buyerName: "Emma Fischer",
    city: "Berlin",
    qty: 1,
    amount: 1980,
    status: "Delivered",
    placedAt: "2026-08-21",
  },
  {
    id: "ORD-2413",
    productId: "p4",
    buyerName: "Nikhil Gupta",
    city: "Pune",
    qty: 1,
    amount: 2890,
    status: "Delivered",
    placedAt: "2026-08-18",
  },
];

export const messages: Message[] = [
  {
    id: "m1",
    productId: "p1",
    from: "buyer",
    text: "Is this safe to use with fresh flowers and water?",
  },
  {
    id: "m2",
    productId: "p1",
    from: "artisan",
    text: "जी हाँ, अंदर की सतह पूरी तरह ग्लेज़्ड है — ताज़े फूल और पानी दोनों सुरक्षित हैं।",
    translated: "Yes — the inner surface is fully glazed, so fresh flowers and water are both safe.",
  },
];

export const monthlySeries = [
  { month: "Mar", views: 2100, orders: 18, earnings: 24800, engagement: 32 },
  { month: "Apr", views: 3200, orders: 26, earnings: 38400, engagement: 41 },
  { month: "May", views: 4100, orders: 31, earnings: 47200, engagement: 46 },
  { month: "Jun", views: 5400, orders: 42, earnings: 61500, engagement: 55 },
  { month: "Jul", views: 6900, orders: 48, earnings: 73200, engagement: 62 },
  { month: "Aug", views: 8600, orders: 57, earnings: 91400, engagement: 71 },
];

export const trafficSources = [
  { name: "Store QR", value: 34 },
  { name: "Search", value: 28 },
  { name: "Social share", value: 23 },
  { name: "Direct", value: 15 },
];

export const demoAccounts = [
  {
    role: "artisan" as const,
    email: "meera@karigar.ai",
    password: "karigar123",
    label: "Meera Devi · Blue Pottery, Jaipur",
  },
  {
    role: "buyer" as const,
    email: "buyer@karigar.ai",
    password: "buyer123",
    label: "Ananya Rao · Buyer, Bengaluru",
  },
];
