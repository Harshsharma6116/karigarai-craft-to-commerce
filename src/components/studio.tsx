import type { LucideIcon } from "lucide-react";
import { SectionLabel } from "./brand";

export function PageHeader({
  label,
  title,
  subtitle,
  action,
}: {
  label: string;
  title: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <SectionLabel>{label}</SectionLabel>
        <h1 className="font-display mt-4 text-3xl font-semibold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  accent = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: string;
  accent?: boolean;
}) {
  return (
    <div className={`lift glass rounded-3xl p-5 ${accent ? "border-primary/40" : ""}`}>
      <div className="flex items-start justify-between">
        <span
          className={`grid size-10 place-items-center rounded-2xl ${
            accent ? "bg-ember text-primary-foreground" : "bg-secondary/70 text-accent"
          }`}
        >
          <Icon className="size-4.5" />
        </span>
        {delta && (
          <span className="rounded-full bg-success/12 px-2.5 py-1 text-[0.68rem] font-medium text-success">
            {delta}
          </span>
        )}
      </div>
      <p className="font-display mt-5 text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-xs tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`glass rounded-3xl p-6 ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-3">
          {title && <h2 className="font-display text-lg font-semibold">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

const statusTone: Record<string, string> = {
  Pending: "bg-accent/15 text-accent",
  Confirmed: "bg-primary/18 text-primary",
  Packed: "bg-copper/18 text-copper",
  Shipped: "bg-indigo-craft/25 text-foreground",
  Delivered: "bg-success/15 text-success",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-[0.68rem] font-medium ${statusTone[status] ?? "bg-secondary"}`}
    >
      {status}
    </span>
  );
}
