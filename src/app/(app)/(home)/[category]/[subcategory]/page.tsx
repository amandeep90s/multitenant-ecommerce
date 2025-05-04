import {
  ProductList,
  ProductListSkeleton,
} from "@/modules/products/ui/components/product-list";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface SubCategoryPageProps {
  params: Promise<{
    subcategory: string;
  }>;
}

export default async function SubCategory({ params }: SubCategoryPageProps) {
  const { subcategory } = await params;
  const queryClient = getQueryClient();
  queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({ category: subcategory }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList category={subcategory} />
      </Suspense>
    </HydrationBoundary>
  );
}
