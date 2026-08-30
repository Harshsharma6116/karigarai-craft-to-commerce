import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Check,
  Image as ImageIcon,
  IndianRupee,
  Languages,
  Loader2,
  Mic,
  Rocket,
  Sparkles,
  Square,
  Upload,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { AIOrb } from "@/components/ai-orb";
import { PageHeader, Panel } from "@/components/studio";
import pottery from "@/assets/product-pottery.jpg";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/artisan/create")({
  component: CreateProduct,
});

type Stage = "input" | "processing" | "review";

const STEPS = [
  "Understanding Craft",
  "Identifying Product",
  "Creating Listing",
  "Enhancing Image",
  "Estimating Price",
];

const DEMO_TRANSCRIPT =
  "यह जयपुर की ब्लू पॉटरी का फूलदान है। इसे बनाने में नौ दिन लगे। ऊपर सोने जैसी किनारी है और नीले रंग की बेल हाथ से बनाई गई है।";
const DEMO_TRANSLATION =
  "This is a Jaipur blue pottery vase. It took nine days to make. It has a gold-toned rim and the cobalt vine motif is drawn entirely by hand.";

const BREAKDOWN = [
  { label: "Material cost", value: 620, note: "Quartz, glass frit, cobalt oxide, glaze" },
  { label: "Labour", value: 1150, note: "9 days of shaping, drawing and firing" },
  { label: "Craft complexity", value: 780, note: "Freehand motif, GI-tagged technique" },
  { label: "Market signals", value: 430, note: "Comparable Jaipur listings ₹3,600–₹4,100" },
  { label: "Estimated margin", value: 220, note: "Healthy 7% buffer after platform costs" },
];

function CreateProduct() {
  const navigate = useNavigate();
  const { addProduct, activeArtisan } = useStore();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [stage, setStage] = useState<Stage>("input");
  const [image, setImage] = useState<string>(pottery);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [step, setStep] = useState(0);

  // review state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(3200);
  const [enhanced, setEnhanced] = useState(true);
  const [lang, setLang] = useState<"en" | "hi" | "ta">("en");

  const total = BREAKDOWN.reduce((s, b) => s + b.value, 0);

  useEffect(() => {
    if (!recording) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [recording]);

  useEffect(() => {
    if (stage !== "processing") return;
    setStep(0);
    const id = window.setInterval(() => {
      setStep((s) => {
        if (s >= STEPS.length - 1) {
          window.clearInterval(id);
          window.setTimeout(() => {
            setTitle("Hand-Painted Blue Pottery Vase");
            setPrice(3200);
            setStage("review");
          }, 700);
          return s;
        }
        return s + 1;
      });
    }, 1250);
    return () => window.clearInterval(id);
  }, [stage]);

  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      setTranscript(DEMO_TRANSCRIPT);
      toast.success("Voice note transcribed in Hindi");
    } else {
      setSeconds(0);
      setTranscript("");
      setRecording(true);
    }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImage(URL.createObjectURL(f));
    toast.success("Photo added");
  };

  const generate = () => {
    if (!transcript.trim()) {
      toast.error("Record a voice note or type a description first");
      return;
    }
    setStage("processing");
  };

  const publish = () => {
    const p: Product = {
      id: `p${Date.now()}`,
      artisanId: activeArtisan.id,
      title,
      titleHi: "हस्तनिर्मित ब्लू पॉटरी फूलदान",
      description:
        "A quartz-bodied Jaipur blue pottery vase with a freehand cobalt vine motif and gold-toned rim. Nine days of shaping, drawing and low-temperature firing.",
      story: DEMO_TRANSLATION,
      category: "Home Decor",
      subcategory: "Vases & Pots",
      tags: ["blue pottery", "jaipur", "handpainted", "cobalt", "gi craft", "gift"],
      price,
      image,
      rating: 5,
      reviews: 0,
      views: 0,
      sold: 0,
      craft: "Jaipur Blue Pottery",
      material: "Quartz powder, glass frit, natural oxides",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    addProduct(p);
    toast.success("Published to your storefront");
    navigate({ to: "/artisan/products" });
  };

  return (
    <>
      <PageHeader
        label="Create product"
        title={
          <>
            Snap. Speak. <span className="text-ember">Publish.</span>
          </>
        }
        subtitle="Photograph the piece and describe it in Hindi or your own language. KarigarAI writes the rest."
      />

      {stage === "input" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="1 · Product photo">
            <button
              onClick={() => fileRef.current?.click()}
              className="group relative block w-full overflow-hidden rounded-3xl border border-dashed border-accent/35 transition-colors hover:border-accent/70"
            >
              <img
                src={image}
                alt="Product to list"
                width={800}
                height={800}
                className="aspect-square w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-background/70 py-3 text-sm backdrop-blur-md">
                <Upload className="size-4" /> Upload or take a photo
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onFile}
            />
            <p className="mt-4 text-xs text-muted-foreground">
              Any phone photo works — the AI Image Studio handles the background and lighting.
            </p>
          </Panel>

          <Panel title="2 · Describe it in your language">
            <div className="flex flex-col items-center rounded-3xl border border-border/60 bg-background/30 p-8">
              <button
                onClick={toggleRecording}
                className={`relative grid size-24 place-items-center rounded-full transition-transform hover:scale-105 ${
                  recording ? "bg-destructive/90" : "bg-ember"
                } text-primary-foreground shadow-[var(--shadow-glow)]`}
              >
                {recording && (
                  <span className="animate-pulse-glow absolute inset-0 rounded-full bg-destructive/40" />
                )}
                {recording ? (
                  <Square className="relative size-7 fill-current" />
                ) : (
                  <Mic className="relative size-8" />
                )}
              </button>
              <p className="mt-5 text-sm font-medium">
                {recording
                  ? `Listening… ${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`
                  : "Tap to speak in Hindi, Tamil, Bengali…"}
              </p>
              {recording && (
                <div className="mt-4 flex h-10 items-end gap-1">
                  {Array.from({ length: 22 }).map((_, i) => (
                    <span
                      key={i}
                      className="animate-float w-1 rounded-full bg-accent/70"
                      style={{
                        height: `${18 + Math.abs(Math.sin(i * 1.4)) * 26}px`,
                        animationDelay: `${i * 60}ms`,
                        animationDuration: "1.4s",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={4}
              placeholder="…or type it here in any language"
              className="mt-5 w-full rounded-2xl border border-input bg-background/40 px-4 py-3 text-sm outline-none focus:border-primary"
            />
            {transcript && (
              <p className="mt-3 rounded-2xl bg-accent/8 px-4 py-3 text-xs text-muted-foreground">
                <Languages className="mr-1 inline size-3.5 text-accent" />
                {DEMO_TRANSLATION}
              </p>
            )}

            <button
              onClick={generate}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ember px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
            >
              <Sparkles className="size-4" /> Generate my listing
            </button>
          </Panel>
        </div>
      )}

      {stage === "processing" && (
        <Panel className="grid place-items-center py-16">
          <AIOrb size={210} label="Karigar Engine" />
          <div className="mt-12 w-full max-w-md space-y-3">
            {STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <div
                  key={s}
                  className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-all ${
                    active ? "glass-soft scale-[1.02]" : done ? "opacity-80" : "opacity-40"
                  }`}
                >
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-full ${
                      done
                        ? "bg-success/20 text-success"
                        : active
                          ? "bg-ember text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {done ? (
                      <Check className="size-4" />
                    ) : active ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <span className="text-xs">{i + 1}</span>
                    )}
                  </span>
                  <span className="text-sm font-medium">{s}</span>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      {stage === "review" && (
        <div className="space-y-6">
          {/* Listing */}
          <Panel
            title="AI-generated listing"
            action={
              <span className="rounded-full bg-success/12 px-3 py-1 text-[0.68rem] text-success">
                Ready to edit
              </span>
            }
          >
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-4">
                <Labeled label="Product title">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background/40 px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </Labeled>
                <Labeled label="Description">
                  <p className="rounded-xl border border-border/60 bg-background/30 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                    A quartz-bodied Jaipur blue pottery vase with a freehand cobalt vine motif and
                    a gold-toned rim. Nine days of shaping, drawing and low-temperature firing make
                    every piece slightly, deliberately different.
                  </p>
                </Labeled>
                <div className="grid grid-cols-2 gap-3">
                  <Labeled label="Category">
                    <p className="rounded-xl bg-secondary/50 px-4 py-2.5 text-sm">Home Decor</p>
                  </Labeled>
                  <Labeled label="Subcategory">
                    <p className="rounded-xl bg-secondary/50 px-4 py-2.5 text-sm">Vases & Pots</p>
                  </Labeled>
                </div>
                <Labeled label="Search tags">
                  <div className="flex flex-wrap gap-2">
                    {["blue pottery", "jaipur", "handpainted", "cobalt", "gi craft", "gift"].map(
                      (t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground"
                        >
                          #{t}
                        </span>
                      ),
                    )}
                  </div>
                </Labeled>
              </div>

              <div className="space-y-4">
                <Labeled label="Craft & style information">
                  <div className="glass-soft space-y-2 rounded-2xl px-4 py-3 text-sm">
                    <Row k="Craft" v="Jaipur Blue Pottery (GI tagged)" />
                    <Row k="Technique" v="Freehand cobalt motif, low-fire glaze" />
                    <Row k="Material" v="Quartz powder, glass frit, natural oxides" />
                    <Row k="Origin" v="Jaipur, Rajasthan" />
                  </div>
                </Labeled>

                <Labeled label="Multilingual listing">
                  <div className="glass-soft rounded-2xl p-4">
                    <div className="flex gap-2">
                      {(
                        [
                          ["en", "English"],
                          ["hi", "हिन्दी"],
                          ["ta", "தமிழ்"],
                        ] as const
                      ).map(([k, l]) => (
                        <button
                          key={k}
                          onClick={() => setLang(k)}
                          className={`rounded-full px-3 py-1 text-xs transition-colors ${
                            lang === k
                              ? "bg-ember text-primary-foreground"
                              : "bg-secondary/60 text-muted-foreground"
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed">
                      {lang === "en"
                        ? "Hand-Painted Blue Pottery Vase — nine days of work, drawn freehand in Jaipur."
                        : lang === "hi"
                          ? "हस्तनिर्मित ब्लू पॉटरी फूलदान — जयपुर में नौ दिनों की मेहनत, पूरी तरह हाथ से बनाई गई बेल।"
                          : "கை வண்ணம் தீட்டிய நீல மட்பாண்ட ஜாடி — ஜெய்ப்பூரில் ஒன்பது நாள் உழைப்பு."}
                    </p>
                  </div>
                </Labeled>

                <Labeled label="Product story">
                  <p className="font-display rounded-2xl border border-accent/20 bg-accent/6 px-4 py-3 text-base leading-relaxed">
                    “Nine days, one vase. The vines came from a Hawa Mahal window my father made me
                    copy until my hand stopped shaking.”
                  </p>
                </Labeled>
              </div>
            </div>
          </Panel>

          {/* Image studio */}
          <Panel
            title="AI Image Studio"
            action={
              <button
                onClick={() => setEnhanced((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs hover:border-accent/60"
              >
                <Wand2 className="size-3.5 text-accent" />
                {enhanced ? "Enhanced" : "Original"}
              </button>
            }
          >
            <div className="grid gap-5 md:grid-cols-2">
              <figure className="overflow-hidden rounded-3xl border border-border/60">
                <img
                  src={image}
                  alt="Original photo"
                  width={800}
                  height={800}
                  className="aspect-square w-full object-cover"
                  style={{ filter: "brightness(0.82) saturate(0.85) contrast(0.95)" }}
                />
                <figcaption className="bg-background/60 px-4 py-2.5 text-xs text-muted-foreground">
                  Original photo
                </figcaption>
              </figure>
              <figure className="relative overflow-hidden rounded-3xl border border-primary/40 shadow-[var(--shadow-glow)]">
                <img
                  src={image}
                  alt="AI enhanced product photo"
                  width={800}
                  height={800}
                  className="aspect-square w-full object-cover transition-all duration-700"
                  style={{
                    filter: enhanced
                      ? "brightness(1.1) saturate(1.18) contrast(1.1)"
                      : "brightness(0.82) saturate(0.85)",
                  }}
                />
                <span className="absolute top-3 left-3 rounded-full bg-ember px-3 py-1 text-[0.62rem] font-semibold tracking-widest text-primary-foreground uppercase">
                  AI Enhanced
                </span>
                <figcaption className="bg-background/60 px-4 py-2.5 text-xs text-muted-foreground">
                  Marketplace-ready · 1:1 crop
                </figcaption>
              </figure>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {[
                "Background removed",
                "Lighting corrected",
                "Cropped & cleaned",
                "Marketplace ready",
              ].map((s) => (
                <div
                  key={s}
                  className="glass-soft flex items-center gap-2 rounded-2xl px-3 py-2.5 text-xs"
                >
                  <Check className="size-3.5 shrink-0 text-success" /> {s}
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-accent/25 bg-accent/8 px-4 py-3">
              <ImageIcon className="mt-0.5 size-4 shrink-0 text-accent" />
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  Optional AI lifestyle preview:
                </span>{" "}
                the vase styled on a walnut console with soft window light. Clearly labelled as an
                AI-generated preview on your storefront — the product photo above stays the real
                one.
              </p>
            </div>
          </Panel>

          {/* Pricing */}
          <Panel title="Smart pricing">
            <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <p className="text-xs tracking-widest text-muted-foreground uppercase">
                  Suggested price
                </p>
                <p className="font-display mt-2 text-5xl font-semibold text-ember">
                  ₹{total.toLocaleString("en-IN")}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Confident range ₹2,900 – ₹3,700
                </p>

                <label className="mt-8 block text-xs tracking-widest text-muted-foreground uppercase">
                  Your final price
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex flex-1 items-center gap-2 rounded-2xl border border-input bg-background/40 px-4 py-3">
                    <IndianRupee className="size-4 text-muted-foreground" />
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-transparent text-lg font-semibold outline-none"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={5000}
                  step={50}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="mt-4 w-full accent-[oklch(0.63_0.155_42)]"
                />
                <p className="mt-3 text-xs text-muted-foreground">
                  {price < 2900
                    ? "Below the confident range — you may be underselling nine days of work."
                    : price > 3700
                      ? "Above the confident range — expect slower conversion, higher margin."
                      : "Inside the confident range. Good balance of margin and conversion."}
                </p>
              </div>

              <div>
                <p className="text-xs tracking-widest text-muted-foreground uppercase">
                  Why this price?
                </p>
                <ul className="mt-4 space-y-3">
                  {BREAKDOWN.map((b) => (
                    <li key={b.label} className="glass-soft rounded-2xl px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{b.label}</span>
                        <span className="text-sm font-semibold text-ember">
                          ₹{b.value.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-ember"
                          style={{ width: `${(b.value / total) * 100}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{b.note}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Panel>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={publish}
              className="inline-flex items-center gap-2 rounded-full bg-ember px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
            >
              <Rocket className="size-4" /> Publish to my store
            </button>
            <button
              onClick={() => setStage("input")}
              className="rounded-full border border-border px-6 py-3.5 text-sm font-semibold transition-colors hover:border-accent/60"
            >
              Start over
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[0.66rem] tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right">{v}</span>
    </div>
  );
}
