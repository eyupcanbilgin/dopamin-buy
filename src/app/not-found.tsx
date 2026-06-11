import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container flex min-h-[70vh] items-center justify-center py-12">
      <section className="max-w-xl rounded-lg border bg-card p-6 text-center shadow-soft sm:p-8">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <SearchX className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-navy">Bu sayfa bulunamadı</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Aradığın sanal ürün veya kategori artık vitrinde olmayabilir. Yeni bir simülasyon
          sepeti oluşturmak için mağazaya dönebilirsin.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/shop">Sanal mağazaya dön</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Doply ana sayfa</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
