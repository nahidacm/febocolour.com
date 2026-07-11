export function FormField({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  error,
  placeholder,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
  error?: string;
  placeholder?: string;
  step?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-foreground/80">
        {label}
        {required ? <span className="text-brand-600"> *</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        step={step}
        className="mt-1.5 w-full rounded-brand-md border border-brand-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400"
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export function FormTextarea({
  label,
  name,
  defaultValue,
  rows = 3,
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-foreground/80">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className="mt-1.5 w-full rounded-brand-md border border-brand-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400"
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export function FormSelect({
  label,
  name,
  defaultValue,
  options,
  required,
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-foreground/80">
        {label}
        {required ? <span className="text-brand-600"> *</span> : null}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="mt-1.5 w-full rounded-brand-md border border-brand-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-400"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export function FormCheckbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-foreground/80">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-brand-600"
      />
      {label}
    </label>
  );
}
