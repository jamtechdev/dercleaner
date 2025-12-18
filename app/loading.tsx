export default function Loading() {
  return (
    <div className="min-h-[60svh] w-full bg-white grid place-items-center px-6">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
        <p className="text-sm font-semibold text-brand">Loading…</p>
      </div>
    </div>
  );
}
