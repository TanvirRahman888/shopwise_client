"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { MouseEvent, useMemo, useState } from "react";

import { Product, ProductVariant } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const defaultVariant = product.variants[0];

  const [selectedColor, setSelectedColor] = useState(
    defaultVariant?.color.name || "",
  );

  const [selectedSize, setSelectedSize] = useState(defaultVariant?.size || "");
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = useMemo(() => {
    return product.variants.find(
      (variant) =>
        variant.color.name === selectedColor && variant.size === selectedSize,
    );
  }, [product.variants, selectedColor, selectedSize]);

  const currentVariant: ProductVariant | undefined =
    selectedVariant || defaultVariant;

  const galleryImages =
    currentVariant?.images?.length && currentVariant.images[0]?.url
      ? currentVariant.images
      : product.images;

  const [selectedImage, setSelectedImage] = useState(
    galleryImages[0]?.url || product.images[0]?.url || "",
  );

  const [isMagnifierVisible, setIsMagnifierVisible] = useState(false);

  const [magnifierPosition, setMagnifierPosition] = useState({
    x: 0,
    y: 0,
  });

  const colors = Array.from(
    new Map(
      product.variants.map((variant) => [variant.color.name, variant.color]),
    ).values(),
  );

  const sizesForSelectedColor = product.variants
    .filter((variant) => variant.color.name === selectedColor)
    .map((variant) => variant.size);

  const price =
    currentVariant?.price || product.discountPrice || product.basePrice;

  const stock = currentVariant?.stock || 0;

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, stock || 1));
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleImageMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      event.currentTarget.getBoundingClientRect();

    const x = ((event.clientX - left) / width) * 100;
    const y = ((event.clientY - top) / height) * 100;

    setMagnifierPosition({ x, y });
  };

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);

    const firstVariantForColor = product.variants.find(
      (variant) => variant.color.name === colorName && variant.stock > 0,
    );

    if (firstVariantForColor) {
      const nextImage =
        firstVariantForColor.images[0]?.url || product.images[0]?.url || "";

      setSelectedSize(firstVariantForColor.size);
      setSelectedImage(nextImage);
      setQuantity(1);
    }
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);

    const variant = product.variants.find(
      (item) => item.color.name === selectedColor && item.size === size,
    );

    if (variant) {
      setSelectedImage(variant.images[0]?.url || product.images[0]?.url || "");
      setQuantity(1);
    }
  };

  return (
    <main className="bg-white py-10 dark:bg-slate-950">
      <Container>
        <div className="mb-8 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-emerald-600">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-white">
            {product.title}
          </span>
        </div>

        <section className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="relative">
              <div
                className="relative aspect-square cursor-crosshair overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900"
                onMouseEnter={() => setIsMagnifierVisible(true)}
                onMouseLeave={() => setIsMagnifierVisible(false)}
                onMouseMove={handleImageMouseMove}
              >
                {selectedImage && (
                  <>
                    <Image
                      src={selectedImage}
                      alt={product.title}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />

                    {isMagnifierVisible && (
                      <div
                        className="pointer-events-none absolute z-20 hidden h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 border-emerald-500 bg-emerald-500/10 md:block"
                        style={{
                          left: `${magnifierPosition.x}%`,
                          top: `${magnifierPosition.y}%`,
                        }}
                      />
                    )}
                  </>
                )}
              </div>

              {selectedImage && isMagnifierVisible && (
                <div
                  className="pointer-events-none absolute left-[calc(100%+24px)] top-0 z-50 hidden h-full w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl lg:block dark:border-slate-800 dark:bg-slate-900"
                  style={{
                    backgroundImage: `url(${selectedImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "220%",
                    backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                  }}
                />
              )}
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {galleryImages.slice(0, 4).map((image) => (
                <button
                  type="button"
                  key={image.url}
                  onClick={() => setSelectedImage(image.url)}
                  className={`relative aspect-square overflow-hidden rounded-2xl border bg-slate-100 dark:bg-slate-900 ${
                    selectedImage === image.url
                      ? "border-emerald-600"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || product.title}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              <Badge className="rounded-full bg-emerald-600">
                {product.category}
              </Badge>

              {product.brand && (
                <Badge variant="outline" className="rounded-full">
                  {product.brand}
                </Badge>
              )}

              {stock > 0 ? (
                <Badge
                  variant="outline"
                  className="rounded-full text-emerald-600"
                >
                  In Stock
                </Badge>
              ) : (
                <Badge variant="destructive" className="rounded-full">
                  Out of Stock
                </Badge>
              )}
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl dark:text-white">
              {product.title}
            </h1>

            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
              {product.shortDescription}
            </p>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-bold">{product.rating || 0}</span>
              </div>

              <span className="text-sm text-slate-500">
                ({product.reviewCount || 0} reviews)
              </span>
            </div>

            <div className="mt-6 flex items-end gap-3">
              <p className="text-4xl font-black text-slate-950 dark:text-white">
                ${price.toFixed(2)}
              </p>

              {product.discountPrice && (
                <p className="mb-1 text-lg font-semibold text-slate-400 line-through">
                  ${product.basePrice.toFixed(2)}
                </p>
              )}
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-slate-950 dark:text-white">
                Color
              </h3>

              <div className="mt-3 flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    type="button"
                    key={color.name}
                    onClick={() => handleColorChange(color.name)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      selectedColor === color.name
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "border-slate-200 text-slate-700 hover:border-emerald-600 dark:border-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <span
                      className="h-4 w-4 rounded-full border border-slate-300"
                      style={{ backgroundColor: color.hexCode }}
                    />
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-bold text-slate-950 dark:text-white">Size</h3>

              <div className="mt-3 flex flex-wrap gap-3">
                {sizesForSelectedColor.map((size) => {
                  const variant = product.variants.find(
                    (item) =>
                      item.color.name === selectedColor && item.size === size,
                  );

                  const isDisabled = !variant || variant.stock <= 0;

                  return (
                    <button
                      type="button"
                      key={size}
                      disabled={isDisabled}
                      onClick={() => handleSizeChange(size)}
                      className={`rounded-full border px-5 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        selectedSize === size
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-slate-200 text-slate-700 hover:border-emerald-600 dark:border-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Selected SKU
                </span>
                <span className="font-bold text-slate-950 dark:text-white">
                  {currentVariant?.sku || "N/A"}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Available Stock
                </span>
                <span className="font-bold text-slate-950 dark:text-white">
                  {stock}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <div className="flex h-12 w-full items-center justify-between rounded-full border border-slate-200 px-2 sm:w-36 dark:border-slate-800">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="font-bold">{quantity}</span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                disabled={!stock}
                className="h-12 flex-1 rounded-full bg-emerald-600 text-base font-bold hover:bg-emerald-700"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>

              <Button
                variant="outline"
                className="h-12 rounded-full px-5"
                aria-label="Add to wishlist"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-slate-200 p-8 dark:border-slate-800">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">
              Product Overview
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">
              {product.description}
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 p-8 dark:border-slate-800">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">
              Specifications
            </h2>

            <div className="mt-5 divide-y divide-slate-200 dark:divide-slate-800">
              {product.specifications.map((spec) => (
                <div
                  key={spec.key}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <span className="text-sm font-semibold text-slate-500">
                    {spec.key}
                  </span>

                  <span className="text-right text-sm font-bold text-slate-950 dark:text-white">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
