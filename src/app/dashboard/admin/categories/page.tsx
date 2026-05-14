"use client";

import Image from "next/image";
import { Edit, Plus, Search, Trash2, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api/axios";
import { CategoriesResponse, Category } from "@/types/category";

interface CategoryFormState {
  name: string;
  slug: string;
  image: string;
  description: string;
  isActive: boolean;
}

const emptyForm: CategoryFormState = {
  name: "",
  slug: "",
  image: "",
  description: "",
  isActive: true,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  const [form, setForm] = useState<CategoryFormState>(emptyForm);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        category.name.toLowerCase().includes(searchValue) ||
        category.slug.toLowerCase().includes(searchValue) ||
        category.description?.toLowerCase().includes(searchValue);

      const matchesStatus =
        status === "active"
          ? category.isActive
          : status === "inactive"
            ? !category.isActive
            : true;

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, status]);

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError("");

      const res = await api.get<CategoriesResponse>("/categories");

      setCategories(res.data.categories || []);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to update category status. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateForm = () => {
    setEditingCategory(null);
    setForm(emptyForm);
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditForm = (category: Category) => {
    setEditingCategory(category);
    setForm({
      name: category.name || "",
      slug: category.slug || "",
      image: category.image || "",
      description: category.description || "",
      isActive: category.isActive,
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (isSubmitting) return;

    setIsFormOpen(false);
    setEditingCategory(null);
    setForm(emptyForm);
    setFormError("");
  };

  function isValidImageUrl(url?: string) {
    if (!url) return false;

    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch {
      return false;
    }
  }

  const updateForm = (
    field: keyof CategoryFormState,
    value: string | boolean,
  ) => {
    setForm((prev) => {
      if (field === "name" && !editingCategory) {
        return {
          ...prev,
          name: value as string,
          slug: generateSlug(value as string),
        };
      }

      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Category name is required.";
    if (!form.slug.trim()) return "Category slug is required.";
    if (!form.image.trim()) return "Category image URL is required.";

    if (!isValidImageUrl(form.image.trim())) {
      return "Please enter a valid image URL starting with http:// or https://";
    }
    if (!form.description.trim()) return "Category description is required.";

    return "";
  };

  const handleSubmitCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        image: form.image.trim(),
        description: form.description.trim(),
        isActive: form.isActive,
      };

      if (editingCategory) {
        const res = await api.patch<{ success: boolean; category: Category }>(
          `/categories/${editingCategory._id}`,
          payload,
        );

        setCategories((prev) =>
          prev.map((category) =>
            category._id === editingCategory._id ? res.data.category : category,
          ),
        );

        toast.success(`${payload.name} updated successfully.`);
      } else {
        const res = await api.post<{ success: boolean; category: Category }>(
          "/categories",
          payload,
        );

        setCategories((prev) => [res.data.category, ...prev]);

        toast.success(`${payload.name} created successfully.`);
      }

      closeForm();
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message ||
          "Failed to save category. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategory) return;

    try {
      setIsSubmitting(true);
      setDeleteError("");

      const deletedName = deleteCategory.name;

      await api.delete(`/categories/${deleteCategory._id}`);

      setCategories((prev) =>
        prev.filter((category) => category._id !== deleteCategory._id),
      );

      setDeleteCategory(null);
      toast.success(`${deletedName} deleted successfully.`);
    } catch (err: any) {
      setDeleteError(
        err?.response?.data?.message ||
          "Failed to delete category. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (category: Category) => {
    try {
      const payload = {
        name: category.name,
        slug: category.slug,
        image: category.image,
        description: category.description,
        isActive: !category.isActive,
      };

      const res = await api.patch<{ success: boolean; category: Category }>(
        `/categories/${category._id}`,
        payload,
      );

      setCategories((prev) =>
        prev.map((item) =>
          item._id === category._id ? res.data.category : item,
        ),
      );

      toast.success(
        `${category.name} marked as ${payload.isActive ? "active" : "inactive"}.`,
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to update category status. Please try again.",
      );
    }
  };

  return (
    <DashboardLayout allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
              Admin Categories
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              Manage Categories
            </h1>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Create, update, activate, deactivate, and organize product
              categories.
            </p>
          </div>

          <Button
            type="button"
            onClick={openCreateForm}
            className="rounded-full bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by category name, slug, or description..."
                className="h-11 rounded-full pl-11"
              />
            </div>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          {isLoading && (
            <div className="p-8 text-center text-sm font-semibold text-slate-500">
              Loading categories...
            </div>
          )}

          {!isLoading && error && (
            <div className="m-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          )}

          {!isLoading && !error && filteredCategories.length === 0 && (
            <div className="p-10 text-center">
              <h3 className="text-xl font-black text-slate-950 dark:text-white">
                No categories found
              </h3>

              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Try changing your search or status filter.
              </p>
            </div>
          )}

          {!isLoading && !error && filteredCategories.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Slug</th>
                    <th className="px-5 py-4">Description</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Toggle</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredCategories.map((category) => (
                    <tr
                      key={category._id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-950"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                            {isValidImageUrl(category.image) ? (
                              <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <span className="text-lg font-black text-slate-400">
                                {category.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div>
                            <p className="font-black text-slate-950 dark:text-white">
                              {category.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              ID: {category._id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {category.slug}
                        </span>
                      </td>

                      <td className="max-w-sm px-5 py-4">
                        <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                          {category.description}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex min-w-24 items-center justify-center rounded-full px-3 py-1.5 text-xs font-black ${
                            category.isActive
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(category)}
                          className={`group inline-flex h-9 w-[92px] items-center rounded-full border p-1 transition-all duration-300 ${
                            category.isActive
                              ? "border-emerald-200 bg-emerald-600 shadow-sm shadow-emerald-600/20"
                              : "border-slate-200 bg-slate-200 dark:border-slate-700 dark:bg-slate-800"
                          }`}
                          aria-label={`Mark ${category.name} as ${
                            category.isActive ? "inactive" : "active"
                          }`}
                          title={
                            category.isActive
                              ? "Click to deactivate"
                              : "Click to activate"
                          }
                        >
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-black shadow transition-all duration-300 ${
                              category.isActive
                                ? "translate-x-[56px] text-emerald-600"
                                : "translate-x-0 text-slate-500"
                            }`}
                          >
                            {category.isActive ? "ON" : "OFF"}
                          </span>
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => openEditForm(category)}
                            className="rounded-full"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setDeleteCategory(category);
                              setDeleteError("");
                            }}
                            className="rounded-full text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div
            style={{ width: "min(94vw, 620px)" }}
            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="relative border-b border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-6 py-6 dark:border-slate-800 dark:from-emerald-950/30 dark:via-slate-950 dark:to-sky-950/20">
              <button
                type="button"
                onClick={closeForm}
                className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
                disabled={isSubmitting}
                aria-label="Close category form"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                <Plus className="h-7 w-7" />
              </div>

              <h2 className="pr-12 text-2xl font-black text-slate-950 dark:text-white">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h2>

              <p className="mt-3 pr-4 text-base leading-7 text-slate-600 dark:text-slate-400">
                {editingCategory
                  ? "Update category details and visibility."
                  : "Create a category that can be used for product filtering and product uploads."}
              </p>
            </div>

            <form onSubmit={handleSubmitCategory}>
              <div className="space-y-5 px-6 py-5">
                {formError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                    {formError}
                  </div>
                )}

                <Field label="Category Name">
                  <Input
                    value={form.name}
                    onChange={(event) => updateForm("name", event.target.value)}
                    placeholder="Kitchen & Dining"
                    className="rounded-full"
                  />
                </Field>

                <Field label="Slug">
                  <Input
                    value={form.slug}
                    disabled
                    placeholder="kitchen-dining"
                    className="rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800"
                  />
                </Field>

                <Field label="Image URL">
                  <Input
                    value={form.image}
                    onChange={(event) =>
                      updateForm("image", event.target.value)
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="rounded-full"
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      updateForm("description", event.target.value)
                    }
                    placeholder="Short category description"
                    className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white p-4 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </Field>

                <label className="flex h-11 items-center gap-3 rounded-full border border-slate-200 px-4 dark:border-slate-800">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) =>
                      updateForm("isActive", event.target.checked)
                    }
                    className="h-4 w-4"
                  />

                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Category is active
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={isSubmitting}
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-7 text-sm font-black text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-emerald-600 px-7 text-sm font-black text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400 disabled:opacity-80"
                >
                  {isSubmitting
                    ? editingCategory
                      ? "Updating..."
                      : "Creating..."
                    : editingCategory
                      ? "Update Category"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div
            style={{ width: "min(92vw, 460px)" }}
            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="relative border-b border-slate-200 bg-gradient-to-br from-red-50 via-white to-orange-50 px-5 py-6 dark:border-slate-800 dark:from-red-950/30 dark:via-slate-950 dark:to-orange-950/20">
              <button
                type="button"
                onClick={() => {
                  setDeleteCategory(null);
                  setDeleteError("");
                }}
                className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                disabled={isSubmitting}
                aria-label="Close delete dialog"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300">
                <Trash2 className="h-7 w-7" />
              </div>

              <h2 className="pr-12 text-2xl font-black text-slate-950 dark:text-white">
                Delete Category?
              </h2>

              <p className="mt-3 pr-4 text-base leading-7 text-slate-600 dark:text-slate-400">
                This action cannot be undone. The category will be permanently
                removed from your store.
              </p>
            </div>

            <div className="space-y-4 px-5 py-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-lg font-black text-slate-950 dark:text-white">
                  {deleteCategory.name}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {deleteCategory.slug}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      deleteCategory.isActive
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                    }`}
                  >
                    {deleteCategory.isActive ? "Active" : "Inactive"}
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
                disabled={isSubmitting}
                onClick={() => {
                  setDeleteCategory(null);
                  setDeleteError("");
                }}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-black text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Keep Category
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleDeleteCategory}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-red-600 px-5 text-sm font-black text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400 disabled:opacity-80"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isSubmitting ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      {children}
    </div>
  );
}
