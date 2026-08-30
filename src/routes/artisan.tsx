import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart3,
  BookOpen,
  Boxes,
  Brain,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageSearch,
  Settings,
  Sparkles,
  Store,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/artisan")({
  head: () => ({
    meta: [
      { title: "Artisan Studio — KarigarAI" },
      {
        name: "description",
        content:
          "The KarigarAI artisan studio: dashboard, AI product creation, orders, storefront, analytics and an AI business coach.",
      },
      { property: "og:title", content: "Artisan Studio — KarigarAI" },
      {
        property: "og:description",
        content: "Run a handmade craft business with AI listings, pricing and insights.",
      },
    ],
  }),
  component: ArtisanLayout,
});

const nav = [
  { to: "/artisan", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/artisan/create", label: "Create Product", icon: Sparkles },
  { to: "/artisan/products", label: "My Products", icon: Boxes },
  { to: "/artisan/orders", label: "Orders", icon: PackageSearch },
  { to: "/artisan/store", label: "My Store", icon: Store },
  { to: "/artisan/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/artisan/coach", label: "AI Business Coach", icon: Brain },
  { to: "/artisan/story", label: "My Story", icon: BookOpen },
  { to: "/artisan/settings", label: "Settings", icon: Settings },
] as const;

function ArtisanLayout() {
  const { activeArtisan, signOut } = useStore();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar/85 backdrop-blur-2xl transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo />
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="size-5" />
          </button>
        </div>

        <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all ${
                  active
                    ? "bg-ember font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                }`}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <span className="font-display grid size-10 shrink-0 place-items-center rounded-xl bg-ember text-sm font-semibold text-primary-foreground">
              {activeArtisan.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{activeArtisan.name}</p>
              <p className="truncate text-xs text-muted-foreground">{activeArtisan.craft}</p>
            </div>
          </div>
          <Link
            to="/"
            onClick={signOut}
            className="mt-3 flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="size-3.5" /> Sign out
          </Link>
        </div>
      </aside>

      {open && (
        <button
          aria-label="Close menu overlay"
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Content */}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/50 bg-background/60 px-5 backdrop-blur-xl lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <Logo compact />
          <span className="font-display text-sm tracking-[0.16em] uppercase">Artisan Studio</span>
        </header>
        <main className="animate-rise mx-auto max-w-6xl px-5 py-8 sm:px-8">
          {/* Required: nested artisan routes render here. */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
