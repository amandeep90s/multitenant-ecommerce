"use client";

import { useProductFilters } from "@/modules/products/hooks/use-product-filters";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductCard } from "./product-card";

interface ProductListProps {
  category?: string;
}

export const ProductList = ({ category }: ProductListProps) => {
  const [filters] = useProductFilters();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({ category, ...filters }),
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {data?.docs.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          imageUrl={product.image?.url}
          authorUsername="amandeep"
          authorImageUrl={undefined}
          reivewRating={3}
          reviewCount={6}
          price={product.price}
        />
      ))}
    </div>
  );
};

export const ProductListSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full h-8 bg-gray-200 rounded-md animate-pulse" />
      <div className="w-full h-8 bg-gray-200 rounded-md animate-pulse" />
      <div className="w-full h-8 bg-gray-200 rounded-md animate-pulse" />
    </div>
  );
};
