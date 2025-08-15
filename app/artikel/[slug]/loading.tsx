export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="animate-pulse space-y-3 max-w-3xl">
        <div className="h-8 w-3/4 bg-muted rounded" />
        <div className="h-4 w-1/3 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-5/6 bg-muted rounded" />
        <div className="h-4 w-4/6 bg-muted rounded" />
      </div>
    </div>
  );
}
