import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <main className="container py-8">
      <Skeleton className="mb-5 h-10 w-36" />
      <section className="mb-8 overflow-hidden rounded-lg border bg-card p-6 shadow-soft sm:p-8">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="mt-4 h-12 w-72 max-w-full" />
        <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:max-w-md">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>
      </section>
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Skeleton className="hidden h-[520px] rounded-lg lg:block" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton key={index} className="h-[360px] rounded-lg" />
          ))}
        </div>
      </div>
    </main>
  );
}
