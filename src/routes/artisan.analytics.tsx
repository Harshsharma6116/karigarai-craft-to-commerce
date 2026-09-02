import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader, Panel } from "@/components/studio";
import { monthlySeries, trafficSources } from "@/lib/data";
import { inr, useStore } from "@/lib/store";

export const Route = createFileRoute("/artisan/analytics")({
  component: Analytics,
});

const metrics = [
  { key: "views", label: "Views", color: "var(--color-chart-2)" },
  { key: "orders", label: "Orders", color: "var(--color-chart-1)" },
  { key: "earnings", label: "Earnings", color: "var(--color-chart-5)" },
  { key: "engagement", label: "Engagement", color: "var(--color-chart-4)" },
] as const;

const pieColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-5)",
];

const tooltipStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 16,
  color: "var(--color-foreground)",
};

function Analytics() {
  const { products } = useStore();
  const [metric, setMetric] = useState<(typeof metrics)[number]["key"]>("earnings");
  const active = metrics.find((m) => m.key === metric)!;

  const perProduct = products.map((p) => ({
    name: p.title.split(" ").slice(-2).join(" "),
    views: p.views,
    revenue: p.sold * p.price,
  }));

  return (
    <>
      <PageHeader
        label="Analytics"
        title={
          <>
            The numbers behind <span className="text-ember">the craft</span>
          </>
        }
        subtitle="Six months of views, orders, earnings and engagement across your storefront."
      />

      <Panel
        title={`${active.label} over time`}
        action={
          <div className="flex flex-wrap gap-2">
            {metrics.map((m) => (
              <button
                key={m.key}
                onClick={() => setMetric(m.key)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  metric === m.key
                    ? "bg-ember text-primary-foreground"
                    : "border border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        }
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlySeries}>
              <defs>
                <linearGradient id="gMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={active.color} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={active.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey={metric}
                stroke={active.color}
                strokeWidth={2.5}
                fill="url(#gMetric)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Product performance">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perProduct} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} width={90} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "var(--color-secondary)", opacity: 0.35 }} contentStyle={tooltipStyle} />
                <Bar dataKey="revenue" fill="var(--color-chart-1)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Where buyers come from">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficSources}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={100}
                  paddingAngle={4}
                  stroke="none"
                >
                  {trafficSources.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>}
                />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Engagement vs orders" className="mt-6">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlySeries}>
              <CartesianGrid strokeDasharray="3 6" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>} />
              <Line type="monotone" dataKey="engagement" stroke="var(--color-chart-4)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="orders" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Total earnings across the period:{" "}
          <span className="font-semibold text-ember">
            {inr(monthlySeries.reduce((s, m) => s + m.earnings, 0))}
          </span>
        </p>
      </Panel>
    </>
  );
}
