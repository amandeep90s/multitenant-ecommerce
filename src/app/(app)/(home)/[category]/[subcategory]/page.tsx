import { DEFAULT_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";

interface SubCategoryPageProps {
  params: Promise<{
    subcategory: string;
  }>;
  searchParams: Promise<SearchParams>;
}

export default async function SubCategory({
  params,
  searchParams,
}: SubCategoryPageProps) {
  const { subcategory } = await params;
  const filters = await loadProductFilters(searchParams);
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      category: subcategory,
      limit: DEFAULT_LIMIT,
    }),
  );

  // Dehydrate only once
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProductListView category={subcategory} />
    </HydrationBoundary>
  );
}
