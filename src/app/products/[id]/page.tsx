import { ProductDetails } from "@/components/product/product-details";
import { PublicLayout } from "@/components/layout/public-layout";
import { Product } from "@/types/product";
import { notFound } from "next/navigation";

interface ProductDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const res = await fetch(`${apiUrl}/products/${id}`, {
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
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <PublicLayout>
      <ProductDetails product={product} />
    </PublicLayout>
  );
}