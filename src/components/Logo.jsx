export default function Logo({ className = "" }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <rect x="9" y="11" width="14" height="19" rx="4" fill="#fff" stroke="var(--color-ink)" strokeWidth="2" />
        <rect x="11.5" y="17" width="9" height="6" rx="1" fill="var(--color-rule)" />
        <rect x="6" y="2" width="20" height="10" rx="3" fill="var(--color-cap-violet)" />
      </svg>
      <span className="text-lg font-bold tracking-tight text-ink">PatientApp</span>
    </span>
  );
}
