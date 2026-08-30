import { useEffect, useRef } from "react";

/**
 * Animated flowing waves + drifting craft particles rendered on canvas.
 * Purely decorative background layer; colors come from design tokens.
 */
export function AmbientCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const particles = Array.from({ length: 46 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.4,
      s: Math.random() * 0.00022 + 0.00006,
      a: Math.random() * 0.5 + 0.15,
    }));

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const waves = [
      { amp: 46, len: 0.0035, sp: 0.0016, y: 0.62, color: "rgba(198, 108, 58, 0.20)" },
      { amp: 34, len: 0.0048, sp: -0.0021, y: 0.72, color: "rgba(224, 168, 74, 0.14)" },
      { amp: 58, len: 0.0026, sp: 0.0011, y: 0.84, color: "rgba(120, 96, 220, 0.10)" },
    ];

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      for (const wave of waves) {
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 8) {
          const y =
            h * wave.y +
            Math.sin(x * wave.len + t * wave.sp) * wave.amp +
            Math.sin(x * wave.len * 2.3 + t * wave.sp * 1.7) * (wave.amp * 0.35);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, h * wave.y - wave.amp, 0, h);
        grad.addColorStop(0, wave.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fill();
      }

      for (const p of particles) {
        p.y -= p.s * (reduce ? 0 : 16);
        if (p.y < -0.02) p.y = 1.02;
        const px = (p.x + Math.sin(t * 0.0006 + p.y * 8) * 0.01) * w;
        const py = p.y * h;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 178, 96, ${p.a})`;
        ctx.fill();
      }

      t += reduce ? 0 : 10;
      raf = window.requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

/** Full-page atmospheric backdrop: gradient, craft pattern, glows and canvas. */
export function Ambient() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--gradient-dusk)" }} />
      <div className="craft-pattern absolute inset-0 opacity-[0.5]" />
      <div className="animate-drift absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-primary/20 blur-[130px]" />
      <div className="animate-drift absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full bg-accent/12 blur-[140px] [animation-delay:-6s]" />
      <div className="animate-drift absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full bg-indigo-craft/12 blur-[140px] [animation-delay:-12s]" />
      <AmbientCanvas className="opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background" />
    </div>
  );
}
