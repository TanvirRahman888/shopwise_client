import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage =
    product.images.find((image) => image.isPrimary)?.url ||
    product.images[0]?.url ||
    "/placeholder-product.png";

  const hoverImage = product.images[1]?.url || primaryImage;

  const price = product.discountPrice || product.basePrice;
  const hasDiscount = Boolean(product.discountPrice);

  const uniqueColors = Array.from(
    new Map(
      product.variants.map((variant) => [variant.color.name, variant.color]),
    ).values(),
  );

  return (
    <Card className="group flex h-full overflow-hidden rounded-3xl border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <CardContent className="flex h-full w-full flex-col p-0">
        <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
          {hasDiscount && (
            <span className="absolute left-4 top-4 z-10 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
              Sale
            </span>
          )}

          <button className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition hover:text-rose-500 dark:bg-slate-950 dark:text-slate-300">
            <Heart className="h-4 w-4" />
          </button>

          <Image
            src={primaryImage}
            alt={product.title}
            fill
            className="object-cover transition duration-500 group-hover:opacity-0"
            sizes="(max-width: 768px) 100vw, 25vw"
          />

          <Image
            src={hoverImage}
            alt={product.title}
            fill
            className="object-cover opacity-0 transition duration-500 group-hover:opacity-100"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {product.category}
            </span>

            <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              {product.rating || 0}
            </div>
          </div>

          <h3 className="line-clamp-1 text-base font-bold text-slate-950 dark:text-white">
            {product.title}
          </h3>

          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500 dark:text-slate-400">
            {product.shortDescription}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-lg font-black text-slate-950 dark:text-white">
              ${price.toFixed(2)}
            </span>

            {hasDiscount && (
              <span className="text-sm font-semibold text-slate-400 line-through">
                ${product.basePrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            {uniqueColors.slice(0, 4).map((color) => (
              <span
                key={color.name}
                title={color.name}
                className="h-5 w-5 rounded-full border border-slate-200 dark:border-slate-700"
                style={{ backgroundColor: color.hexCode }}
              />
            ))}

            {uniqueColors.length > 4 && (
              <span className="text-xs font-semibold text-slate-500">
                +{uniqueColors.length - 4}
              </span>
            )}
          </div>

          <div className="mt-auto flex gap-2 pt-5">
            <Button asChild variant="outline" className="flex-1 rounded-full">
              <Link href={`/products/${product.slug}`} prefetch={false}>
                View Details
              </Link>
            </Button>

            <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700">
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
