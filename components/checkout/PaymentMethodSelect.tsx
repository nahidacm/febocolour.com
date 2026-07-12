"use client";

import { cn } from "@/lib/cn";

export type PaymentMethodOption = {
  code: string;
  name: string;
  instructions: string | null;
  requiresManualVerification: boolean;
  accountDetails: Record<string, string> | null;
};

export function PaymentMethodSelect({
  methods,
  selected,
  onChange,
}: {
  methods: PaymentMethodOption[];
  selected: string;
  onChange: (code: string) => void;
}) {
  return (
    <div className="space-y-2">
      {methods.map((method) => {
        const isSelected = selected === method.code;
        return (
          <label
            key={method.code}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-brand-md border px-4 py-3 text-sm transition-colors",
              isSelected ? "border-brand-500 bg-brand-50" : "border-brand-200 bg-white hover:bg-brand-50/50",
            )}
          >
            <input
              type="radio"
              name="paymentMethodCode"
              value={method.code}
              checked={isSelected}
              onChange={() => onChange(method.code)}
              className="mt-0.5 accent-brand-600"
            />
            <span>
              <span className="block font-medium text-foreground/90">{method.name}</span>
              {method.instructions ? (
                <span className="block text-xs text-foreground/60">{method.instructions}</span>
              ) : null}
              {isSelected && method.accountDetails && Object.keys(method.accountDetails).length > 0 ? (
                <span className="mt-2 block rounded-brand-sm bg-white/70 p-2 text-xs text-foreground/80">
                  {Object.entries(method.accountDetails).map(([key, value]) => (
                    <span key={key} className="block">
                      <span className="font-medium">{key}:</span> {value}
                    </span>
                  ))}
                </span>
              ) : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}
