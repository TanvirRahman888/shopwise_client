"use client";

import { useRouter } from "next/navigation";
import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api/axios";
import { CategoriesResponse, Category } from "@/types/category";

interface ProductImageInput {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

interface ProductSizeInput {
  size: string;
  basePrice: string;
  discountPrice: string;
  stock: string;
}

interface ProductVariationInput {
  colorName: string;
  hexCode: string;
  images: ProductImageInput[];
  sizes: ProductSizeInput[];
}

interface SpecificationInput {
  key: string;
  value: string;
}

const emptyImage: ProductImageInput = {
  url: "",
  alt: "",
  isPrimary: false,
};

const emptySize: ProductSizeInput = {
  size: "",
  basePrice: "",
  discountPrice: "",
  stock: "",
};

const emptyVariation: ProductVariationInput = {
  colorName: "",
  hexCode: "#000000",
  images: [{ ...emptyImage }],
  sizes: [{ ...emptySize }],
};

const emptySpecification: SpecificationInput = {
  key: "",
  value: "",
};

export default function CreateProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState<"active" | "inactive" | "draft">(
    "active",
  );
  const [isFeatured, setIsFeatured] = useState(false);

  const [images, setImages] = useState<ProductImageInput[]>([
    { url: "", alt: "", isPrimary: true },
  ]);

  const [variations, setVariations] = useState<ProductVariationInput[]>([
    {
      ...emptyVariation,
      images: [{ ...emptyImage }],
      sizes: [{ ...emptySize }],
    },
  ]);

  const [specifications, setSpecifications] = useState<SpecificationInput[]>([
    { ...emptySpecification },
  ]);

  const [tags, setTags] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        setIsCategoriesLoading(true);

        const res = await api.get<CategoriesResponse>("/categories");

        const activeCategories = (res.data.categories || []).filter(
          (item) => item.isActive,
        );

        setCategories(activeCategories);

        if (activeCategories.length > 0) {
          setCategory(activeCategories[0].name);
        }
      } catch {
        setCategories([]);
      } finally {
        setIsCategoriesLoading(false);
      }
    }

    loadCategories();
  }, []);

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const generateSku = (productTitle: string, color: string, size: string) => {
    const productPart = productTitle
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, "")
      .split(" ")
      .slice(0, 2)
      .join("-");

    const colorPart = color
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 4);

    const sizePart = size.toUpperCase().replace(/[^A-Z0-9]/g, "");

    return [productPart || "PRODUCT", colorPart || "COLOR", sizePart || "SIZE"]
      .filter(Boolean)
      .join("-");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(generateSlug(value));
  };

  const allSizeRows = useMemo(() => {
    return variations.flatMap((variation) =>
      variation.sizes.map((size) => ({
        variation,
        size,
      })),
    );
  }, [variations]);

  const calculatedBasePrice = useMemo(() => {
    const prices = allSizeRows
      .map((item) => Number(item.size.basePrice))
      .filter((price) => price > 0);

    return prices.length > 0 ? Math.min(...prices) : 0;
  }, [allSizeRows]);

  const calculatedDiscountPrice = useMemo(() => {
    const prices = allSizeRows
      .map((item) => Number(item.size.discountPrice))
      .filter((price) => price > 0);

    return prices.length > 0 ? Math.min(...prices) : null;
  }, [allSizeRows]);

  const totalStock = useMemo(() => {
    return allSizeRows.reduce((total, item) => {
      return total + Number(item.size.stock || 0);
    }, 0);
  }, [allSizeRows]);

  const addImage = () => {
    setImages((prev) => [...prev, { ...emptyImage }]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const next = prev.filter((_, itemIndex) => itemIndex !== index);

      if (next.length === 0) {
        return [{ url: "", alt: "", isPrimary: true }];
      }

      if (!next.some((image) => image.isPrimary)) {
        next[0].isPrimary = true;
      }

      return next;
    });
  };

  const updateImage = (
    index: number,
    field: keyof ProductImageInput,
    value: string | boolean,
  ) => {
    setImages((prev) =>
      prev.map((image, itemIndex) => {
        if (field === "isPrimary") {
          return {
            ...image,
            isPrimary: itemIndex === index,
          };
        }

        return itemIndex === index
          ? {
              ...image,
              [field]: value,
            }
          : image;
      }),
    );
  };

  const addVariation = () => {
    setVariations((prev) => [
      ...prev,
      {
        ...emptyVariation,
        images: [{ ...emptyImage }],
        sizes: [{ ...emptySize }],
      },
    ]);
  };

  const removeVariation = (variationIndex: number) => {
    setVariations((prev) => {
      const next = prev.filter((_, index) => index !== variationIndex);

      return next.length > 0
        ? next
        : [
            {
              ...emptyVariation,
              images: [{ ...emptyImage }],
              sizes: [{ ...emptySize }],
            },
          ];
    });
  };

  const updateVariation = (
    variationIndex: number,
    field: keyof Omit<ProductVariationInput, "images" | "sizes">,
    value: string,
  ) => {
    setVariations((prev) =>
      prev.map((variation, index) =>
        index === variationIndex
          ? {
              ...variation,
              [field]: value,
            }
          : variation,
      ),
    );
  };

  const addVariationImage = (variationIndex: number) => {
    setVariations((prev) =>
      prev.map((variation, index) =>
        index === variationIndex
          ? {
              ...variation,
              images: [...variation.images, { ...emptyImage }],
            }
          : variation,
      ),
    );
  };

  const removeVariationImage = (variationIndex: number, imageIndex: number) => {
    setVariations((prev) =>
      prev.map((variation, index) => {
        if (index !== variationIndex) return variation;

        const nextImages = variation.images.filter(
          (_, itemIndex) => itemIndex !== imageIndex,
        );

        return {
          ...variation,
          images: nextImages.length > 0 ? nextImages : [{ ...emptyImage }],
        };
      }),
    );
  };

  const updateVariationImage = (
    variationIndex: number,
    imageIndex: number,
    field: keyof ProductImageInput,
    value: string,
  ) => {
    setVariations((prev) =>
      prev.map((variation, index) => {
        if (index !== variationIndex) return variation;

        return {
          ...variation,
          images: variation.images.map((image, itemIndex) =>
            itemIndex === imageIndex
              ? {
                  ...image,
                  [field]: value,
                }
              : image,
          ),
        };
      }),
    );
  };

  const addVariationSize = (variationIndex: number) => {
    setVariations((prev) =>
      prev.map((variation, index) =>
        index === variationIndex
          ? {
              ...variation,
              sizes: [...variation.sizes, { ...emptySize }],
            }
          : variation,
      ),
    );
  };

  const removeVariationSize = (variationIndex: number, sizeIndex: number) => {
    setVariations((prev) =>
      prev.map((variation, index) => {
        if (index !== variationIndex) return variation;

        const nextSizes = variation.sizes.filter(
          (_, itemIndex) => itemIndex !== sizeIndex,
        );

        return {
          ...variation,
          sizes: nextSizes.length > 0 ? nextSizes : [{ ...emptySize }],
        };
      }),
    );
  };

  const updateVariationSize = (
    variationIndex: number,
    sizeIndex: number,
    field: keyof ProductSizeInput,
    value: string,
  ) => {
    setVariations((prev) =>
      prev.map((variation, index) => {
        if (index !== variationIndex) return variation;

        return {
          ...variation,
          sizes: variation.sizes.map((size, itemIndex) =>
            itemIndex === sizeIndex
              ? {
                  ...size,
                  [field]: value,
                }
              : size,
          ),
        };
      }),
    );
  };

  const addSpecification = () => {
    setSpecifications((prev) => [...prev, { ...emptySpecification }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications((prev) => {
      const next = prev.filter((_, itemIndex) => itemIndex !== index);
      return next.length > 0 ? next : [{ ...emptySpecification }];
    });
  };

  const updateSpecification = (
    index: number,
    field: keyof SpecificationInput,
    value: string,
  ) => {
    setSpecifications((prev) =>
      prev.map((spec, itemIndex) =>
        itemIndex === index
          ? {
              ...spec,
              [field]: value,
            }
          : spec,
      ),
    );
  };

  const validateForm = () => {
    if (!title.trim()) return "Product title is required.";
    if (!slug.trim()) return "Product slug is required.";
    if (!shortDescription.trim()) return "Short description is required.";
    if (!description.trim()) return "Full description is required.";
    if (!category.trim()) return "Category is required.";
    if (!images.some((image) => image.url.trim())) {
      return "At least one product image URL is required.";
    }

    for (const variation of variations) {
      if (!variation.colorName.trim()) {
        return "Variation color name is required.";
      }

      if (!variation.images.some((image) => image.url.trim())) {
        return `At least one image is required for ${variation.colorName}.`;
      }

      for (const size of variation.sizes) {
        if (!size.size.trim()) return "Size is required for every variation.";

        if (!size.basePrice || Number(size.basePrice) <= 0) {
          return "Base price is required for every size.";
        }

        if (
          size.discountPrice &&
          Number(size.discountPrice) >= Number(size.basePrice)
        ) {
          return "Discount price must be lower than base price.";
        }

        if (size.stock === "" || Number(size.stock) < 0) {
          return "Stock is required for every size.";
        }
      }
    }

    return "";
  };

  const buildPayload = () => {
    const flattenedVariants = variations.flatMap((variation) =>
      variation.sizes.map((size) => ({
        color: {
          name: variation.colorName.trim(),
          hexCode: variation.hexCode,
        },
        size: size.size.trim(),
        sku: generateSku(title, variation.colorName, size.size),
        price: Number(size.discountPrice || size.basePrice),
        stock: Number(size.stock),
        images: variation.images
          .filter((image) => image.url.trim())
          .map((image) => ({
            url: image.url.trim(),
            alt: image.alt.trim() || title,
          })),
      })),
    );

    return {
      title: title.trim(),
      slug,
      description: description.trim(),
      shortDescription: shortDescription.trim(),
      category,
      brand: brand.trim(),
      basePrice: calculatedBasePrice,
      discountPrice: calculatedDiscountPrice,
      images: images
        .filter((image) => image.url.trim())
        .map((image, index) => ({
          url: image.url.trim(),
          alt: image.alt.trim() || title,
          isPrimary: image.isPrimary || index === 0,
        })),
      variants: flattenedVariants,
      specifications: specifications
        .filter((spec) => spec.key.trim() && spec.value.trim())
        .map((spec) => ({
          key: spec.key.trim(),
          value: spec.value.trim(),
        })),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      isFeatured,
      status,
    };
  };

  const handlePreview = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setServerError(validationError);
      return;
    }

    setServerError("");
    setIsPreviewOpen(true);
  };

  const confirmCreateProduct = async () => {
    try {
      setIsSubmitting(true);
      setServerError("");

      const payload = buildPayload();

      await api.post("/products", payload);

      setIsPreviewOpen(false);
      router.push("/dashboard/admin/products");
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message ||
          "Failed to create product. Please try again.",
      );
      setIsPreviewOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const discardProduct = () => {
    setIsPreviewOpen(false);
    router.push("/dashboard/admin/products");
  };

  return (
    <DashboardLayout allowedRoles={["admin"]}>
      <form onSubmit={handlePreview} className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
              Admin Product
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              Create Product
            </h1>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Add a product with color variations, multiple sizes, auto SKU,
              calculated prices, and preview confirmation.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="mr-2 h-4 w-4" />
            Preview Product
          </Button>
        </div>

        {serverError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            {serverError}
          </div>
        )}

        <section className="rounded-4xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-black text-slate-950 dark:text-white">
            Basic Information
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field label="Product Title">
              <Input
                value={title}
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="Premium Office Chair"
                className="rounded-full"
              />
            </Field>

            <Field label="Slug - Auto Generated">
              <Input
                value={slug}
                disabled
                placeholder="premium-office-chair"
                className="rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800"
              />
            </Field>

            <Field label="Category">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-10 w-full rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                {isCategoriesLoading ? (
                  <option>Loading categories...</option>
                ) : (
                  categories.map((item) => (
                    <option key={item._id} value={item.name}>
                      {item.name}
                    </option>
                  ))
                )}
              </select>
            </Field>

            <Field label="Brand">
              <Input
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                placeholder="Brand name"
                className="rounded-full"
              />
            </Field>

            <Field label="Calculated Base Price">
              <Input
                value={
                  calculatedBasePrice > 0
                    ? `$${calculatedBasePrice.toFixed(2)}`
                    : "Add variation prices"
                }
                disabled
                className="rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800"
              />
            </Field>

            <Field label="Calculated Discount Price">
              <Input
                value={
                  calculatedDiscountPrice
                    ? `$${calculatedDiscountPrice.toFixed(2)}`
                    : "No discount"
                }
                disabled
                className="rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800"
              />
            </Field>

            <Field label="Total Stock">
              <Input
                value={String(totalStock)}
                disabled
                className="rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800"
              />
            </Field>

            <Field label="Status">
              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as "active" | "inactive" | "draft",
                  )
                }
                className="h-10 w-full rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </Field>

            <Field label="Featured">
              <label className="flex h-10 items-center gap-3 rounded-full border border-slate-200 px-4 dark:border-slate-800">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(event) => setIsFeatured(event.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Mark as featured product
                </span>
              </label>
            </Field>
          </div>

          <div className="mt-5 grid gap-5">
            <Field label="Short Description">
              <Input
                value={shortDescription}
                onChange={(event) => setShortDescription(event.target.value)}
                placeholder="Short product summary"
                className="rounded-full"
              />
            </Field>

            <Field label="Full Description">
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Detailed product description"
                className="min-h-32 w-full rounded-3xl border border-slate-200 bg-white p-4 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </Field>

            <Field label="Tags">
              <Input
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                placeholder="chair, office, furniture"
                className="rounded-full"
              />
            </Field>
          </div>
        </section>

        <section className="rounded-4xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-950 dark:text-white">
                Product Images
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                These images are used on product cards and general product
                previews.
              </p>
            </div>

            <Button type="button" variant="outline" onClick={addImage}>
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="grid gap-4 rounded-3xl border border-slate-200 p-4 dark:border-slate-800 md:grid-cols-[1fr_1fr_auto_auto]"
              >
                <Input
                  value={image.url}
                  onChange={(event) =>
                    updateImage(index, "url", event.target.value)
                  }
                  placeholder="Image URL"
                  className="rounded-full"
                />

                <Input
                  value={image.alt}
                  onChange={(event) =>
                    updateImage(index, "alt", event.target.value)
                  }
                  placeholder="Alt text"
                  className="rounded-full"
                />

                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="radio"
                    checked={Boolean(image.isPrimary)}
                    onChange={() => updateImage(index, "isPrimary", true)}
                  />
                  Primary
                </label>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeImage(index)}
                  className="rounded-full text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-4xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-950 dark:text-white">
                Variations
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Variation means color. Each variation can have multiple sizes,
                prices, and stock.
              </p>
            </div>

            <Button type="button" variant="outline" onClick={addVariation}>
              <Plus className="mr-2 h-4 w-4" />
              Add Variation
            </Button>
          </div>

          <div className="mt-6 space-y-6">
            {variations.map((variation, variationIndex) => {
              const variationStock = variation.sizes.reduce((total, size) => {
                return total + Number(size.stock || 0);
              }, 0);

              return (
                <div
                  key={variationIndex}
                  className="rounded-4xl border border-slate-200 p-5 dark:border-slate-800"
                >
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-black text-slate-950 dark:text-white">
                        Variation {variationIndex + 1}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        Variation Stock: {variationStock}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeVariation(variationIndex)}
                      className="rounded-full text-red-500"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Color Name">
                      <Input
                        value={variation.colorName}
                        onChange={(event) =>
                          updateVariation(
                            variationIndex,
                            "colorName",
                            event.target.value,
                          )
                        }
                        placeholder="Black"
                        className="rounded-full"
                      />
                    </Field>

                    <Field label="Hex Code">
                      <Input
                        type="color"
                        value={variation.hexCode}
                        onChange={(event) =>
                          updateVariation(
                            variationIndex,
                            "hexCode",
                            event.target.value,
                          )
                        }
                        className="h-10 rounded-full p-1"
                      />
                    </Field>
                  </div>

                  <div className="mt-6 rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <h4 className="text-sm font-black text-slate-950 dark:text-white">
                        Variation Images
                      </h4>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addVariationImage(variationIndex)}
                        className="rounded-full"
                      >
                        <Plus className="mr-2 h-3.5 w-3.5" />
                        Add Image
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {variation.images.map((image, imageIndex) => (
                        <div
                          key={imageIndex}
                          className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
                        >
                          <Input
                            value={image.url}
                            onChange={(event) =>
                              updateVariationImage(
                                variationIndex,
                                imageIndex,
                                "url",
                                event.target.value,
                              )
                            }
                            placeholder="Variation image URL"
                            className="rounded-full"
                          />

                          <Input
                            value={image.alt}
                            onChange={(event) =>
                              updateVariationImage(
                                variationIndex,
                                imageIndex,
                                "alt",
                                event.target.value,
                              )
                            }
                            placeholder="Alt text"
                            className="rounded-full"
                          />

                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              removeVariationImage(variationIndex, imageIndex)
                            }
                            className="rounded-full text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <h4 className="text-sm font-black text-slate-950 dark:text-white">
                        Sizes, Prices, Stock & Auto SKU
                      </h4>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addVariationSize(variationIndex)}
                        className="rounded-full"
                      >
                        <Plus className="mr-2 h-3.5 w-3.5" />
                        Add Size
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {variation.sizes.map((size, sizeIndex) => {
                        const autoSku = generateSku(
                          title,
                          variation.colorName,
                          size.size,
                        );

                        return (
                          <div
                            key={sizeIndex}
                            className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1.4fr_auto]"
                          >
                            <Field label="Size">
                              <Input
                                value={size.size}
                                onChange={(event) =>
                                  updateVariationSize(
                                    variationIndex,
                                    sizeIndex,
                                    "size",
                                    event.target.value,
                                  )
                                }
                                placeholder="M / L / Standard"
                                className="rounded-full"
                              />
                            </Field>

                            <Field label="Base Price">
                              <Input
                                type="number"
                                value={size.basePrice}
                                onChange={(event) =>
                                  updateVariationSize(
                                    variationIndex,
                                    sizeIndex,
                                    "basePrice",
                                    event.target.value,
                                  )
                                }
                                placeholder="99.99"
                                className="rounded-full"
                              />
                            </Field>

                            <Field label="Discount Price">
                              <Input
                                type="number"
                                value={size.discountPrice}
                                onChange={(event) =>
                                  updateVariationSize(
                                    variationIndex,
                                    sizeIndex,
                                    "discountPrice",
                                    event.target.value,
                                  )
                                }
                                placeholder="79.99"
                                className="rounded-full"
                              />
                            </Field>

                            <Field label="Stock">
                              <Input
                                type="number"
                                value={size.stock}
                                onChange={(event) =>
                                  updateVariationSize(
                                    variationIndex,
                                    sizeIndex,
                                    "stock",
                                    event.target.value,
                                  )
                                }
                                placeholder="20"
                                className="rounded-full"
                              />
                            </Field>

                            <Field label="SKU - Auto Generated">
                              <Input
                                value={autoSku}
                                disabled
                                className="rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800"
                              />
                            </Field>

                            <div className="flex items-end">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  removeVariationSize(variationIndex, sizeIndex)
                                }
                                className="rounded-full text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-4xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">
              Specifications
            </h2>

            <Button type="button" variant="outline" onClick={addSpecification}>
              <Plus className="mr-2 h-4 w-4" />
              Add Specification
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            {specifications.map((spec, index) => (
              <div
                key={index}
                className="grid gap-4 md:grid-cols-[1fr_1fr_auto]"
              >
                <Input
                  value={spec.key}
                  onChange={(event) =>
                    updateSpecification(index, "key", event.target.value)
                  }
                  placeholder="Material"
                  className="rounded-full"
                />

                <Input
                  value={spec.value}
                  onChange={(event) =>
                    updateSpecification(index, "value", event.target.value)
                  }
                  placeholder="Cotton"
                  className="rounded-full"
                />

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeSpecification(index)}
                  className="rounded-full text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>
      </form>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-h-[92vh] w-[95vw] max-w-none overflow-hidden rounded-[2rem] border-slate-200 p-0 dark:border-slate-800 sm:max-w-6xl xl:max-w-7xl">
          <DialogHeader className="border-b border-slate-200 bg-slate-50 px-6 py-5 dark:border-slate-800 dark:bg-slate-950">
            <DialogTitle className="text-2xl font-black text-slate-950 dark:text-white">
              Preview Product
            </DialogTitle>

            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Review all product information before adding it to ShopWise.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
            <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
                  {images.find((image) => image.isPrimary)?.url ||
                  images[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        images.find((image) => image.isPrimary)?.url ||
                        images[0]?.url
                      }
                      alt={title}
                      className="aspect-square w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-square items-center justify-center text-sm font-semibold text-slate-500">
                      No image selected
                    </div>
                  )}
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                    Stock Summary
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <SummaryBox
                      label="Total Stock"
                      value={String(totalStock)}
                    />
                    <SummaryBox
                      label="Variations"
                      value={String(variations.length)}
                    />
                    <SummaryBox
                      label="Base Price"
                      value={`$${calculatedBasePrice.toFixed(2)}`}
                    />
                    <SummaryBox
                      label="Discount"
                      value={
                        calculatedDiscountPrice
                          ? `$${calculatedDiscountPrice.toFixed(2)}`
                          : "None"
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {category}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {status}
                    </span>

                    {isFeatured && (
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-3xl font-black leading-tight text-slate-950 dark:text-white">
                    {title}
                  </h3>

                  <p className="mt-3 text-slate-600 dark:text-slate-400">
                    {shortDescription}
                  </p>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <InfoRow label="Slug" value={slug} />
                    <InfoRow label="Brand" value={brand || "No brand"} />
                  </div>
                </section>

                <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <h4 className="text-lg font-black text-slate-950 dark:text-white">
                    Variations & Sizes
                  </h4>

                  <div className="mt-4 space-y-4">
                    {variations.map((variation, variationIndex) => {
                      const variationStock = variation.sizes.reduce(
                        (total, size) => {
                          return total + Number(size.stock || 0);
                        },
                        0,
                      );

                      return (
                        <div
                          key={variationIndex}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span
                                className="h-6 w-6 rounded-full border border-slate-300"
                                style={{ backgroundColor: variation.hexCode }}
                              />

                              <div>
                                <p className="font-black text-slate-950 dark:text-white">
                                  {variation.colorName ||
                                    `Variation ${variationIndex + 1}`}
                                </p>
                                <p className="text-xs font-semibold text-slate-500">
                                  Stock: {variationStock}
                                </p>
                              </div>
                            </div>

                            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                              {variation.sizes.length} size
                              {variation.sizes.length > 1 ? "s" : ""}
                            </span>
                          </div>

                          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                            <table className="w-full text-left text-sm">
                              <thead className="bg-white text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900">
                                <tr>
                                  <th className="px-3 py-3">Size</th>
                                  <th className="px-3 py-3">Base</th>
                                  <th className="px-3 py-3">Discount</th>
                                  <th className="px-3 py-3">Stock</th>
                                  <th className="px-3 py-3">SKU</th>
                                </tr>
                              </thead>

                              <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
                                {variation.sizes.map((size, sizeIndex) => (
                                  <tr key={sizeIndex}>
                                    <td className="px-3 py-3 font-bold text-slate-950 dark:text-white">
                                      {size.size || "N/A"}
                                    </td>
                                    <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                                      ${size.basePrice || "0"}
                                    </td>
                                    <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                                      {size.discountPrice
                                        ? `$${size.discountPrice}`
                                        : "None"}
                                    </td>
                                    <td className="px-3 py-3 font-bold text-emerald-600">
                                      {size.stock || "0"}
                                    </td>
                                    <td className="max-w-[180px] px-3 py-3">
                                      <span className="block truncate rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800">
                                        {generateSku(
                                          title,
                                          variation.colorName,
                                          size.size,
                                        )}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <h4 className="text-lg font-black text-slate-950 dark:text-white">
                    Description
                  </h4>

                  <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                    {description}
                  </p>
                </section>

                {specifications.some((spec) => spec.key && spec.value) && (
                  <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                    <h4 className="text-lg font-black text-slate-950 dark:text-white">
                      Specifications
                    </h4>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {specifications
                        .filter((spec) => spec.key && spec.value)
                        .map((spec, index) => (
                          <InfoRow
                            key={index}
                            label={spec.key}
                            value={spec.value}
                          />
                        ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 mb-3 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-full border-red-200 px-6 font-bold text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
              onClick={discardProduct}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Discard Product
            </Button>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-full border-slate-300 px-6 font-bold hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700"
                onClick={() => setIsPreviewOpen(false)}
              >
                Edit Details
              </Button>

              <Button
                type="button"
                disabled={isSubmitting}
                className="h-11 rounded-full bg-emerald-600 px-7 font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
                onClick={confirmCreateProduct}
              >
                {isSubmitting ? "Adding Product..." : "Confirm & Add Product"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

function PreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 wrap-break-word font-black text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function SummaryBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-black text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}
