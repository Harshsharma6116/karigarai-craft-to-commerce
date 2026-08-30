import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Camera,
  Globe2,
  IndianRupee,
  Mic,
  QrCode,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingUp,
  Wand2,
} from "lucide-react";
import { AIOrb } from "@/components/ai-orb";
import { SectionLabel } from "@/components/brand";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { artisans, products } from "@/lib/data";
import { inr } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KarigarAI — From Craft to Commerce, Powered by AI" },
      {
        name: "description",
        content:
          "Snap a photo, speak in your language, and KarigarAI builds your listing, pricing, story and digital storefront. Built for Indian artisans.",
      },
      { property: "og:title", content: "KarigarAI — From Craft to Commerce, Powered by AI" },
      {
        property: "og:description",
        content:
          "An AI business companion for Indian artisans: AI listings, smart pricing, storytelling and a ready-made digital store.",
      },
    ],
  }),
  component: Landing,
});

const flow = [
  { icon: Camera, title: "Snap", copy: "Photograph the piece on any phone." },
  { icon: Mic, title: "Speak", copy: "Describe it in Hindi or your language." },
  { icon: Sparkles, title: "AI Understands", copy: "Craft, material and story decoded." },
  { icon: Store, title: "Digital Store", copy: "A polished storefront, instantly." },
  { icon: ShoppingBag, title: "Customer", copy: "Buyers discover, ask and order." },
];

const features = [
  {
    icon: Wand2,
    title: "AI Listing Studio",
    copy: "Title, description, tags, category and a multilingual listing generated from one voice note.",
  },
  {
    icon: IndianRupee,
    title: "Smart Pricing",
    copy: "Material, labour, craft complexity and live market signals become a defensible price — with a 'why'.",
  },
  {
    icon: Camera,
    title: "AI Image Studio",
    copy: "Background cleanup, studio lighting and marketplace-ready crops from a kitchen-table photo.",
  },
  {
    icon: Globe2,
    title: "Multilingual Commerce",
    copy: "Buyers write in English, artisans reply in Hindi. Both sides read their own language.",
  },
  {
    icon: QrCode,
    title: "Store + QR",
    copy: "A shareable storefront and printable QR code for melas, markets and WhatsApp.",
  },
  {
    icon: TrendingUp,
    title: "AI Business Coach",
    copy: "What sells, what to price up, and what to make next — in plain language.",
  },
];

function Landing() {
  const featured = products.slice(0, 3);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden px-5 pt-16 pb-24 sm:pt-24">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="animate-rise">
              <SectionLabel>AI for Indian Artisans</SectionLabel>
              <h1 className="font-display mt-6 text-5xl leading-[1.02] font-semibold sm:text-6xl lg:text-7xl">
                KARIGAR<span className="text-ember">AI</span>
              </h1>
              <p className="font-display mt-4 max-w-xl text-2xl text-muted-foreground sm:text-3xl">
                From Craft to Commerce, <span className="text-ember">Powered by AI.</span>
              </p>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                A weaver in Varanasi should not need a photographer, a copywriter, a pricing analyst
                and a web developer to sell online. She needs a phone, her voice, and KarigarAI.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  to="/auth"
                  search={{ role: "artisan" }}
                  className="group inline-flex items-center gap-2 rounded-full bg-ember px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-1"
                >
                  Start Creating
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-surface/50 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur-md transition-all hover:-translate-y-1 hover:border-accent/60"
                >
                  Explore Artisans
                </Link>
              </div>

              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4">
                {[
                  ["11", "Craft clusters"],
                  ["9 min", "Photo to storefront"],
                  ["12", "Languages"],
                ].map(([v, k]) => (
                  <div key={k} className="glass-soft rounded-2xl px-4 py-3">
                    <dt className="font-display text-2xl font-semibold text-ember">{v}</dt>
                    <dd className="text-xs text-muted-foreground">{k}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Hero visual: the pipeline around the orb */}
            <div className="relative">
              <div className="glass relative rounded-[2rem] p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <SectionLabel>Live pipeline</SectionLabel>
                  <span className="text-[0.66rem] tracking-[0.2em] text-muted-foreground uppercase">
                    Karigar Engine
                  </span>
                </div>

                <div className="relative mt-6 grid place-items-center">
                  <AIOrb size={200} label="Karigar Engine" />
                </div>

                <div className="mt-10 space-y-3">
                  {flow.map((s, i) => (
                    <div
                      key={s.title}
                      className="lift animate-rise glass-soft flex items-center gap-4 rounded-2xl px-4 py-3"
                      style={{ animationDelay: `${i * 90}ms` }}
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                        <s.icon className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{s.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{s.copy}</p>
                      </div>
                      {i < flow.length - 1 && (
                        <ArrowRight className="ml-auto size-4 shrink-0 text-accent/60" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="animate-float glass-soft absolute -right-3 -bottom-6 hidden rounded-2xl px-4 py-3 sm:block">
                <p className="text-[0.66rem] tracking-widest text-muted-foreground uppercase">
                  Suggested price
                </p>
                <p className="font-display text-xl font-semibold text-ember">₹3,200</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <SectionLabel>The companion</SectionLabel>
            <h2 className="font-display mt-5 max-w-2xl text-4xl font-semibold sm:text-5xl">
              Everything a craft business needs, minus the technology.
            </h2>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <article key={f.title} className="lift glass rounded-3xl p-6">
                  <span className="grid size-11 place-items-center rounded-2xl bg-ember text-primary-foreground">
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SHOWCASE */}
        <section className="px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <SectionLabel>Made by hand</SectionLabel>
                <h2 className="font-display mt-5 text-4xl font-semibold sm:text-5xl">
                  Listings the AI wrote. Objects the hands made.
                </h2>
              </div>
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
              >
                Browse the marketplace <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {featured.map((p) => {
                const a = artisans.find((x) => x.id === p.artisanId)!;
                return (
                  <Link
                    key={p.id}
                    to="/product/$productId"
                    params={{ productId: p.id }}
                    className="lift glass group overflow-hidden rounded-3xl"
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
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
                    </div>
                    <div className="p-5">
                      <p className="text-[0.66rem] tracking-[0.2em] text-accent uppercase">
                        {p.craft}
                      </p>
                      <h3 className="mt-2 text-base font-semibold">{p.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {a.name} · {a.location}
                      </p>
                      <p className="font-display mt-3 text-lg font-semibold text-ember">
                        {inr(p.price)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section className="px-5 py-24">
          <div className="glass craft-pattern relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] px-8 py-16 text-center">
            <div className="pointer-events-none absolute inset-0 bg-ember opacity-[0.07]" />
            <div className="relative">
              <AIOrb size={120} className="mx-auto" />
              <h2 className="font-display mt-8 text-4xl font-semibold sm:text-5xl">
                Your craft is ready. <span className="text-ember">Your business isn't yet.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Nine minutes from a photograph on your workbench to a storefront a buyer in Berlin
                can order from.
              </p>
              <Link
                to="/auth"
                search={{ role: "artisan" }}
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-ember px-8 py-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-1"
              >
                Start Creating <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
