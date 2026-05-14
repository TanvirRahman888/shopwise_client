"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit, Eye, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product, ProductsResponse } from "@/types/product";
import { api } from "@/lib/api/axios";

const statusOptions = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Draft", value: "draft" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        product.brand?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status ? product.status === status : true;

      return matchesSearch && matchesStatus;
    });
  }, [products, search, status]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        setError("");

        const res = await api.get<ProductsResponse>("/products", {
          params: {
            limit: 100,
          },
        });

        setProducts(res.data.products || []);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load products. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  const getTotalStock = (product: Product) => {
    return product.variants.reduce((total, variant) => total + variant.stock, 0);
  };

  return (
    <DashboardLayout allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
              Admin Products
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              Manage Products
            </h1>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
              View, create, edit, and manage all store products.
            </p>
          </div>

          <Button
            asChild
            className="rounded-full bg-emerald-600 hover:bg-emerald-700"
          >
            <Link href="/dashboard/admin/products/create" prefetch={false}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

        <div className="rounded-4xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by product, category, or brand..."
                className="h-11 rounded-full pl-11"
              />
            </div>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            >
              {statusOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          {isLoading && (
            <div className="p-8 text-center text-sm font-semibold text-slate-500">
              Loading products...
            </div>
          )}

          {!isLoading && error && (
            <div className="m-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          )}

          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="p-10 text-center">
              <h3 className="text-xl font-black text-slate-950 dark:text-white">
                No products found
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Try changing your search or status filter.
              </p>
            </div>
          )}

          {!isLoading && !error && filteredProducts.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-245 text-left">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Variants</th>
                    <th className="px-5 py-4">Stock</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredProducts.map((product) => {
                    const primaryImage =
                      product.images.find((image) => image.isPrimary)?.url ||
                      product.images[0]?.url ||
                      "";

                    const totalStock = getTotalStock(product);

                    return (
                      <tr
                        key={product._id}
                        className="transition hover:bg-slate-50 dark:hover:bg-slate-950"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                              {primaryImage ? (
                                <Image
                                  src={primaryImage}
                                  alt={product.title}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              ) : null}
                            </div>

                            <div className="min-w-0">
                              <p className="line-clamp-1 font-black text-slate-950 dark:text-white">
                                {product.title}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {product.brand || "No brand"}
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                {product.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            {product.category}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div>
                            <p className="font-black text-slate-950 dark:text-white">
                              ${(product.discountPrice || product.basePrice).toFixed(2)}
                            </p>

                            {product.discountPrice && (
                              <p className="text-sm font-semibold text-slate-400 line-through">
                                ${product.basePrice.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {product.variants.length}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`font-bold ${
                              totalStock > 10
                                ? "text-emerald-600"
                                : totalStock > 0
                                  ? "text-orange-500"
                                  : "text-red-500"
                            }`}
                          >
                            {totalStock}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                              product.status === "active"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                : product.status === "draft"
                                  ? "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              asChild
                              variant="outline"
                              size="icon"
                              className="rounded-full"
                            >
                              <Link
                                href={`/products/${product.slug}`}
                                prefetch={false}
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>

                            <Button
                              asChild
                              variant="outline"
                              size="icon"
                              className="rounded-full"
                            >
                              <Link
                                href={`/dashboard/admin/products/${product._id}/edit`}
                                prefetch={false}
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="rounded-full text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}