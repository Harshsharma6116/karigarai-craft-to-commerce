import { useEffect, useState } from "react";
import { Check, Copy, QrCode, Share2 } from "lucide-react";
import { toast } from "sonner";

/** Shareable store panel with a live QR code for the given app path. */
export function QRPanel({ path, label }: { path: string; label: string }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => setOrigin(window.location.origin), []);
  const url = `${origin}${path}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Store link copied");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy the link");
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: label, url });
        return;
      } catch {
        /* user dismissed */
      }
    }
    void copy();
  };

  return (
    <div className="glass-soft w-full max-w-xs rounded-3xl p-5">
      <div className="flex items-center gap-2 text-[0.66rem] tracking-[0.2em] text-accent uppercase">
        <QrCode className="size-3.5" /> Scan to visit
      </div>
      <div className="mt-4 grid place-items-center rounded-2xl bg-foreground p-3">
        {origin ? (
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&data=${encodeURIComponent(url)}`}
            alt={`QR code for ${label}`}
            width={200}
            height={200}
            loading="lazy"
            className="size-40 rounded-lg"
          />
        ) : (
          <div className="size-40 animate-pulse rounded-lg bg-muted" />
        )}
      </div>
      <p className="mt-3 truncate text-[0.7rem] text-muted-foreground">{url}</p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={share}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ember px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          <Share2 className="size-3.5" /> Share Store
        </button>
        <button
          onClick={copy}
          className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:border-accent/60"
          aria-label="Copy store link"
        >
          {copied ? <Check className="size-4 text-accent" /> : <Copy className="size-4" />}
        </button>
      </div>
    </div>
  );
}
