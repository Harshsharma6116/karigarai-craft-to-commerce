import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, Pencil, Sparkles, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/studio";
import { inr, useStore } from "@/lib/store";

export const Route = createFileRoute("/artisan/products")({
  component: MyProducts,
});

function MyProducts() {
  const { products, activeArtisan, updateProduct, removeProduct } = useStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [draftPrice, setDraftPrice] = useState(0);

  const mine = products.filter((p) => p.artisanId === activeArtisan.id);

  const save = (id: string) => {
    updateProduct(id, { price: draftPrice });
    setEditing(null);
    toast.success("Price updated on your storefront");
  };

  return (
    <>
      <PageHeader
        label="My products"
        title={
          <>
            {mine.length} pieces <span className="text-ember">live</span>
          </>
        }
        subtitle="Everything published to your digital storefront. Prices update instantly for buyers."
        action={
          <Link
            to="/artisan/create"
            className="inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            <Sparkles className="size-4" /> New product
          </Link>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mine.map((p) => (
          <article key={p.id} className="lift glass overflow-hidden rounded-3xl">
            <div className="relative">
              <img
                src={p.image}
                alt={p.title}
                width={800}
                height={800}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
              <span className="glass-soft absolute top-3 left-3 rounded-full px-3 py-1 text-[0.62rem] tracking-widest text-accent uppercase">
                {p.subcategory}
              </span>
            </div>
            <div className="p-5">
              <h2 className="text-sm font-semibold">{p.title}</h2>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="size-3.5" /> {p.views.toLocaleString("en-IN")}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="size-3.5 fill-accent text-accent" /> {p.rating}
                </span>
                <span>{p.sold} sold</span>
              </div>

              {editing === p.id ? (
                <div className="mt-4 flex gap-2">
                  <input
                    type="number"
                    value={draftPrice}
                    onChange={(e) => setDraftPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-background/40 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <button
                    onClick={() => save(p.id)}
                    className="rounded-xl bg-ember px-4 text-xs font-semibold text-primary-foreground"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-lg font-semibold text-ember">
                    {inr(p.price)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(p.id);
                        setDraftPrice(p.price);
                      }}
                      className="grid size-9 place-items-center rounded-xl border border-border transition-colors hover:border-accent/60"
                      aria-label="Edit price"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        removeProduct(p.id);
                        toast.success("Product removed");
                      }}
                      className="grid size-9 place-items-center rounded-xl border border-border transition-colors hover:border-destructive/60"
                      aria-label="Remove product"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <Link
                to="/product/$productId"
                params={{ productId: p.id }}
                className="mt-4 inline-flex text-xs font-semibold text-accent hover:underline"
              >
                View public listing →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {mine.length === 0 && (
        <Panel className="text-center">
          <p className="text-muted-foreground">
            No products yet. Snap a photo and let the AI build your first listing.
          </p>
        </Panel>
      )}
    </>
  );
}
