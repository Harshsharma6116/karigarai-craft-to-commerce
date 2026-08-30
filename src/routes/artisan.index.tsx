import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  Boxes,
  Eye,
  Heart,
  IndianRupee,
  Lightbulb,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import { AIOrb } from "@/components/ai-orb";
import { PageHeader, Panel, StatCard, StatusPill } from "@/components/studio";
import { monthlySeries } from "@/lib/data";
import { inr, useStore } from "@/lib/store";

export const Route = createFileRoute("/artisan/")({
  component: Dashboard,
});

const insights = [
  {
    icon: Sparkles,
    title: "Diyas are carrying your store",
    body: "Terracotta diyas drive 41% of your views but only 12% of revenue. Bundle six diyas with a brass holder at ₹1,450 to lift order value.",
  },
  {
    icon: IndianRupee,
    title: "Your blue pottery is underpriced",
    body: "Comparable Jaipur blue pottery vases sell at ₹3,600–₹4,100. A ₹400 increase is unlikely to affect conversion at your rating of 4.9.",
  },
  {
    icon: Heart,
    title: "Nine buyers asked about gifting",
    body: "Add a gift-wrap option and a short handwritten note — festive buyers convert 2.3x higher when gifting is offered.",
  },
];

function Dashboard() {
  const { products, orders, activeArtisan } = useStore();

  const totalViews = products.reduce((s, p) => s + p.views, 0);
  const totalEarnings = orders.reduce((s, o) => s + o.amount, 0);
  const avgRating = (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1);
  const topProducts = [...products].sort((a, b) => b.sold * b.price - a.sold * a.price).slice(0, 4);
  const recent = orders.slice(0, 5);

  return (
    <>
      <PageHeader
        label="Dashboard"
        title={
          <>
            Namaste, <span className="text-ember">{activeArtisan.name.split(" ")[0]}</span>
          </>
        }
        subtitle={`Your ${activeArtisan.craft.toLowerCase()} business at a glance — August has been your strongest month yet.`}
        action={
          <Link
            to="/artisan/create"
            className="inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
          >
            <Sparkles className="size-4" /> Create Product
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Eye} label="Total product views" value={totalViews.toLocaleString("en-IN")} delta="+24%" />
        <StatCard icon={IndianRupee} label="Total earnings" value={inr(totalEarnings)} delta="+18%" accent />
        <StatCard icon={ShoppingBag} label="Total orders" value={String(orders.length)} delta="+9%" />
        <StatCard icon={Heart} label="Interested buyers" value="127" delta="+31%" />
        <StatCard icon={Boxes} label="Active products" value={String(products.length)} />
        <StatCard icon={Star} label="Average rating" value={`${avgRating} / 5`} delta="+0.2" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Panel title="Revenue & views" action={<span className="text-xs text-muted-foreground">Last 6 months</span>}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySeries}>
                <defs>
                  <linearGradient id="gEarn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.65} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 16,
                    color: "var(--color-foreground)",
                  }}
                />
                <Area type="monotone" dataKey="earnings" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#gEarn)" />
                <Area type="monotone" dataKey="views" stroke="var(--color-chart-2)" strokeWidth={2} fill="url(#gViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="What should I make next?">
          <div className="flex flex-col items-center text-center">
            <AIOrb size={130} />
            <p className="font-display mt-6 text-xl leading-snug">
              A <span className="text-ember">blue pottery tea set</span> for six.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Searches for “handmade Indian tea set” are up 62% this quarter, and 3 of your last 9
              buyer questions asked whether you make cups. Your existing cobalt vine motif scales
              directly onto a cup body — no new mould required.
            </p>
            <div className="mt-5 grid w-full grid-cols-2 gap-3 text-left">
              <div className="glass-soft rounded-2xl px-3 py-2.5">
                <p className="text-[0.62rem] tracking-widest text-muted-foreground uppercase">
                  Est. price
                </p>
                <p className="font-display text-lg font-semibold text-ember">₹4,800</p>
              </div>
              <div className="glass-soft rounded-2xl px-3 py-2.5">
                <p className="text-[0.62rem] tracking-widest text-muted-foreground uppercase">
                  Confidence
                </p>
                <p className="font-display text-lg font-semibold text-ember">87%</p>
              </div>
            </div>
            <Link
              to="/artisan/coach"
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              Ask the AI coach <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Top-performing products">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProducts.map((p) => ({
                  name: p.title.split(" ").slice(-2).join(" "),
                  revenue: p.sold * p.price,
                }))}
              >
                <CartesianGrid strokeDasharray="3 6" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "var(--color-secondary)", opacity: 0.4 }}
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 16,
                  }}
                />
                <Bar dataKey="revenue" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-5 space-y-3">
            {topProducts.slice(0, 3).map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <img src={p.image} alt={p.title} width={800} height={800} loading="lazy" className="size-11 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.sold} sold · {p.views.toLocaleString("en-IN")} views
                  </p>
                </div>
                <span className="text-sm font-semibold text-ember">{inr(p.sold * p.price)}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Recent orders"
          action={
            <Link to="/artisan/orders" className="text-xs font-semibold text-accent hover:underline">
              Manage orders →
            </Link>
          }
        >
          <ul className="space-y-3">
            {recent.map((o) => {
              const p = products.find((x) => x.id === o.productId);
              return (
                <li key={o.id} className="glass-soft flex items-center gap-3 rounded-2xl px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p?.title ?? "Product"}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.buyerName} · {o.city} · {o.id}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">{inr(o.amount)}</span>
                  <StatusPill status={o.status} />
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      <Panel title="AI business insights" className="mt-6">
        <div className="grid gap-4 md:grid-cols-3">
          {insights.map((i) => (
            <article key={i.title} className="lift glass-soft rounded-2xl p-5">
              <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary">
                <i.icon className="size-4" />
              </span>
              <h3 className="mt-4 text-sm font-semibold">{i.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{i.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-accent/25 bg-accent/8 px-4 py-3">
          <Lightbulb className="size-4 shrink-0 text-accent" />
          <p className="text-xs text-muted-foreground">
            Insights refresh every morning from your views, questions and orders.
          </p>
        </div>
      </Panel>
    </>
  );
}
