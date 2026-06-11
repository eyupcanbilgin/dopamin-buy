import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <main className="container py-8">
      <Skeleton className="h-6 w-44" />
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <section className="mt-8 rounded-lg border bg-card p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="mt-5 h-12 w-full" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>
      </section>
    </main>
  );
}
