interface OrbProps {
  size?: number;
  label?: string;
  active?: boolean;
  className?: string;
}

/** Glowing, layered AI orb — the visual signature of KarigarAI. */
export function AIOrb({ size = 220, active = true, label, className = "" }: OrbProps) {
  return (
    <div
      className={`relative grid place-items-center ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="animate-pulse-glow absolute inset-0 rounded-full blur-3xl"
        style={{ background: "var(--gradient-ember)", opacity: 0.35 }}
      />
      <div
        className={`absolute inset-[8%] rounded-full border border-accent/25 ${active ? "animate-spin-slow" : ""}`}
        style={{ borderTopColor: "transparent", borderLeftColor: "transparent" }}
      />
      <div
        className={`absolute inset-[16%] rounded-full border border-primary/40 ${active ? "animate-spin-slow [animation-direction:reverse] [animation-duration:14s]" : ""}`}
        style={{ borderBottomColor: "transparent" }}
      />
      <div
        className="absolute inset-[24%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 32% 28%, oklch(0.92 0.09 88 / 0.95), oklch(0.63 0.155 42 / 0.85) 42%, oklch(0.28 0.06 30 / 0.9) 78%)",
          boxShadow:
            "inset 0 -18px 40px oklch(0 0 0 / 0.55), 0 0 60px oklch(0.63 0.155 42 / 0.55)",
        }}
      />
      <div className="animate-float absolute inset-[30%] rounded-full bg-gold/25 blur-xl" />
      {label ? (
        <span className="absolute -bottom-1 text-[0.68rem] font-medium tracking-[0.24em] text-muted-foreground uppercase">
          {label}
        </span>
      ) : null}
    </div>
  );
}
