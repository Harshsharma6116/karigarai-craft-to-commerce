import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Hammer, ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AIOrb } from "@/components/ai-orb";
import { Logo, SectionLabel } from "@/components/brand";
import { demoAccounts } from "@/lib/data";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { role: Role } => ({
    role: search.role === "buyer" ? "buyer" : "artisan",
  }),
  head: () => ({
    meta: [
      { title: "Sign in — KarigarAI" },
      {
        name: "description",
        content:
          "Sign in to KarigarAI as an artisan to build your AI storefront, or as a buyer to discover handmade Indian craft.",
      },
      { property: "og:title", content: "Sign in — KarigarAI" },
      {
        property: "og:description",
        content: "Separate artisan and buyer experiences, with demo accounts ready to explore.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { role } = Route.useSearch();
  const navigate = useNavigate();
  const { signIn } = useStore();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const isArtisan = role === "artisan";
  const demo = demoAccounts.find((d) => d.role === role)!;

  const setRole = (next: Role) => navigate({ to: "/auth", search: { role: next } });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName =
      mode === "signup" && name ? name : isArtisan ? "Meera Devi" : "Ananya Rao";
    signIn({
      role,
      name: displayName,
      email: email || demo.email,
      artisanId: isArtisan ? "a1" : undefined,
    });
    toast.success(`Welcome${isArtisan ? " back" : ""}, ${displayName.split(" ")[0]}!`);
    navigate({ to: isArtisan ? "/artisan" : "/explore" });
  };

  const useDemo = () => {
    setEmail(demo.email);
    setPassword(demo.password);
    signIn({
      role,
      name: isArtisan ? "Meera Devi" : "Ananya Rao",
      email: demo.email,
      artisanId: isArtisan ? "a1" : undefined,
    });
    toast.success("Signed in with the demo account");
    navigate({ to: isArtisan ? "/artisan" : "/explore" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Narrative side */}
      <aside className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        <Logo />
        <div>
          <AIOrb size={230} />
          <SectionLabel>{isArtisan ? "Artisan experience" : "Buyer experience"}</SectionLabel>
          <h1 className="font-display mt-6 max-w-md text-5xl leading-tight font-semibold">
            {isArtisan ? (
              <>
                Your hands make it. <span className="text-ember">AI sells it.</span>
              </>
            ) : (
              <>
                Buy the object. <span className="text-ember">Meet the maker.</span>
              </>
            )}
          </h1>
          <p className="mt-5 max-w-md text-muted-foreground">
            {isArtisan
              ? "Photograph a piece, speak about it in your language, and your listing, price, story and storefront are ready before your chai gets cold."
              : "Every product on KarigarAI carries its craft, its cluster and the voice of the person who made it."}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          From Craft to Commerce, Powered by AI.
        </p>
      </aside>

      {/* Form side */}
      <main className="flex items-center justify-center px-5 py-14">
        <div className="glass w-full max-w-md rounded-[2rem] p-8">
          <div className="lg:hidden">
            <Logo />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-secondary/50 p-1.5 lg:mt-0">
            {(
              [
                { key: "artisan", label: "Artisan", icon: Hammer },
                { key: "buyer", label: "Buyer", icon: ShoppingBag },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                onClick={() => setRole(t.key)}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  role === t.key
                    ? "bg-ember text-primary-foreground shadow-[var(--shadow-glow)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="size-4" />
                {t.label}
              </button>
            ))}
          </div>

          <h2 className="font-display mt-8 text-3xl font-semibold">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isArtisan
              ? "Continue building your craft business."
              : "Discover handmade work directly from its maker."}
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            {mode === "signup" && (
              <Field
                label="Full name"
                value={name}
                onChange={setName}
                placeholder={isArtisan ? "Meera Devi" : "Ananya Rao"}
              />
            )}
            <Field
              label="Email or phone"
              value={email}
              onChange={setEmail}
              placeholder={demo.email}
            />
            <Field
              label="Password"
              value={password}
              onChange={setPassword}
              type="password"
              placeholder="••••••••"
            />
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-ember px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
            >
              {mode === "signin" ? "Sign in" : "Create account"}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <button
            onClick={useDemo}
            className="mt-4 flex w-full items-center justify-between gap-3 rounded-2xl border border-accent/25 bg-accent/8 px-4 py-3 text-left transition-colors hover:border-accent/60"
          >
            <span className="flex items-center gap-3">
              <Sparkles className="size-4 shrink-0 text-accent" />
              <span>
                <span className="block text-sm font-medium">Use demo account</span>
                <span className="block text-xs text-muted-foreground">{demo.label}</span>
              </span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-accent" />
          </button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New to KarigarAI?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-medium text-accent hover:underline"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Back to home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium tracking-wide text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-input bg-background/40 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
      />
    </label>
  );
}
