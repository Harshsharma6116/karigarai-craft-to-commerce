import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Languages, MessageCircle, Send, Sparkles, Star, Truck } from "lucide-react";
import { toast } from "sonner";
import { SectionLabel } from "@/components/brand";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { products as seedProducts } from "@/lib/data";
import { inr, useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const product = seedProducts.find((p) => p.id === params.productId);
    return { title: product?.title ?? "Handmade product", craft: product?.craft ?? "Indian craft" };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product — KarigarAI" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${loaderData.title} — KarigarAI` },
        {
          name: "description",
          content: `${loaderData.title}, handmade using ${loaderData.craft}. Buy directly from the artisan on KarigarAI.`,
        },
        { property: "og:title", content: `${loaderData.title} — KarigarAI` },
        {
          property: "og:description",
          content: `Handmade ${loaderData.craft}, sold directly by the maker.`,
        },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { productId } = Route.useParams();
  const { products, artisans, messages, sendMessage, placeOrder } = useStore();
  const [draft, setDraft] = useState("");
  const [showTranslation, setShowTranslation] = useState(true);

  const product = products.find((p) => p.id === productId);
  if (!product) throw notFound();
  const artisan = artisans.find((a) => a.id === product.artisanId)!;
  const thread = messages.filter((m) => m.productId === product.id);
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  const buy = () => {
    const order = placeOrder(product.id, "Ananya Rao", "Bengaluru", 1);
    toast.success(`Order ${order.id} placed — the artisan has been notified.`);
  };

  const ask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMessage(product.id, draft.trim());
    setDraft("");
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-10">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to marketplace
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div className="glass overflow-hidden rounded-[2rem] p-3">
            <img
              src={product.image}
              alt={product.title}
              width={800}
              height={800}
              className="aspect-square w-full rounded-[1.6rem] object-cover"
            />
          </div>

          <div>
            <SectionLabel>{product.craft}</SectionLabel>
            <h1 className="font-display mt-5 text-4xl font-semibold">{product.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{product.titleHi}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="size-4 fill-accent text-accent" /> {product.rating} (
                {product.reviews} reviews)
              </span>
              <span>{product.sold} sold</span>
              <span className="flex items-center gap-1">
                <Truck className="size-4" /> Ships in 3–5 days
              </span>
            </div>

            <p className="font-display mt-6 text-4xl font-semibold text-ember">
              {inr(product.price)}
            </p>

            <p className="mt-5 leading-relaxed text-muted-foreground">{product.description}</p>

            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Craft", product.craft],
                ["Material", product.material],
                ["Category", `${product.category} · ${product.subcategory}`],
                ["Cluster", artisan.location],
              ].map(([k, v]) => (
                <div key={k} className="glass-soft rounded-2xl px-4 py-3">
                  <dt className="text-[0.66rem] tracking-widest text-muted-foreground uppercase">
                    {k}
                  </dt>
                  <dd className="mt-0.5 text-sm">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground"
                >
                  #{t}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={buy}
                className="rounded-full bg-ember px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
              >
                Buy now · {inr(product.price)}
              </button>
              <a
                href="#ask"
                className="inline-flex items-center gap-2 rounded-full border border-accent/30 px-6 py-3.5 text-sm font-semibold transition-colors hover:border-accent/70"
              >
                <MessageCircle className="size-4" /> Ask the Artisan
              </a>
            </div>
          </div>
        </div>

        {/* Story */}
        <section className="mt-16 grid gap-6 lg:grid-cols-2">
          <article className="glass rounded-3xl p-7">
            <SectionLabel>Product story</SectionLabel>
            <p className="font-display mt-5 text-xl leading-relaxed">{product.story}</p>
          </article>
          <article className="glass rounded-3xl p-7">
            <SectionLabel>Meet the artisan</SectionLabel>
            <div className="mt-5 flex items-center gap-4">
              <span className="font-display grid size-14 place-items-center rounded-2xl bg-ember text-lg font-semibold text-primary-foreground">
                {artisan.initials}
              </span>
              <div>
                <p className="font-semibold">{artisan.name}</p>
                <p className="text-xs text-muted-foreground">
                  {artisan.craft} · {artisan.location} · {artisan.experience} yrs
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{artisan.story}</p>
            <Link
              to="/store/$slug"
              params={{ slug: artisan.slug }}
              className="mt-5 inline-flex text-sm font-semibold text-accent hover:underline"
            >
              Visit {artisan.name.split(" ")[0]}'s store →
            </Link>
          </article>
        </section>

        {/* Ask the artisan */}
        <section id="ask" className="glass mt-10 rounded-3xl p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionLabel>Ask the artisan</SectionLabel>
            <button
              onClick={() => setShowTranslation((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Languages className="size-3.5" />
              {showTranslation ? "Showing English translation" : "Original language only"}
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {thread.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.from === "buyer" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-lg rounded-2xl px-4 py-3 text-sm ${
                    m.from === "buyer"
                      ? "bg-primary/20 text-foreground"
                      : "glass-soft text-foreground"
                  }`}
                >
                  <p>{m.text}</p>
                  {showTranslation && m.translated && (
                    <p className="mt-2 border-t border-border/60 pt-2 text-xs text-muted-foreground italic">
                      <Sparkles className="mr-1 inline size-3 text-accent" />
                      {m.translated}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {thread.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No questions yet — be the first to ask {artisan.name.split(" ")[0]} about this
                piece.
              </p>
            )}
          </div>

          <form onSubmit={ask} className="mt-6 flex gap-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask in English — the artisan reads it in Hindi"
              className="flex-1 rounded-full border border-input bg-background/40 px-5 py-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="grid size-12 shrink-0 place-items-center rounded-full bg-ember text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              <Send className="size-4" />
            </button>
          </form>
        </section>

        {/* Related */}
        <section className="mt-16">
          <SectionLabel>More handmade work</SectionLabel>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((p) => (
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
                  <h3 className="text-sm font-semibold">{p.title}</h3>
                  <p className="font-display mt-2 text-base font-semibold text-ember">
                    {inr(p.price)}
                  </p>
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
