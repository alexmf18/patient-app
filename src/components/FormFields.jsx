// Campos de formulario definidos fuera de las páginas: si se definen dentro del
// render, React los remonta en cada tecla y el input pierde el foco.

function FieldShell({ id, label, required, hint, error, children, className = "" }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {required ? (
          <span className="text-ink-3" aria-hidden="true"> *</span>
        ) : (
          <span className="font-normal text-ink-3"> (opcional)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-3">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-warn-ink">
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id, hint, error) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

export function TextField({
  id,
  label,
  required,
  hint,
  error,
  className,
  inputClassName = "",
  ...inputProps
}) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <input
        id={id}
        name={id}
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`field-input ${inputClassName}`}
        {...inputProps}
      />
    </FieldShell>
  );
}

export function TextAreaField({ id, label, required, hint, error, className, ...props }) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        name={id}
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className="field-input resize-y leading-relaxed"
        {...props}
      />
    </FieldShell>
  );
}

/** Grupo de opciones como fichas pulsables (radio): más rápido que un select. */
export function ChoiceField({ id, label, required, error, options, value, onChange, className = "" }) {
  return (
    <fieldset
      className={className}
      aria-invalid={error ? "true" : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <legend className="mb-1.5 text-sm font-semibold text-ink">
        {label}
        {required ? (
          <span className="text-ink-3" aria-hidden="true"> *</span>
        ) : (
          <span className="font-normal text-ink-3"> (opcional)</span>
        )}
      </legend>
      <div className="flex flex-wrap gap-2" id={id}>
        {options.map((option) => {
          const optionValue = typeof option === "string" ? option : option.value;
          const optionLabel = typeof option === "string" ? option : option.label;
          const checked = value === optionValue;
          return (
            <label
              key={optionValue}
              className={`relative inline-flex min-h-11 cursor-pointer items-center rounded-lg border px-3.5 text-sm font-medium transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cap-violet ${
                checked
                  ? "border-violet-deep bg-violet-wash text-violet-ink"
                  : error
                    ? "border-warn-ink bg-label text-ink-2 hover:border-ink-3"
                    : "border-rule-strong bg-label text-ink-2 hover:border-ink-3"
              }`}
            >
              <input
                type="radio"
                name={id}
                value={optionValue}
                checked={checked}
                onChange={(e) => onChange(id, e.target.value)}
                onClick={() => {
                  if (!required && checked) onChange(id, "");
                }}
                className="sr-only"
              />
              {optionLabel}
            </label>
          );
        })}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-warn-ink">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function FormSection({ title, description, children }) {
  return (
    <section className="panel p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-ink-3">{description}</p>}
      </div>
      {children}
    </section>
  );
}
