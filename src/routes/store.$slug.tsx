import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin, Share2, Star } from "lucide-react";
import { SectionLabel } from "@/components/brand";
import { QRPanel } from "@/components/qr-code";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { artisans as seedArtisans } from "@/lib/data";
import { inr, useStore } from "@/lib/store";

export const Route = createFileRoute("/store/$slug")({
  loader: ({ params }) => {
    const a = seedArtisans.find((x) => x.slug === params.slug);
    return { name: a?.name ?? "Artisan", craft: a?.craft ?? "Indian craft" };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Store — KarigarAI" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${loaderData.name} — ${loaderData.craft} Store on KarigarAI` },
        {
          name: "description",
          content: `Shop ${loaderData.craft} handmade by ${loaderData.name}, with the maker's own story and craft details.`,
        },
        { property: "og:title", content: `${loaderData.name} — ${loaderData.craft} Store` },
        {
          property: "og:description",
          content: `A digital storefront built by KarigarAI for ${loaderData.name}.`,
        },
      ],
    };
  },
  component: StorePage,
});

function StorePage() {
  const { slug } = Route.useParams();
  const { artisans, products } = useStore();
  const artisan = artisans.find((a) => a.slug === slug);
  if (!artisan) throw notFound();
  const list = products.filter((p) => p.artisanId === artisan.id);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-12">
        {/* Storefront hero */}
        <section className="glass craft-pattern relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-ember opacity-[0.06]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <SectionLabel>Digital storefront</SectionLabel>
              <div className="mt-6 flex items-center gap-5">
                <span className="font-display grid size-20 place-items-center rounded-3xl bg-ember text-2xl font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
                  {artisan.initials}
                </span>
                <div>
                  <h1 className="font-display text-4xl font-semibold">{artisan.name}</h1>
                  <p className="mt-1 text-muted-foreground">{artisan.tagline}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <Badge>
                  <MapPin className="size-3.5" /> {artisan.location}
                </Badge>
                <Badge>{artisan.craft}</Badge>
                <Badge>{artisan.experience} years</Badge>
                <Badge>
                  <Star className="size-3.5 fill-accent text-accent" /> {artisan.rating}
                </Badge>
                <Badge>{artisan.languages.join(" · ")}</Badge>
              </div>
            </div>
            <QRPanel path={`/store/${artisan.slug}`} label={`${artisan.name}'s store`} />
          </div>
        </section>

        {/* Products */}
        <section className="mt-14">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl font-semibold">
              The collection <span className="text-ember">({list.length})</span>
            </h2>
            <Link to="/explore" className="text-sm font-semibold text-accent hover:underline">
              See all artisans →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <Link
                key={p.id}
                to="/product/$productId"
                params={{ productId: p.id }}
                className="lift glass group overflow-hidden rounded-3xl"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  width={800}
                  height={800}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-107"
                />
                <div className="p-5">
                  <h3 className="text-base font-semibold">{p.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{p.subcategory}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-display text-lg font-semibold text-ember">
                      {inr(p.price)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="size-3.5 fill-accent text-accent" /> {p.rating}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Artisan story */}
        <section className="glass mt-14 grid gap-8 rounded-[2rem] p-8 lg:grid-cols-[1fr_1.4fr] sm:p-12">
          <div>
            <SectionLabel>Meet the artisan</SectionLabel>
            <h2 className="font-display mt-5 text-3xl font-semibold">{artisan.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {artisan.craft} · {artisan.location}
            </p>
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-accent/25 bg-accent/8 px-4 py-3">
              <Share2 className="size-4 text-accent" />
              <p className="text-xs text-muted-foreground">
                Story narrated by the artisan, transcribed and translated by KarigarAI.
              </p>
            </div>
          </div>
          <p className="font-display text-xl leading-relaxed">{artisan.story}</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="glass-soft inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs text-muted-foreground">
      {children}
    </span>
  );
}
