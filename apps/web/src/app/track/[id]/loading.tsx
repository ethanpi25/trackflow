export default function TrackLoading() {
  return (
    <div className="min-h-[60vh] bg-surface">
      <div className="border-b border-border-default bg-surface-raised">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-4">
          <div className="h-8 w-16 animate-shimmer rounded-md bg-border-subtle" />
          <div className="h-10 flex-1 animate-shimmer rounded-lg bg-border-subtle" />
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="flex flex-col items-center gap-4 py-20 animate-fade-in">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          <p className="text-sm text-text-tertiary">Loading...</p>
        </div>
      </div>
    </div>
  );
}
