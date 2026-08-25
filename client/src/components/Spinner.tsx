export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/15 border-t-signal" />
      {label && <p className="eyebrow">{label}</p>}
    </div>
  );
}
