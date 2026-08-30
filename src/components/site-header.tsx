import { Link } from "@tanstack/react-router";
import { Logo } from "./brand";
import { useStore } from "@/lib/store";

const links = [
  { to: "/explore", label: "Explore Artisans" },
  { to: "/artisan", label: "Artisan Studio" },
];

export function SiteHeader() {
  const { user } = useStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary/60" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Link
              to={user.role === "artisan" ? "/artisan" : "/explore"}
              className="rounded-full bg-ember px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              {user.name.split(" ")[0]}'s space
            </Link>
          ) : (
            <>
              <Link
                to="/auth"
                search={{ role: "buyer" }}
                className="hidden rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                to="/auth"
                search={{ role: "artisan" }}
                className="rounded-full bg-ember px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Start Creating
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-5 text-center">
        <Logo />
        <p className="text-sm text-muted-foreground">
          From Craft to Commerce, Powered by AI. Built for the hands that build India.
        </p>
      </div>
    </footer>
  );
}
