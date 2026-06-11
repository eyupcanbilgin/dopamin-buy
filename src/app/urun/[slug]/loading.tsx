import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <main className="container py-8">
      <Skeleton className="mb-5 h-10 w-36" />
      <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="grid gap-3 lg:grid-cols-[88px_1fr]">
          <div className="order-2 flex gap-2 lg:order-1 lg:grid">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-20 shrink-0 rounded-md" />
            ))}
          </div>
          <Skeleton className="order-1 aspect-[4/3] rounded-lg lg:order-2" />
        </div>
        <article className="space-y-5">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-28" />
          </div>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-24 w-full" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-28 rounded-lg" />
            <Skeleton className="h-28 rounded-lg" />
          </div>
          <Skeleton className="h-12 w-full" />
        </article>
      </section>
    </main>
  );
}
