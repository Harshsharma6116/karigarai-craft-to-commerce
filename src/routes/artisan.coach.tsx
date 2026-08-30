import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { AIOrb } from "@/components/ai-orb";
import { PageHeader, Panel } from "@/components/studio";

export const Route = createFileRoute("/artisan/coach")({
  component: Coach,
});

interface Turn {
  id: number;
  from: "coach" | "artisan";
  text: string;
}

const PROMPTS = [
  "Which product is performing best?",
  "Should I change my prices?",
  "What should I make next?",
  "Where are new customers coming from?",
  "How do I sell more during the festive season?",
];

const ANSWERS: { match: RegExp; text: string }[] = [
  {
    match: /best|perform|top/i,
    text: "Your **Banarasi Silk Zari Stole** is your revenue leader: 44 sold at ₹5,400 — about 38% of total earnings from 21% of your views. The **Terracotta Diya Set** is your traffic leader (8,940 views) but converts into only 12% of revenue.\n\nAction: put the stole at the top of your storefront, and use the diyas as the entry product that pulls people in.",
  },
  {
    match: /price|pricing|cost|charge/i,
    text: "Two moves I would make this week:\n\n1. **Blue pottery vase → ₹3,600** (from ₹3,200). Comparable Jaipur pieces sit at ₹3,600–₹4,100 and your 4.9 rating supports the top half of that band.\n2. **Diya set → keep at ₹640**, but add a set-of-twelve at ₹1,150. Buyers who buy diyas buy for a household, not a shelf.\n\nExpected effect: +₹11,000 monthly at current volume, with no additional making time.",
  },
  {
    match: /next|make|design|create|new/i,
    text: "Make a **blue pottery tea set for six**.\n\nWhy: searches for 'handmade Indian tea set' are up 62% this quarter; 3 of your last 9 buyer questions asked whether you make cups; and your cobalt vine motif scales directly onto a cup body — no new mould needed.\n\nSuggested price ₹4,800 · Confidence 87% · Estimated 11 days of work.",
  },
  {
    match: /customer|buyer|traffic|where|market/i,
    text: "34% of your visitors arrive through your **store QR code** — mostly people who met you at a mela and scanned. 28% come from search (mainly 'jaipur blue pottery gift'), 23% from social shares.\n\nAction: print the QR on your packaging slip. Buyers who receive a parcel with a QR return at roughly 3x the rate of buyers who don't.",
  },
  {
    match: /festive|diwali|season|gift/i,
    text: "Festive window opens in six weeks. Prepare now:\n\n• Stock **60 diya sets** — last year you sold out 11 days before Diwali.\n• Add a **gift wrap option** at ₹80; nine buyers have asked about gifting.\n• Launch a **₹2,400 festive bundle** (diya set + small vase). Bundles lifted average order value 46% for similar clusters.",
  },
];

const fallback =
  "Here is what I see across your store right now: strong ratings (4.8 average), rising views (+24% this month) and one clear gap — you have no product between ₹700 and ₹1,900. Buyers who arrive for diyas have nothing to step up to. A mid-priced piece is the single fastest lever you have.";

function Coach() {
  const [turns, setTurns] = useState<Turn[]>([
    {
      id: 0,
      from: "coach",
      text: "Namaste Meera. I have read your last six months of views, questions and orders. Ask me anything — or start with one of the suggestions below.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, thinking]);

  const ask = (text: string) => {
    if (!text.trim()) return;
    setTurns((t) => [...t, { id: Date.now(), from: "artisan", text }]);
    setDraft("");
    setThinking(true);
    window.setTimeout(() => {
      const answer = ANSWERS.find((a) => a.match.test(text))?.text ?? fallback;
      setTurns((t) => [...t, { id: Date.now() + 1, from: "coach", text: answer }]);
      setThinking(false);
    }, 1300);
  };

  return (
    <>
      <PageHeader
        label="AI business coach"
        title={
          <>
            Advice that knows <span className="text-ember">your store</span>
          </>
        }
        subtitle="Grounded in your own views, questions, prices and orders — not generic e-commerce tips."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Panel className="flex flex-col items-center text-center">
          <AIOrb size={160} label="Coach" />
          <p className="mt-8 text-sm text-muted-foreground">
            The coach reads six months of store data every morning and keeps three
            recommendations ready.
          </p>
          <div className="mt-6 w-full space-y-2 text-left">
            {[
              ["Revenue leader", "Banarasi Zari Stole"],
              ["Traffic leader", "Terracotta Diya Set"],
              ["Biggest gap", "No ₹700–₹1,900 product"],
            ].map(([k, v]) => (
              <div key={k} className="glass-soft rounded-2xl px-4 py-3">
                <p className="text-[0.62rem] tracking-widest text-muted-foreground uppercase">
                  {k}
                </p>
                <p className="mt-0.5 text-sm font-medium">{v}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="flex flex-col">
          <div className="scrollbar-thin max-h-[26rem] flex-1 space-y-4 overflow-y-auto pr-1">
            {turns.map((t) => (
              <div
                key={t.id}
                className={`flex ${t.from === "artisan" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    t.from === "artisan" ? "bg-primary/20" : "glass-soft"
                  }`}
                >
                  {t.from === "coach" && (
                    <Sparkles className="mr-2 mb-0.5 inline size-3.5 text-accent" />
                  )}
                  {t.text.split("**").map((chunk, i) =>
                    i % 2 === 1 ? (
                      <strong key={i} className="text-ember">
                        {chunk}
                      </strong>
                    ) : (
                      <span key={i}>{chunk}</span>
                    ),
                  )}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="glass-soft inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-muted-foreground">
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="animate-pulse-glow size-1.5 rounded-full bg-accent"
                      style={{ animationDelay: `${i * 200}ms`, animationDuration: "1s" }}
                    />
                  ))}
                </span>
                Reading your store data…
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => ask(p)}
                className="rounded-full border border-border bg-secondary/40 px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent/60 hover:text-foreground"
              >
                {p}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(draft);
            }}
            className="mt-4 flex gap-3"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask your coach anything about the business…"
              className="flex-1 rounded-full border border-input bg-background/40 px-5 py-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="grid size-12 shrink-0 place-items-center rounded-full bg-ember text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              <Send className="size-4" />
            </button>
          </form>
        </Panel>
      </div>
    </>
  );
}
