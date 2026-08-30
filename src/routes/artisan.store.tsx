import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Eye, MousePointerClick, QrCode } from "lucide-react";
import { PageHeader, Panel, StatCard } from "@/components/studio";
import { QRPanel } from "@/components/qr-code";
import { inr, useStore } from "@/lib/store";

export const Route = createFileRoute("/artisan/store")({
  component: MyStore,
});

function MyStore() {
  const { activeArtisan, products } = useStore();
  const mine = products.filter((p) => p.artisanId === activeArtisan.id);

  return (
    <>
      <PageHeader
        label="My store"
        title={
          <>
            Your storefront is <span className="text-ember">live</span>
          </>
        }
        subtitle="Every product you publish appears here automatically — no setup, no theme, no code."
        action={
          <Link
            to="/store/$slug"
            params={{ slug: activeArtisan.slug }}
            className="inline-flex items-center gap-2 rounded-full border border-accent/30 px-6 py-3 text-sm font-semibold transition-colors hover:border-accent/70"
          >
            <ExternalLink className="size-4" /> Open public store
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Eye} label="Store visits this month" value="3,412" delta="+27%" />
        <StatCard icon={QrCode} label="QR scans" value="486" delta="+44%" accent />
        <StatCard icon={MousePointerClick} label="Visit → order rate" value="4.8%" delta="+0.9%" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Storefront preview">
          <div className="glass-soft craft-pattern rounded-3xl p-6">
            <div className="flex items-center gap-4">
              <span className="font-display grid size-14 place-items-center rounded-2xl bg-ember text-lg font-semibold text-primary-foreground">
                {activeArtisan.initials}
              </span>
              <div>
                <p className="font-display text-xl font-semibold">{activeArtisan.name}</p>
                <p className="text-xs text-muted-foreground">
                  {activeArtisan.craft} · {activeArtisan.location}
                </p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {mine.slice(0, 6).map((p) => (
                <div key={p.id} className="overflow-hidden rounded-2xl">
                  <img
                    src={p.image}
                    alt={p.title}
                    width={800}
                    height={800}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                  <p className="mt-1.5 truncate text-[0.68rem] text-muted-foreground">
                    {inr(p.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <div className="flex justify-center lg:justify-start">
          <QRPanel path={`/store/${activeArtisan.slug}`} label={`${activeArtisan.name}'s store`} />
        </div>
      </div>
    </>
  );
}
