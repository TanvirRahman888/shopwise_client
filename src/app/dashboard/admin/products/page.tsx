"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit, Eye, Plus, Search, Trash2, X } from "lucide-react";
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

  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        product.title.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue) ||
        (product.brand || "").toLowerCase().includes(searchValue);

      const matchesStatus = status ? product.status === status : true;

      return matchesSearch && matchesStatus;
    });
  }, [products, search, status]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError("");

      const res = await api.get<ProductsResponse>("/products/admin/all");

      setProducts(res.data.products || []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to load products. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const getTotalStock = (product: Product) => {
    return product.variants.reduce(
      (total, variant) => total + variant.stock,
      0,
    );
  };

  const handleDeleteProduct = async () => {
    if (!deleteProduct) return;

    try {
      setIsDeleting(true);
      setDeleteError("");
      setSuccessMessage("");

      const deletedTitle = deleteProduct.title;

      await api.delete(`/products/${deleteProduct._id}`);

      setProducts((prev) =>
        prev.filter((product) => product._id !== deleteProduct._id),
      );

      setDeleteProduct(null);
      setSuccessMessage(`${deletedTitle} deleted successfully.`);

      window.setTimeout(() => {
        setSuccessMessage("");
      }, 3500);
    } catch (err: any) {
      setDeleteError(
        err?.response?.data?.message ||
          "Failed to delete product. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
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

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
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

        {successMessage && (
          <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            {successMessage}
          </div>
        )}

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
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
              <table className="w-full min-w-[980px] text-left">
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
                              $
                              {(
                                product.discountPrice || product.basePrice
                              ).toFixed(2)}
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
                              onClick={() => {
                                setDeleteProduct(product);
                                setDeleteError("");
                              }}
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

      {deleteProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div
            style={{ width: "min(92vw, 460px)" }}
            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="relative border-b border-slate-200 bg-gradient-to-br from-red-50 via-white to-orange-50 px-5 py-6 dark:border-slate-800 dark:from-red-950/30 dark:via-slate-950 dark:to-orange-950/20">
              <button
                type="button"
                onClick={() => {
                  setDeleteProduct(null);
                  setDeleteError("");
                }}
                className="absolute right-6 top-6 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                aria-label="Close delete dialog"
                disabled={isDeleting}
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300">
                <Trash2 className="h-7 w-7" />
              </div>

              <h2 className="pr-12 text-2xl font-black text-slate-950 dark:text-white">
                Delete Product?
              </h2>

              <p className="mt-3 pr-4 text-base leading-7 text-slate-600 dark:text-slate-400">
                This action cannot be undone. The product will be permanently
                removed from your store and public product listings.
              </p>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-lg font-black text-slate-950 dark:text-white">
                  {deleteProduct.title}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {deleteProduct.category}
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {deleteProduct.brand || "No brand"}
                  </span>

                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold capitalize text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                    {deleteProduct.status}
                  </span>
                </div>
              </div>

              {deleteError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                  {deleteError}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setDeleteProduct(null);
                  setDeleteError("");
                }}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-7 text-sm font-black text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Keep Product
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteProduct}
                style={{
                  backgroundColor: isDeleting ? "#f87171" : "#dc2626",
                  color: "#ffffff",
                  opacity: isDeleting ? 0.85 : 1,
                }}
                className="inline-flex h-12 items-center justify-center rounded-2xl px-7 text-sm font-black shadow-lg shadow-red-600/25 transition hover:brightness-95 disabled:cursor-not-allowed"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
