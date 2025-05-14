import { DEFAULT_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<SearchParams>;
}

export default async function Category({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;
  const filters = await loadProductFilters(searchParams);
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      category,
      limit: DEFAULT_LIMIT,
    }),
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProductListView category={category} />
    </HydrationBoundary>
  );
}
