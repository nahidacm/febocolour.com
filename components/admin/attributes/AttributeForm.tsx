"use client";

import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
import { FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import {
  saveAttributeAction,
  type AttributeFormState,
} from "@/lib/actions/admin/attributes";

const initialState: AttributeFormState = {};

type ValueRow = { value: string; slug: string; swatchHex: string };

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function AttributeForm({
  attribute,
}: {
  attribute?: {
    id: number;
    name: string;
    slug: string;
    inputType: "select" | "color_swatch";
    values: { value: string; slug: string; swatchHex: string | null }[];
  };
}) {
  const [state, formAction] = useActionState(saveAttributeAction, initialState);
  const [inputType, setInputType] = useState(attribute?.inputType ?? "select");
  const [rows, setRows] = useState<ValueRow[]>(
    attribute?.values.map((v) => ({
      value: v.value,
      slug: v.slug,
      swatchHex: v.swatchHex ?? "",
    })) ?? [],
  );

  function addRow() {
    setRows((prev) => [...prev, { value: "", slug: "", swatchHex: "" }]);
  }

  function updateRow(index: number, patch: Partial<ValueRow>) {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    );
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {attribute ? (
        <input type="hidden" name="id" value={attribute.id} />
      ) : null}
      <input type="hidden" name="valuesJson" value={JSON.stringify(rows)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Name"
          name="name"
          defaultValue={attribute?.name}
          required
          error={state.fieldErrors?.name}
        />
        <FormField
          label="Slug"
          name="slug"
          defaultValue={attribute?.slug}
          required
          error={state.fieldErrors?.slug}
        />
      </div>

      <div>
        <label
          htmlFor="inputType"
          className="text-sm font-medium text-foreground/80"
        >
          Input Type
        </label>
        <select
          id="inputType"
          name="inputType"
          value={inputType}
          onChange={(e) =>
            setInputType(e.target.value as "select" | "color_swatch")
          }
          className="mt-1.5 w-full rounded-brand-md border border-brand-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-400"
        >
          <option value="select">Select (text pills)</option>
          <option value="color_swatch">Color Swatch</option>
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground/80">Values</p>
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Value
          </button>
        </div>

        <div className="mt-2 space-y-2">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={row.value}
                onChange={(e) =>
                  updateRow(i, {
                    value: e.target.value,
                    slug: row.slug || slugify(e.target.value),
                  })
                }
                placeholder="Value (e.g. Baby Pink)"
                className="flex-1 rounded-brand-sm border border-brand-200 px-2.5 py-1.5 text-sm"
              />
              <input
                value={row.slug}
                onChange={(e) => updateRow(i, { slug: e.target.value })}
                placeholder="slug"
                className="w-32 rounded-brand-sm border border-brand-200 px-2.5 py-1.5 text-sm"
              />
              {inputType === "color_swatch" ? (
                <input
                  type="color"
                  value={row.swatchHex || "#ec377f"}
                  onChange={(e) => updateRow(i, { swatchHex: e.target.value })}
                  className="h-9 w-10 rounded-brand-sm border border-brand-200"
                />
              ) : null}
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="text-foreground/70 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}
      <SubmitButton>
        {attribute ? "Save Changes" : "Create Attribute"}
      </SubmitButton>
    </form>
  );
}
