import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="container py-8">
      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <Skeleton className="h-[420px] rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    </main>
  );
}
