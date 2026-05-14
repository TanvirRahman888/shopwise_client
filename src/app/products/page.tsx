"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";

import { PublicLayout } from "@/components/layout/public-layout";
import { Container } from "@/components/shared/container";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Product, ProductsResponse } from "@/types/product";
import { CategoriesResponse, Category } from "@/types/category";
import { useDebounce } from "@/lib/hooks/use-debounce";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Rating: High to Low", value: "rating" },
  { label: "Best Selling", value: "best-selling" },
];

const ratingOptions = [
  { label: "All Ratings", value: "" },
  { label: "4 stars & up", value: "4" },
  { label: "4.5 stars & up", value: "4.5" },
  { label: "5 stars", value: "5" },
];

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 500);

  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [rating, setRating] = useState(searchParams.get("rating") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [error, setError] = useState("");

  const limit = 8;

  const apiQueryString = useMemo(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category) params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (rating) params.set("rating", rating);
    if (sort) params.set("sort", sort);

    params.set("page", String(page));
    params.set("limit", String(limit));

    return params.toString();
  }, [debouncedSearch, category, minPrice, maxPrice, rating, sort, page]);

  const browserQueryString = useMemo(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category) params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (rating) params.set("rating", rating);
    if (sort && sort !== "newest") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));

    return params.toString();
  }, [debouncedSearch, category, minPrice, maxPrice, rating, sort, page]);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlCategory = searchParams.get("category") || "";
    const urlMinPrice = searchParams.get("minPrice") || "";
    const urlMaxPrice = searchParams.get("maxPrice") || "";
    const urlRating = searchParams.get("rating") || "";
    const urlSort = searchParams.get("sort") || "newest";
    const urlPage = Number(searchParams.get("page")) || 1;

    setSearch(urlSearch);
    setCategory(urlCategory);
    setMinPrice(urlMinPrice);
    setMaxPrice(urlMaxPrice);
    setRating(urlRating);
    setSort(urlSort);
    setPage(urlPage);
  }, [searchParams]);

  useEffect(() => {
    const nextUrl = browserQueryString
      ? `/products?${browserQueryString}`
      : "/products";

    router.replace(nextUrl, { scroll: false });
  }, [browserQueryString, router]);

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        setIsCategoriesLoading(true);

        const res = await fetch(`${API_BASE_URL}/categories`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data: CategoriesResponse = await res.json();

        const activeCategories = (data.categories || []).filter(
          (item) => item.isActive
        );

        if (isMounted) {
          setCategories(activeCategories);
        }
      } catch {
        if (isMounted) {
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setIsCategoriesLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsProductsLoading(true);
        setError("");

        const res = await fetch(`${API_BASE_URL}/products?${apiQueryString}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: ProductsResponse = await res.json();

        if (isMounted) {
          setProducts(data.products || []);
          setTotalPages(data.pagination?.totalPages || 1);
          setTotalProducts(data.pagination?.total || 0);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Something went wrong");
          setProducts([]);
          setTotalPages(1);
          setTotalProducts(0);
        }
      } finally {
        if (isMounted) {
          setIsProductsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [apiQueryString]);

  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const updateCategory = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const updateMinPrice = (value: string) => {
    setMinPrice(value);
    setPage(1);
  };

  const updateMaxPrice = (value: string) => {
    setMaxPrice(value);
    setPage(1);
  };

  const updateRating = (value: string) => {
    setRating(value);
    setPage(1);
  };

  const updateSort = (value: string) => {
    setSort(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setRating("");
    setSort("newest");
    setPage(1);
    router.replace("/products", { scroll: false });
  };

  const hasActiveFilters =
    search || category || minPrice || maxPrice || rating || sort !== "newest";

  return (
    <PublicLayout>
      <main className="bg-white dark:bg-slate-950">
        <section className="border-b border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-violet-50 py-16 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
          <Container>
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
                Shop Products
              </p>

              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-6xl dark:text-white">
                Explore Products
              </h1>

              <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Search, filter, sort, and discover products with variants,
                offers, and smart shopping options.
              </p>
            </div>
          </Container>
        </section>

        <section className="py-10">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
              <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-emerald-600" />
                    <h2 className="font-black text-slate-950 dark:text-white">
                      Filters
                    </h2>
                  </div>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs font-bold text-rose-500 hover:text-rose-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      Search
                    </label>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <Input
                        value={search}
                        onChange={(event) => updateSearch(event.target.value)}
                        placeholder="Search products..."
                        className="rounded-full pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      Category
                    </label>

                    <select
                      value={category}
                      onChange={(event) => updateCategory(event.target.value)}
                      className="h-10 w-full rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    >
                      <option value="">All Categories</option>

                      {isCategoriesLoading && (
                        <option disabled>Loading categories...</option>
                      )}

                      {!isCategoriesLoading &&
                        categories.map((item) => (
                          <option key={item._id} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      Price Range
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="number"
                        value={minPrice}
                        onChange={(event) =>
                          updateMinPrice(event.target.value)
                        }
                        placeholder="Min"
                        className="rounded-full"
                      />

                      <Input
                        type="number"
                        value={maxPrice}
                        onChange={(event) =>
                          updateMaxPrice(event.target.value)
                        }
                        placeholder="Max"
                        className="rounded-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      Rating
                    </label>

                    <select
                      value={rating}
                      onChange={(event) => updateRating(event.target.value)}
                      className="h-10 w-full rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    >
                      {ratingOptions.map((option) => (
                        <option key={option.label} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </aside>

              <div>
                <div className="mb-6 flex flex-col justify-between gap-4 rounded-[2rem] border border-slate-200 bg-white p-4 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      Showing
                    </p>

                    <p className="font-black text-slate-950 dark:text-white">
                      {isProductsLoading
                        ? "Loading products..."
                        : `${products.length} of ${totalProducts} products`}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <SlidersHorizontal className="hidden h-5 w-5 text-slate-400 sm:block" />

                    <select
                      value={sort}
                      onChange={(event) => updateSort(event.target.value)}
                      className="h-10 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    {debouncedSearch && (
                      <FilterTag label={`Search: ${debouncedSearch}`} />
                    )}

                    {category && <FilterTag label={`Category: ${category}`} />}

                    {minPrice && <FilterTag label={`Min: $${minPrice}`} />}

                    {maxPrice && <FilterTag label={`Max: $${maxPrice}`} />}

                    {rating && <FilterTag label={`Rating: ${rating}+`} />}
                  </div>
                )}

                {isProductsLoading && (
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
                )}

                {!isProductsLoading && error && (
                  <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                    <p className="font-bold">Failed to load products.</p>
                    <p className="mt-2 text-sm">{error}</p>
                  </div>
                )}

                {!isProductsLoading && !error && products.length > 0 && (
                  <>
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                      {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-3">
                      <Button
                        variant="outline"
                        className="rounded-full"
                        disabled={page <= 1}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      >
                        Previous
                      </Button>

                      <span className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 dark:border-slate-800 dark:text-slate-300">
                        Page {page} of {totalPages}
                      </span>

                      <Button
                        variant="outline"
                        className="rounded-full"
                        disabled={page >= totalPages}
                        onClick={() =>
                          setPage((prev) => Math.min(prev + 1, totalPages))
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </>
                )}

                {!isProductsLoading && !error && products.length === 0 && (
                  <div className="rounded-[2rem] border border-slate-200 p-10 text-center dark:border-slate-800">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
                      <X className="h-6 w-6 text-slate-500" />
                    </div>

                    <h3 className="mt-5 text-xl font-black text-slate-950 dark:text-white">
                      No products found
                    </h3>

                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                      Try changing your search or filter options.
                    </p>

                    <Button
                      onClick={clearFilters}
                      className="mt-6 rounded-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>
      </main>
    </PublicLayout>
  );
}

function FilterTag({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
      {label}
    </span>
  );
}