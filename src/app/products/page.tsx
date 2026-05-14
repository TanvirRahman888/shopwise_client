import { Suspense } from "react";
import { ProductsClient } from "./products-client";
import { PublicLayout } from "@/components/layout/public-layout";
import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsClient />
    </Suspense>
  );
}

function ProductsPageFallback() {
  return (
    <PublicLayout>
      <main className="bg-white dark:bg-slate-950">
        <section className="border-b border-slate-200 bg-linear-to-br from-emerald-50 via-white to-violet-50 py-16 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
          <Container>
            <div className="max-w-3xl">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-5 h-14 w-full max-w-xl" />
              <Skeleton className="mt-5 h-6 w-full max-w-2xl" />
            </div>
          </Container>
        </section>

        <section className="py-10">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
              <div className="rounded-4xl border border-slate-200 p-5 dark:border-slate-800">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="mt-6 h-10 w-full rounded-full" />
                <Skeleton className="mt-5 h-10 w-full rounded-full" />
                <Skeleton className="mt-5 h-10 w-full rounded-full" />
              </div>

              <div>
                <Skeleton className="mb-6 h-20 rounded-4xl" />

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800"
                    >
                      <Skeleton className="aspect-square rounded-2xl" />
                      <Skeleton className="mt-4 h-5 w-3/4" />
                      <Skeleton className="mt-3 h-4 w-full" />
                      <Skeleton className="mt-2 h-4 w-2/3" />
                      <Skeleton className="mt-5 h-10 w-full rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </PublicLayout>
  );
}