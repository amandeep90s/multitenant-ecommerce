import {
  ProductList,
  ProductListSkeleton,
} from "@/modules/products/ui/components/product-list";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function Category({ params }: CategoryPageProps) {
  const { category } = await params;
  const queryClient = getQueryClient();
  queryClient.prefetchQuery(trpc.products.getMany.queryOptions({ category }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList category={category} />
      </Suspense>
    </HydrationBoundary>
  );
}
