export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface ProductVariant {
  color: {
    name: string;
    hexCode: string;
  };
  size: string;
  sku: string;
  price: number;
  stock: number;
  images: ProductImage[];
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  brand?: string;
  basePrice: number;
  discountPrice?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  tags: string[];
  rating: number;
  reviewCount: number;
  totalSold: number;
  isFeatured: boolean;
  status: "active" | "inactive" | "draft";
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}