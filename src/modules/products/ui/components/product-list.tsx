"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface ProductListProps {
  category?: string;
}

export const ProductList = ({ category }: ProductListProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({ category }),
  );

  return <div>{JSON.stringify(data, null, 2)}</div>;
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
