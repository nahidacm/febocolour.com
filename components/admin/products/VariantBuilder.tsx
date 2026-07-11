"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { saveProductVariantsAction } from "@/lib/actions/admin/products";
import type { VariantRowInput } from "@/lib/services/admin/products";

type AttributeValue = { id: number; value: string; slug: string };
type Attribute = { id: number; name: string; inputType: string; values: AttributeValue[] };
type VariantRow = VariantRowInput & { key: string };

function comboKey(valueIds: number[]) {
  return [...valueIds].sort((a, b) => a - b).join("-");
}

function cartesian<T>(groups: T[][]): T[][] {
  return groups.reduce<T[][]>(
    (acc, group) => acc.flatMap((combo) => group.map((item) => [...combo, item])),
    [[]],
  );
}

export function VariantBuilder({
  productId,
  productSku,
  allAttributes,
  initialSelectedAttributeIds,
  initialVariants,
}: {
  productId: number;
  productSku: string;
  allAttributes: Attribute[];
  initialSelectedAttributeIds: number[];
  initialVariants: VariantRowInput[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const [selectedAttrIds, setSelectedAttrIds] = useState<Set<number>>(
    new Set(initialSelectedAttributeIds),
  );
  const initialValueIds = new Set(initialVariants.flatMap((v) => v.valueIds));
  const [selectedValueIds, setSelectedValueIds] = useState<Set<number>>(initialValueIds);
  const [rows, setRows] = useState<VariantRow[]>(
    initialVariants.map((v) => ({ ...v, key: comboKey(v.valueIds) })),
  );

  const valueLookup = useMemo(() => {
    const map = new Map<number, AttributeValue>();
    for (const attr of allAttributes) for (const v of attr.values) map.set(v.id, v);
    return map;
  }, [allAttributes]);

  function toggleAttribute(attributeId: number) {
    setSelectedAttrIds((prev) => {
      const next = new Set(prev);
      if (next.has(attributeId)) {
        next.delete(attributeId);
        const attr = allAttributes.find((a) => a.id === attributeId);
        if (attr) {
          setSelectedValueIds((prevValues) => {
            const nextValues = new Set(prevValues);
            for (const v of attr.values) nextValues.delete(v.id);
            return nextValues;
          });
        }
      } else {
        next.add(attributeId);
      }
      return next;
    });
  }

  function toggleValue(valueId: number) {
    setSelectedValueIds((prev) => {
      const next = new Set(prev);
      if (next.has(valueId)) next.delete(valueId);
      else next.add(valueId);
      return next;
    });
  }

  function regenerateVariants() {
    const orderedAttrs = allAttributes.filter((a) => selectedAttrIds.has(a.id));
    const valueGroups = orderedAttrs
      .map((attr) => attr.values.filter((v) => selectedValueIds.has(v.id)))
      .filter((group) => group.length > 0);

    if (valueGroups.length === 0 || valueGroups.length !== orderedAttrs.length) {
      setRows([]);
      return;
    }

    const combos = cartesian(valueGroups);
    const existingByKey = new Map(rows.map((r) => [r.key, r]));

    const nextRows: VariantRow[] = combos.map((combo) => {
      const valueIds = combo.map((v) => v.id);
      const key = comboKey(valueIds);
      const existing = existingByKey.get(key);
      if (existing) return existing;

      const suffix = combo.map((v) => v.slug).join("-").toUpperCase();
      return {
        key,
        valueIds,
        sku: `${productSku}-${suffix}`,
        priceOverride: null,
        stockQuantity: 0,
        stockStatus: "in_stock",
      };
    });

    setRows(nextRows);
  }

  function updateRow(key: string, patch: Partial<VariantRow>) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function saveVariants() {
    startTransition(async () => {
      await saveProductVariantsAction({
        productId,
        attributeIds: allAttributes.filter((a) => selectedAttrIds.has(a.id)).map((a) => a.id),
        variants: rows.map((row) => ({
          sku: row.sku,
          priceOverride: row.priceOverride,
          stockQuantity: row.stockQuantity,
          stockStatus: row.stockStatus,
          valueIds: row.valueIds,
        })),
      });
      setSavedAt(Date.now());
      router.refresh();
    });
  }

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-foreground">Variants</h2>
      <p className="mt-1 text-sm text-foreground/60">
        Pick which attributes and values apply to this product, then generate variant rows.
      </p>

      <div className="mt-4 space-y-4">
        {allAttributes.map((attr) => (
          <div key={attr.id}>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
              <input
                type="checkbox"
                checked={selectedAttrIds.has(attr.id)}
                onChange={() => toggleAttribute(attr.id)}
                className="h-4 w-4 accent-brand-600"
              />
              {attr.name}
            </label>
            {selectedAttrIds.has(attr.id) ? (
              <div className="mt-2 ml-6 flex flex-wrap gap-2">
                {attr.values.map((value) => (
                  <label
                    key={value.id}
                    className={cn(
                      "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      selectedValueIds.has(value.id)
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-brand-200 bg-white text-foreground/70",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selectedValueIds.has(value.id)}
                      onChange={() => toggleValue(value.id)}
                      className="sr-only"
                    />
                    {value.value}
                  </label>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={regenerateVariants}
        className="mt-4 rounded-brand-md border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
      >
        Generate Variant Combinations
      </button>

      {rows.length > 0 ? (
        <div className="mt-4 overflow-x-auto rounded-brand-lg border border-brand-100">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-100 text-xs text-foreground/60">
                <th className="px-3 py-2">Combination</th>
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Price Override</th>
                <th className="px-3 py-2">Stock Qty</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key} className="border-b border-brand-50">
                  <td className="px-3 py-2 text-foreground/80">
                    {row.valueIds.map((id) => valueLookup.get(id)?.value).join(" / ")}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      value={row.sku}
                      onChange={(e) => updateRow(row.key, { sku: e.target.value })}
                      className="w-36 rounded-brand-sm border border-brand-200 px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={row.priceOverride ?? ""}
                      placeholder="—"
                      onChange={(e) =>
                        updateRow(row.key, {
                          priceOverride: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      className="w-24 rounded-brand-sm border border-brand-200 px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.stockQuantity}
                      onChange={(e) => updateRow(row.key, { stockQuantity: Number(e.target.value) })}
                      className="w-20 rounded-brand-sm border border-brand-200 px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={row.stockStatus}
                      onChange={(e) =>
                        updateRow(row.key, { stockStatus: e.target.value as VariantRow["stockStatus"] })
                      }
                      className="rounded-brand-sm border border-brand-200 bg-white px-2 py-1 text-xs"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                      <option value="backorder">Backorder</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={saveVariants}
          disabled={isPending}
          className="rounded-brand-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save Variants"}
        </button>
        {savedAt ? <span className="text-sm text-green-700">Saved</span> : null}
      </div>
    </div>
  );
}
