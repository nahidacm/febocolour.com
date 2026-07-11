"use client";

import { useMemo, useState, useTransition } from "react";
import { Minus, Plus, MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site-config";
import { useCart } from "@/components/storefront/CartProvider";
import { addToCartAction } from "@/lib/actions/cart";

export type VariantAttribute = {
  id: number;
  name: string;
  inputType: "select" | "color_swatch";
  values: { id: number; value: string; slug: string; swatchHex: string | null }[];
};

export type VariantOption = {
  id: number;
  sku: string;
  priceOverride: number | null;
  stockQuantity: number;
  stockStatus: "in_stock" | "out_of_stock" | "backorder";
  valueIds: number[];
};

function formatTaka(amount: number) {
  return `৳${amount.toLocaleString("en-US")}`;
}

export function ProductVariantSelector({
  productId,
  productName,
  attributes,
  variants,
  basePrice,
  baseSalePrice,
  baseSku,
  baseStockStatus,
}: {
  productId: number;
  productName: string;
  attributes: VariantAttribute[];
  variants: VariantOption[];
  basePrice: number;
  baseSalePrice?: number;
  baseSku: string;
  baseStockStatus: "in_stock" | "out_of_stock" | "backorder";
}) {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [quantity, setQuantity] = useState(1);
  const [addStatus, setAddStatus] = useState<"idle" | "added" | "error">("idle");
  const [isPending, startTransition] = useTransition();
  const { refresh } = useCart();

  const selectedValueIds = useMemo(
    () => Object.values(selected).sort((a, b) => a - b),
    [selected],
  );

  const matchedVariant = useMemo(() => {
    if (attributes.length === 0) return undefined;
    if (selectedValueIds.length !== attributes.length) return undefined;
    return variants.find((variant) => {
      const sortedValueIds = [...variant.valueIds].sort((a, b) => a - b);
      return (
        sortedValueIds.length === selectedValueIds.length &&
        sortedValueIds.every((id, i) => id === selectedValueIds[i])
      );
    });
  }, [attributes.length, selectedValueIds, variants]);

  const needsSelection = attributes.length > 0 && !matchedVariant;
  const price = matchedVariant?.priceOverride ?? baseSalePrice ?? basePrice;
  const compareAtPrice = matchedVariant?.priceOverride
    ? undefined
    : baseSalePrice
      ? basePrice
      : undefined;
  const stockStatus = matchedVariant?.stockStatus ?? (attributes.length === 0 ? baseStockStatus : undefined);
  const sku = matchedVariant?.sku ?? (attributes.length === 0 ? baseSku : undefined);
  const canAddToCart = !needsSelection && stockStatus !== "out_of_stock";

  const variantLabel = attributes
    .map((attr) => {
      const valueId = selected[attr.id];
      const value = attr.values.find((v) => v.id === valueId);
      return value ? `${attr.name}: ${value.value}` : null;
    })
    .filter(Boolean)
    .join(", ");

  const orderMessage = `Hi FeboColour, I'm interested in "${productName}"${
    variantLabel ? ` (${variantLabel})` : ""
  }${sku ? ` — SKU: ${sku}` : ""}.`;
  const whatsappHref = `${siteConfig.whatsappUrl}?text=${encodeURIComponent(orderMessage)}`;

  function handleAddToCart() {
    setAddStatus("idle");
    startTransition(async () => {
      const result = await addToCartAction({
        productId,
        variantId: matchedVariant?.id ?? null,
        quantity,
      });
      if (result.success) {
        setAddStatus("added");
        await refresh();
      } else {
        setAddStatus("error");
      }
    });
  }

  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-semibold text-brand-700">{formatTaka(price)}</span>
        {compareAtPrice ? (
          <span className="text-base text-foreground/65 line-through">
            {formatTaka(compareAtPrice)}
          </span>
        ) : null}
      </div>

      {attributes.map((attribute) => (
        <div key={attribute.id} className="mt-5">
          <p className="text-sm font-medium text-foreground/80">{attribute.name}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {attribute.values.map((value) => {
              const isSelected = selected[attribute.id] === value.id;
              if (attribute.inputType === "color_swatch") {
                return (
                  <button
                    key={value.id}
                    type="button"
                    aria-label={value.value}
                    aria-pressed={isSelected}
                    onClick={() => {
                      setSelected((prev) => ({ ...prev, [attribute.id]: value.id }));
                      setAddStatus("idle");
                    }}
                    className={cn(
                      "h-9 w-9 rounded-full border-2 transition-all",
                      isSelected ? "border-brand-500 ring-2 ring-brand-200" : "border-white shadow-sm",
                    )}
                    style={{ backgroundColor: value.swatchHex ?? undefined }}
                  />
                );
              }
              return (
                <button
                  key={value.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelected((prev) => ({ ...prev, [attribute.id]: value.id }));
                    setAddStatus("idle");
                  }}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    isSelected
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-brand-200 bg-white text-foreground/80 hover:bg-brand-50",
                  )}
                >
                  {value.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-6">
        {needsSelection ? (
          <p className="text-sm text-foreground/60">Select options to see availability.</p>
        ) : stockStatus === "out_of_stock" ? (
          <p className="text-sm font-medium text-red-600">Out of stock</p>
        ) : stockStatus === "backorder" ? (
          <p className="text-sm font-medium text-amber-600">Available on backorder</p>
        ) : (
          <p className="text-sm font-medium text-green-700">In stock, ready to ship</p>
        )}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <div className="flex items-center rounded-brand-md border border-brand-200">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center text-foreground/70 hover:bg-brand-50"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-10 w-10 items-center justify-center text-foreground/70 hover:bg-brand-50"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          type="button"
          disabled={!canAddToCart || isPending}
          onClick={handleAddToCart}
          className="flex-1 rounded-brand-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-200 transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Adding..." : addStatus === "added" ? "Added to Cart ✓" : "Add to Cart"}
        </button>
      </div>
      {addStatus === "error" ? (
        <p className="mt-2 text-sm text-red-600">Sorry, that item couldn&apos;t be added. Please try again.</p>
      ) : null}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-brand-lg bg-[#075E54] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:brightness-110"
        >
          <MessageCircle className="h-4 w-4" />
          Order via WhatsApp
        </a>
        <a
          href={siteConfig.messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-brand-lg border border-brand-200 bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
        >
          Message on Facebook
        </a>
      </div>
    </div>
  );
}
