import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <main className="container py-8">
      <div className="mb-6 grid gap-3 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-11 rounded-lg" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-lg border bg-card p-5 shadow-card">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-3 h-5 w-full max-w-xl" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-lg" />
            ))}
          </div>
        </section>
        <aside className="rounded-lg border bg-card p-5 shadow-card">
          <Skeleton className="h-7 w-40" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-5 w-full" />
            ))}
          </div>
          <Skeleton className="mt-6 h-11 w-full" />
        </aside>
      </div>
    </main>
  );
}
