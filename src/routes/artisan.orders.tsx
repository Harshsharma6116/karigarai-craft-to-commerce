import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, IndianRupee, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel, StatCard, StatusPill } from "@/components/studio";
import { inr, useStore } from "@/lib/store";
import { ORDER_FLOW } from "@/lib/types";

export const Route = createFileRoute("/artisan/orders")({
  component: Orders,
});

function Orders() {
  const { orders, products, advanceOrder } = useStore();
  const [filter, setFilter] = useState<string>("All");

  const list = filter === "All" ? orders : orders.filter((o) => o.status === filter);
  const earned = orders
    .filter((o) => o.status === "Delivered")
    .reduce((s, o) => s + o.amount, 0);
  const open = orders.filter((o) => o.status !== "Delivered").length;

  return (
    <>
      <PageHeader
        label="Orders"
        title={
          <>
            {orders.length} orders, <span className="text-ember">{open} in motion</span>
          </>
        }
        subtitle="Move an order forward and your dashboard earnings update with it."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={PackageSearch} label="Open orders" value={String(open)} />
        <StatCard icon={IndianRupee} label="Delivered earnings" value={inr(earned)} accent />
        <StatCard
          icon={Check}
          label="Fulfilment rate"
          value={`${Math.round((orders.filter((o) => o.status === "Delivered").length / orders.length) * 100)}%`}
        />
      </div>

      <Panel className="mt-6">
        <div className="mb-5 flex flex-wrap gap-2">
          {["All", ...ORDER_FLOW].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                filter === s
                  ? "bg-ember text-primary-foreground"
                  : "border border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {list.map((o) => {
            const p = products.find((x) => x.id === o.productId);
            const idx = ORDER_FLOW.indexOf(o.status);
            return (
              <article key={o.id} className="glass-soft rounded-3xl p-5">
                <div className="flex flex-wrap items-center gap-4">
                  {p && (
                    <img
                      src={p.image}
                      alt={p.title}
                      width={800}
                      height={800}
                      loading="lazy"
                      className="size-14 rounded-2xl object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p?.title ?? "Product"}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.id} · {o.buyerName} · {o.city} · Qty {o.qty} · {o.placedAt}
                    </p>
                  </div>
                  <span className="font-display text-lg font-semibold text-ember">
                    {inr(o.amount)}
                  </span>
                  <StatusPill status={o.status} />
                </div>

                {/* Progress rail */}
                <div className="mt-5 flex items-center gap-2">
                  {ORDER_FLOW.map((s, i) => (
                    <div key={s} className="flex flex-1 items-center gap-2">
                      <div className="flex-1">
                        <div
                          className={`h-1.5 rounded-full ${i <= idx ? "bg-ember" : "bg-secondary"}`}
                        />
                        <p
                          className={`mt-2 text-[0.6rem] tracking-wide ${
                            i <= idx ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {s}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {o.status !== "Delivered" && (
                  <button
                    onClick={() => {
                      advanceOrder(o.id);
                      toast.success(`${o.id} moved to ${ORDER_FLOW[idx + 1]}`);
                    }}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-ember px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                  >
                    Mark as {ORDER_FLOW[idx + 1]} <ArrowRight className="size-3.5" />
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </Panel>
    </>
  );
}
