import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Image as ImageIcon,
  IndianRupee,
  Languages,
  Loader2,
  Mic,
  Play,
  RefreshCw,
  Rocket,
  RotateCcw,
  Sparkles,
  Square,
  Trash2,
  Upload,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { AIOrb } from "@/components/ai-orb";
import { PageHeader, Panel } from "@/components/studio";
import { computePricing, generateListing } from "@/lib/ai-demo";
import type { GeneratedListing, PriceResult } from "@/lib/ai-demo";
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

const LANGUAGES = [
  { code: "hi-IN", label: "हिन्दी" },
  { code: "en-IN", label: "English" },
  { code: "ta-IN", label: "தமிழ்" },
  { code: "bn-IN", label: "বাংলা" },
  { code: "mr-IN", label: "मराठी" },
  { code: "te-IN", label: "తెలుగు" },
  { code: "gu-IN", label: "ગુજરાતી" },
  { code: "pa-IN", label: "ਪੰਜਾਬੀ" },
];

const CATEGORIES = [
  "Auto-detect",
  "Home Decor",
  "Textiles",
  "Art & Sculpture",
  "Festive",
  "Jewellery",
];

const DEMO_TRANSCRIPT =
  "यह जयपुर की ब्लू पॉटरी का फूलदान है। इसे बनाने में नौ दिन लगे। ऊपर सोने जैसी किनारी है और नीले रंग की बेल हाथ से बनाई गई है।";

const BG_STYLES = [
  { key: "none", label: "As shot", css: "transparent" },
  { key: "studio", label: "Studio white", css: "linear-gradient(160deg,#f6f2ec,#ddd5ca)" },
  { key: "warm", label: "Warm terracotta", css: "linear-gradient(160deg,#7a3d22,#c4703f)" },
  { key: "charcoal", label: "Charcoal", css: "linear-gradient(160deg,#1b1917,#3a3330)" },
] as const;

type BgKey = (typeof BG_STYLES)[number]["key"];
type CropKey = "original" | "1:1" | "4:5";

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
}

function getRecognition(lang: string): SpeechRecognitionLike | null {
  const w = window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.lang = lang;
  rec.continuous = true;
  rec.interimResults = true;
  return rec;
}

function CreateProduct() {
  const navigate = useNavigate();
  const { addProduct, activeArtisan } = useStore();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const [stage, setStage] = useState<Stage>("input");
  const [image, setImage] = useState<string>("");
  const [imageName, setImageName] = useState("");
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [transcript, setTranscript] = useState("");
  const [lang, setLang] = useState("hi-IN");
  const [step, setStep] = useState(0);

  // craft economics
  const [materialCost, setMaterialCost] = useState(600);
  const [labourHours, setLabourHours] = useState(20);
  const [complexity, setComplexity] = useState(4);
  const [category, setCategory] = useState("Auto-detect");

  // review state
  const [variant, setVariant] = useState(0);
  const [gen, setGen] = useState<GeneratedListing | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [story, setStory] = useState("");
  const [tagText, setTagText] = useState("");
  const [finalCategory, setFinalCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [craft, setCraft] = useState("");
  const [material, setMaterial] = useState("");
  const [price, setPrice] = useState(0);
  const [priceConfirmed, setPriceConfirmed] = useState(false);
  const [tab, setTab] = useState(0);
  const [publishing, setPublishing] = useState(false);

  // image studio
  const [brightness, setBrightness] = useState(1.1);
  const [saturation, setSaturation] = useState(1.18);
  const [contrast, setContrast] = useState(1.1);
  const [crop, setCrop] = useState<CropKey>("1:1");
  const [bg, setBg] = useState<BgKey>("none");
  const [savedImage, setSavedImage] = useState("");

  const pricing: PriceResult | null = useMemo(
    () =>
      gen
        ? computePricing(
            { description: transcript, language: lang, materialCost, labourHours, complexity },
            finalCategory || gen.category,
          )
        : null,
    [gen, transcript, lang, materialCost, labourHours, complexity, finalCategory],
  );

  useEffect(() => {
    if (!recording) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [recording]);

  const applyGenerated = (v: number) => {
    const g = generateListing(
      { description: transcript, language: lang, category, materialCost, labourHours, complexity },
      v,
    );
    setGen(g);
    setTitle(g.title);
    setDescription(g.description);
    setStory(g.story);
    setTagText(g.tags.join(", "));
    setFinalCategory(g.category);
    setSubcategory(g.subcategory);
    setCraft(g.craft);
    setMaterial(g.material);
    const p = computePricing(
      { description: transcript, language: lang, materialCost, labourHours, complexity },
      g.category,
    );
    setPrice(p.suggested);
    setPriceConfirmed(false);
    return g;
  };

  useEffect(() => {
    if (stage !== "processing") return;
    setStep(0);
    const id = window.setInterval(() => {
      setStep((s) => {
        if (s >= STEPS.length - 1) {
          window.clearInterval(id);
          window.setTimeout(() => {
            applyGenerated(variant);
            setStage("review");
          }, 700);
          return s;
        }
        return s + 1;
      });
    }, 1100);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const startRecording = async () => {
    setSeconds(0);
    setAudioUrl("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (chunksRef.current.length) {
          setAudioUrl(URL.createObjectURL(new Blob(chunksRef.current, { type: "audio/webm" })));
        }
      };
      mr.start();
      mediaRef.current = mr;

      const rec = getRecognition(lang);
      if (rec) {
        rec.onresult = (e) => {
          let text = "";
          for (let i = 0; i < e.results.length; i++) text += `${e.results[i]?.[0]?.transcript ?? ""} `;
          setTranscript(text.trim());
        };
        rec.onerror = () => null;
        rec.start();
        recRef.current = rec;
      }
      setRecording(true);
      toast.success(rec ? "Listening — speak now" : "Recording — live transcription unavailable in this browser");
    } catch {
      toast.error("Microphone permission denied. You can type the description instead.");
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    mediaRef.current = null;
    recRef.current?.stop();
    recRef.current = null;
    setRecording(false);
    setTranscript((t) => {
      if (t.trim()) return t;
      toast.info("Nothing was transcribed — inserted a sample description you can edit");
      return DEMO_TRANSCRIPT;
    });
    toast.success("Voice note captured");
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(String(reader.result));
      setSavedImage("");
      setImageName(f.name);
      toast.success("Photo added");
    };
    reader.onerror = () => toast.error("Could not read that file");
    reader.readAsDataURL(f);
    e.target.value = "";
  };

  const generate = () => {
    if (!image) {
      toast.error("Add a photo of your product first");
      return;
    }
    if (transcript.trim().length < 10) {
      toast.error("Record a voice note or type at least a sentence about the piece");
      return;
    }
    setStage("processing");
  };

  const regenerate = (what: string) => {
    const v = variant + 1;
    setVariant(v);
    applyGenerated(v);
    toast.success(`${what} regenerated`);
  };

  const filterCss = `brightness(${brightness}) saturate(${saturation}) contrast(${contrast})`;
  const aspect = crop === "1:1" ? "aspect-square" : crop === "4:5" ? "aspect-[4/5]" : "aspect-auto";

  const resetStudio = () => {
    setBrightness(1.1);
    setSaturation(1.18);
    setContrast(1.1);
    setCrop("1:1");
    setBg("none");
    toast.info("Image adjustments reset");
  };

  const saveImage = async () => {
    if (!image) return;
    try {
      const img = new Image();
      img.src = image;
      await img.decode();
      const size = 900;
      const h = crop === "4:5" ? Math.round(size * 1.25) : crop === "1:1" ? size : Math.round((size * img.height) / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no canvas");

      if (bg !== "none") {
        const grad = ctx.createLinearGradient(0, 0, size, h);
        const stops: Record<Exclude<BgKey, "none">, [string, string]> = {
          studio: ["#f6f2ec", "#ddd5ca"],
          warm: ["#7a3d22", "#c4703f"],
          charcoal: ["#1b1917", "#3a3330"],
        };
        const [a, b] = stops[bg];
        grad.addColorStop(0, a);
        grad.addColorStop(1, b);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, h);
      }

      ctx.filter = filterCss;
      const pad = bg === "none" ? 0 : 0.1;
      const boxW = size * (1 - pad * 2);
      const boxH = h * (1 - pad * 2);
      const scale = bg === "none" ? Math.max(boxW / img.width, boxH / img.height) : Math.min(boxW / img.width, boxH / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, (size - dw) / 2, (h - dh) / 2, dw, dh);

      const out = canvas.toDataURL("image/jpeg", 0.9);
      setSavedImage(out);
      toast.success("Enhanced image saved for this product");
    } catch {
      toast.error("Could not process the image — the original will be used");
      setSavedImage("");
    }
  };

  const publish = () => {
    const tags = tagText.split(",").map((t) => t.trim()).filter(Boolean);
    if (!title.trim()) return toast.error("Add a product title before publishing");
    if (!description.trim()) return toast.error("Add a description before publishing");
    if (!finalCategory.trim()) return toast.error("Choose a category before publishing");
    if (!price || price <= 0) return toast.error("Set a final price before publishing");
    if (tags.length === 0) return toast.error("Add at least one search tag");
    if (!image) return toast.error("A product photo is required");

    setPublishing(true);
    const p: Product = {
      id: `p${Date.now()}`,
      artisanId: activeArtisan.id,
      title: title.trim(),
      titleHi: gen?.titleHi ?? title.trim(),
      description: description.trim(),
      story: story.trim(),
      category: finalCategory,
      subcategory: subcategory || "Handmade Objects",
      tags,
      price,
      image: savedImage || image,
      rating: 5,
      reviews: 0,
      views: 0,
      sold: 0,
      craft: craft || activeArtisan.craft,
      material: material || "Handmade materials",
      createdAt: new Date().toISOString().slice(0, 10),
      status: "published",
    };
    window.setTimeout(() => {
      addProduct(p);
      setPublishing(false);
      toast.success("Published to your storefront");
      navigate({ to: "/artisan/products" });
    }, 650);
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
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="1 · Product photo">
              {image ? (
                <div className="overflow-hidden rounded-3xl border border-border/60">
                  <img
                    src={image}
                    alt="Product to list"
                    className="aspect-square w-full object-cover"
                  />
                  <div className="flex items-center justify-between gap-2 bg-background/60 px-4 py-3">
                    <span className="truncate text-xs text-muted-foreground">
                      {imageName || "Your photo"}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="rounded-full border border-border px-3 py-1.5 text-xs transition-colors hover:border-accent/60"
                      >
                        Replace
                      </button>
                      <button
                        onClick={() => {
                          setImage("");
                          setImageName("");
                          setSavedImage("");
                          toast.info("Photo removed");
                        }}
                        className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs transition-colors hover:border-destructive/60"
                      >
                        <Trash2 className="size-3" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="grid aspect-square w-full place-items-center rounded-3xl border border-dashed border-accent/35 bg-background/30 transition-colors hover:border-accent/70"
                >
                  <span className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
                    <Upload className="size-7 text-accent" />
                    Upload or take a photo
                  </span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFile}
              />
              <p className="mt-4 text-xs text-muted-foreground">
                Any phone photo works — the AI Image Studio handles the background and lighting.
              </p>
            </Panel>

            <Panel title="2 · Describe it in your language">
              <div className="mb-4 flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                      lang === l.code
                        ? "bg-ember text-primary-foreground"
                        : "border border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col items-center rounded-3xl border border-border/60 bg-background/30 p-8">
                <button
                  onClick={() => (recording ? stopRecording() : void startRecording())}
                  className={`relative grid size-24 place-items-center rounded-full transition-transform hover:scale-105 ${
                    recording ? "bg-destructive/90" : "bg-ember"
                  } text-primary-foreground shadow-[var(--shadow-glow)]`}
                  aria-label={recording ? "Stop recording" : "Start recording"}
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
                    : "Tap to speak in your language"}
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
                {audioUrl && !recording && (
                  <div className="mt-5 w-full">
                    <audio controls src={audioUrl} className="w-full" />
                    <button
                      onClick={() => void startRecording()}
                      className="mt-3 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs hover:border-accent/60"
                    >
                      <RefreshCw className="size-3.5" /> Re-record
                    </button>
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
                  {transcript.length} characters captured in{" "}
                  {LANGUAGES.find((l) => l.code === lang)?.label} — the AI will use this.
                </p>
              )}
            </Panel>
          </div>

          <Panel title="3 · Craft economics (powers Smart Pricing)">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Labeled label="Material cost (₹)">
                <input
                  type="number"
                  min={0}
                  value={materialCost}
                  onChange={(e) => setMaterialCost(Number(e.target.value))}
                  className="w-full rounded-xl border border-input bg-background/40 px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </Labeled>
              <Labeled label="Labour (hours)">
                <input
                  type="number"
                  min={1}
                  value={labourHours}
                  onChange={(e) => setLabourHours(Number(e.target.value))}
                  className="w-full rounded-xl border border-input bg-background/40 px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </Labeled>
              <Labeled label={`Complexity · ${complexity}/5`}>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={complexity}
                  onChange={(e) => setComplexity(Number(e.target.value))}
                  className="mt-3 w-full accent-[oklch(0.63_0.155_42)]"
                />
              </Labeled>
              <Labeled label="Category">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background/40 px-4 py-2.5 text-sm outline-none focus:border-primary"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Labeled>
            </div>

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

      {stage === "review" && gen && pricing && (
        <div className="space-y-6">
          <Panel
            title="AI-generated listing"
            action={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => regenerate("Listing")}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs hover:border-accent/60"
                >
                  <RefreshCw className="size-3.5 text-accent" /> Regenerate all
                </button>
                <span className="rounded-full bg-success/12 px-3 py-1 text-[0.68rem] text-success">
                  Editable
                </span>
              </div>
            }
          >
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-4">
                <Labeled label="Product title">
                  <div className="flex gap-2">
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background/40 px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => regenerate("Title")}
                      className="grid size-11 shrink-0 place-items-center rounded-xl border border-border hover:border-accent/60"
                      aria-label="Regenerate title"
                    >
                      <RefreshCw className="size-3.5" />
                    </button>
                  </div>
                </Labeled>
                <Labeled label="Description">
                  <textarea
                    value={description}
                    rows={5}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background/40 px-4 py-3 text-sm leading-relaxed outline-none focus:border-primary"
                  />
                  <button
                    onClick={() => regenerate("Description")}
                    className="mt-2 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs hover:border-accent/60"
                  >
                    <RefreshCw className="size-3.5" /> Regenerate description
                  </button>
                </Labeled>
                <div className="grid grid-cols-2 gap-3">
                  <Labeled label="Category">
                    <select
                      value={finalCategory}
                      onChange={(e) => setFinalCategory(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background/40 px-4 py-2.5 text-sm outline-none focus:border-primary"
                    >
                      {CATEGORIES.filter((c) => c !== "Auto-detect").map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Labeled>
                  <Labeled label="Subcategory">
                    <input
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background/40 px-4 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </Labeled>
                </div>
                <Labeled label="Search tags (comma separated)">
                  <input
                    value={tagText}
                    onChange={(e) => setTagText(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background/40 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tagText
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground"
                        >
                          #{t}
                        </span>
                      ))}
                  </div>
                </Labeled>
              </div>

              <div className="space-y-4">
                <Labeled label="Craft & style information">
                  <div className="glass-soft space-y-3 rounded-2xl px-4 py-3 text-sm">
                    <EditRow k="Craft" v={craft} onChange={setCraft} />
                    <EditRow k="Material" v={material} onChange={setMaterial} />
                    <Row k="Origin" v={activeArtisan.location} />
                    <Row k="Maker" v={activeArtisan.name} />
                  </div>
                </Labeled>

                <Labeled label="Multilingual listing">
                  <div className="glass-soft rounded-2xl p-4">
                    <div className="flex flex-wrap gap-2">
                      {gen.translations.map((t, i) => (
                        <button
                          key={t.label}
                          onClick={() => setTab(i)}
                          className={`rounded-full px-3 py-1 text-xs transition-colors ${
                            tab === i
                              ? "bg-ember text-primary-foreground"
                              : "bg-secondary/60 text-muted-foreground"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed">{gen.translations[tab]?.text}</p>
                  </div>
                </Labeled>

                <Labeled label="Product story">
                  <textarea
                    value={story}
                    rows={3}
                    onChange={(e) => setStory(e.target.value)}
                    className="font-display w-full rounded-2xl border border-accent/20 bg-accent/6 px-4 py-3 text-base leading-relaxed outline-none focus:border-accent/60"
                  />
                  <button
                    onClick={() => regenerate("Story")}
                    className="mt-2 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs hover:border-accent/60"
                  >
                    <RefreshCw className="size-3.5" /> Regenerate story
                  </button>
                </Labeled>
              </div>
            </div>
          </Panel>

          {/* Image studio */}
          <Panel
            title="AI Image Studio"
            action={
              <div className="flex gap-2">
                <button
                  onClick={resetStudio}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs hover:border-accent/60"
                >
                  <RotateCcw className="size-3.5" /> Reset
                </button>
                <button
                  onClick={() => void saveImage()}
                  className="inline-flex items-center gap-2 rounded-full bg-ember px-4 py-1.5 text-xs font-semibold text-primary-foreground"
                >
                  <Wand2 className="size-3.5" /> Save enhanced image
                </button>
              </div>
            }
          >
            <div className="grid gap-5 md:grid-cols-2">
              <figure className="overflow-hidden rounded-3xl border border-border/60">
                <img src={image} alt="Original photo" className="aspect-square w-full object-cover" />
                <figcaption className="bg-background/60 px-4 py-2.5 text-xs text-muted-foreground">
                  Original photo
                </figcaption>
              </figure>
              <figure className="relative overflow-hidden rounded-3xl border border-primary/40 shadow-[var(--shadow-glow)]">
                <div
                  className={`w-full ${aspect} flex items-center justify-center overflow-hidden`}
                  style={{ background: BG_STYLES.find((b) => b.key === bg)!.css }}
                >
                  <img
                    src={savedImage || image}
                    alt="AI enhanced product photo"
                    className={`h-full w-full transition-all duration-500 ${bg === "none" ? "object-cover" : "scale-[0.82] object-contain"}`}
                    style={{ filter: savedImage ? "none" : filterCss }}
                  />
                </div>
                <span className="absolute top-3 left-3 rounded-full bg-ember px-3 py-1 text-[0.62rem] font-semibold tracking-widest text-primary-foreground uppercase">
                  {savedImage ? "Saved" : "Preview"}
                </span>
                <figcaption className="bg-background/60 px-4 py-2.5 text-xs text-muted-foreground">
                  Marketplace-ready · {crop} crop
                </figcaption>
              </figure>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-3">
              <Labeled label={`Brightness · ${brightness.toFixed(2)}`}>
                <input type="range" min={0.6} max={1.6} step={0.02} value={brightness}
                  onChange={(e) => { setBrightness(Number(e.target.value)); setSavedImage(""); }}
                  className="w-full accent-[oklch(0.63_0.155_42)]" />
              </Labeled>
              <Labeled label={`Saturation · ${saturation.toFixed(2)}`}>
                <input type="range" min={0.5} max={1.8} step={0.02} value={saturation}
                  onChange={(e) => { setSaturation(Number(e.target.value)); setSavedImage(""); }}
                  className="w-full accent-[oklch(0.63_0.155_42)]" />
              </Labeled>
              <Labeled label={`Contrast · ${contrast.toFixed(2)}`}>
                <input type="range" min={0.6} max={1.7} step={0.02} value={contrast}
                  onChange={(e) => { setContrast(Number(e.target.value)); setSavedImage(""); }}
                  className="w-full accent-[oklch(0.63_0.155_42)]" />
              </Labeled>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Labeled label="Crop">
                <div className="flex gap-2">
                  {(["1:1", "4:5", "original"] as CropKey[]).map((c) => (
                    <button key={c} onClick={() => { setCrop(c); setSavedImage(""); }}
                      className={`rounded-full px-3.5 py-1.5 text-xs transition-colors ${crop === c ? "bg-ember text-primary-foreground" : "border border-border bg-secondary/40 text-muted-foreground"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </Labeled>
              <Labeled label="Background style">
                <div className="flex flex-wrap gap-2">
                  {BG_STYLES.map((b) => (
                    <button key={b.key} onClick={() => { setBg(b.key); setSavedImage(""); }}
                      className={`rounded-full px-3.5 py-1.5 text-xs transition-colors ${bg === b.key ? "bg-ember text-primary-foreground" : "border border-border bg-secondary/40 text-muted-foreground"}`}>
                      {b.label}
                    </button>
                  ))}
                </div>
              </Labeled>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-accent/25 bg-accent/8 px-4 py-3">
              <ImageIcon className="mt-0.5 size-4 shrink-0 text-accent" />
              <p className="text-xs text-muted-foreground">
                Adjustments are applied in your browser and baked into the saved image.{" "}
                {savedImage
                  ? "The saved version will be used on your storefront."
                  : "Save the enhanced image to use it on your storefront, or publish with the original."}
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
                  ₹{pricing.suggested.toLocaleString("en-IN")}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Confident range ₹{pricing.min.toLocaleString("en-IN")} – ₹
                  {pricing.max.toLocaleString("en-IN")} · estimated margin {pricing.marginPct}%
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
                      onChange={(e) => {
                        setPrice(Number(e.target.value));
                        setPriceConfirmed(false);
                      }}
                      className="w-full bg-transparent text-lg font-semibold outline-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (price <= 0) return toast.error("Enter a price above zero");
                      setPriceConfirmed(true);
                      toast.success(`Final price confirmed at ₹${price.toLocaleString("en-IN")}`);
                    }}
                    className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-colors ${
                      priceConfirmed
                        ? "bg-success/20 text-success"
                        : "bg-ember text-primary-foreground"
                    }`}
                  >
                    {priceConfirmed ? "Confirmed" : "Confirm"}
                  </button>
                </div>
                <input
                  type="range"
                  min={Math.round(pricing.min * 0.6)}
                  max={Math.round(pricing.max * 1.6)}
                  step={10}
                  value={price}
                  onChange={(e) => {
                    setPrice(Number(e.target.value));
                    setPriceConfirmed(false);
                  }}
                  className="mt-4 w-full accent-[oklch(0.63_0.155_42)]"
                />
                <p className="mt-3 text-xs text-muted-foreground">
                  {price < pricing.min
                    ? "Below the confident range — you may be underselling your hours."
                    : price > pricing.max
                      ? "Above the confident range — expect slower conversion, higher margin."
                      : "Inside the confident range. Good balance of margin and conversion."}
                </p>
              </div>

              <div>
                <p className="text-xs tracking-widest text-muted-foreground uppercase">
                  Why this price?
                </p>
                <ul className="mt-4 space-y-3">
                  {pricing.breakdown.map((b) => (
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
                          style={{
                            width: `${Math.min(100, (b.value / pricing.suggested) * 100)}%`,
                          }}
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
              disabled={publishing}
              className="inline-flex items-center gap-2 rounded-full bg-ember px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {publishing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Rocket className="size-4" />
              )}
              {publishing ? "Publishing…" : "Publish to my store"}
            </button>
            <button
              onClick={() => setStage("input")}
              className="rounded-full border border-border px-6 py-3.5 text-sm font-semibold transition-colors hover:border-accent/60"
            >
              Back to inputs
            </button>
            {audioUrl && (
              <a
                href={audioUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold transition-colors hover:border-accent/60"
              >
                <Play className="size-4" /> Play voice note
              </a>
            )}
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

function EditRow({ k, v, onChange }: { k: string; v: string; onChange: (s: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="shrink-0 text-muted-foreground">{k}</span>
      <input
        value={v}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-transparent bg-background/40 px-3 py-1.5 text-right text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
