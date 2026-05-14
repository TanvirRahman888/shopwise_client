"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Product, ProductsResponse } from "@/types/product";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(
          `${API_BASE_URL}/products?limit=4&sort=rating`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: ProductsResponse = await res.json();

        if (isMounted) {
          setProducts(data.products || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-white py-20 dark:bg-slate-950">
      <Container>
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
              Trending Picks
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl dark:text-white">
              Featured Products
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              Explore popular products with multiple variants, smart pricing, image swap previews, and clean product cards.
            </p>
          </div>

          <Button asChild variant="outline" className="rounded-full">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
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
        )}

        {!isLoading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <p className="font-bold">Failed to load products.</p>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="rounded-3xl border border-slate-200 p-8 text-center text-slate-600 dark:border-slate-800 dark:text-slate-400">
            No products found.
          </div>
        )}
      </Container>
    </section>
  );
}