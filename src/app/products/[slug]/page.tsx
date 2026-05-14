import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/product/product-details";
import { PublicLayout } from "@/components/layout/public-layout";
import { Product } from "@/types/product";
import { RecommendedProducts } from "@/components/product/recommended-products";

interface ProductDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const res = await fetch(`${apiUrl}/products/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    return data.product;
  } catch {
    return null;
  }
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <PublicLayout>
      <ProductDetails product={product} />
      <RecommendedProducts
        currentProductId={product._id}
        category={product.category}
      />
    </PublicLayout>
  );
}
