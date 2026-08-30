import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Star } from "lucide-react";
import { SectionLabel } from "@/components/brand";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { inr, useStore } from "@/lib/store";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Artisans — KarigarAI Marketplace" },
      {
        name: "description",
        content:
          "Browse handmade Indian craft by category, craft cluster and price. Every listing carries the maker's story.",
      },
      { property: "og:title", content: "Explore Artisans — KarigarAI Marketplace" },
      {
        property: "og:description",
        content: "Search and filter handmade products from blue pottery to Banarasi handloom.",
      },
    ],
  }),
  component: Explore,
});

const sorts = ["Trending", "Price: Low", "Price: High", "Top rated"] as const;

function Explore() {
  const { products, artisans } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState<(typeof sorts)[number]>("Trending");
  const [maxPrice, setMaxPrice] = useState(6000);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );

  const list = useMemo(() => {
    let out = products.filter((p) => {
      const hay = `${p.title} ${p.craft} ${p.tags.join(" ")} ${p.category}`.toLowerCase();
      return (
        hay.includes(q.toLowerCase()) &&
        (cat === "All" || p.category === cat) &&
        p.price <= maxPrice
      );
    });
    out = [...out].sort((a, b) => {
      if (sort === "Price: Low") return a.price - b.price;
      if (sort === "Price: High") return b.price - a.price;
      if (sort === "Top rated") return b.rating - a.rating;
      return b.views - a.views;
    });
    return out;
  }, [products, q, cat, maxPrice, sort]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-14">
        <SectionLabel>Marketplace</SectionLabel>
        <h1 className="font-display mt-5 text-4xl font-semibold sm:text-5xl">
          Explore <span className="text-ember">Artisans</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          {products.length} handmade pieces from {artisans.length} craft clusters across India.
        </p>

        {/* Filters */}
        <div className="glass mt-9 rounded-3xl p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search pottery, zari, dhokra, diya…"
                className="w-full rounded-full border border-input bg-background/40 py-3 pr-4 pl-11 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
              <span className="text-xs whitespace-nowrap text-muted-foreground">
                Under {inr(maxPrice)}
              </span>
              <input
                type="range"
                min={500}
                max={6000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-36 accent-[oklch(0.63_0.155_42)]"
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as (typeof sorts)[number])}
                className="rounded-full border border-input bg-background/60 px-4 py-2 text-sm outline-none"
              >
                {sorts.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  cat === c
                    ? "bg-ember text-primary-foreground"
                    : "border border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => {
            const a = artisans.find((x) => x.id === p.artisanId);
            return (
              <Link
                key={p.id}
                to="/product/$productId"
                params={{ productId: p.id }}
                className="lift glass animate-rise group overflow-hidden rounded-3xl"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    width={800}
                    height={800}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-107"
                  />
                  <span className="glass-soft absolute top-3 left-3 rounded-full px-3 py-1 text-[0.65rem] tracking-widest text-accent uppercase">
                    {p.craft}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="text-base font-semibold">{p.title}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {a?.name} · {a?.location}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-display text-lg font-semibold text-ember">
                      {inr(p.price)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="size-3.5 fill-accent text-accent" />
                      {p.rating} ({p.reviews})
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {list.length === 0 && (
          <p className="glass mt-10 rounded-3xl p-12 text-center text-muted-foreground">
            No pieces match that search yet. Try widening the price or clearing the category.
          </p>
        )}

        {/* Artisan strip */}
        <section className="mt-20">
          <SectionLabel>The makers</SectionLabel>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {artisans.map((a) => (
              <Link
                key={a.id}
                to="/store/$slug"
                params={{ slug: a.slug }}
                className="lift glass flex items-center gap-4 rounded-3xl p-5"
              >
                <span className="font-display grid size-14 shrink-0 place-items-center rounded-2xl bg-ember text-lg font-semibold text-primary-foreground">
                  {a.initials}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold">{a.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.craft} · {a.location}
                  </p>
                  <p className="mt-1 text-xs text-accent">{a.experience} years of practice</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
