"use client";

import { cn } from "@/lib/cn";

export type ShippingMethodOption = {
  code: string;
  name: string;
  description: string | null;
  rateType: string;
  flatRate: string | null;
};

function formatTaka(amount: number) {
  return amount === 0 ? "Free" : `৳${amount.toLocaleString("en-US")}`;
}

export function ShippingMethodSelect({
  methods,
  selected,
  onChange,
}: {
  methods: ShippingMethodOption[];
  selected: string;
  onChange: (code: string) => void;
}) {
  return (
    <div className="space-y-2">
      {methods.map((method) => {
        const rate = method.rateType === "free" ? 0 : Number(method.flatRate ?? 0);
        const isSelected = selected === method.code;
        return (
          <label
            key={method.code}
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-brand-md border px-4 py-3 text-sm transition-colors",
              isSelected ? "border-brand-500 bg-brand-50" : "border-brand-200 bg-white hover:bg-brand-50/50",
            )}
          >
            <span className="flex items-center gap-3">
              <input
                type="radio"
                name="shippingMethodCode"
                value={method.code}
                checked={isSelected}
                onChange={() => onChange(method.code)}
                className="accent-brand-600"
              />
              <span>
                <span className="block font-medium text-foreground/90">{method.name}</span>
                {method.description ? (
                  <span className="block text-xs text-foreground/60">{method.description}</span>
                ) : null}
              </span>
            </span>
            <span className="font-semibold text-brand-700">{formatTaka(rate)}</span>
          </label>
        );
      })}
    </div>
  );
}
