import { Link } from "@tanstack/react-router";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3">
      <span className="relative grid size-9 place-items-center rounded-xl bg-ember shadow-[var(--shadow-glow)]">
        <span className="absolute inset-0 rounded-xl bg-background/10" />
        <span className="font-display relative text-base font-bold text-primary-foreground">क</span>
      </span>
      {!compact && (
        <span className="font-display text-lg font-semibold tracking-[0.16em] text-foreground uppercase">
          Karigar<span className="text-ember">AI</span>
        </span>
      )}
    </Link>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-3 py-1 text-[0.66rem] font-medium tracking-[0.22em] text-accent uppercase">
      {children}
    </span>
  );
}
