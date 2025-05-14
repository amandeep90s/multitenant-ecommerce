import { DEFAULT_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

interface TenantPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<SearchParams>;
}

export default async function TenantPage({
  params,
  searchParams,
}: TenantPageProps) {
  const { slug } = await params;
  const filters = await loadProductFilters(searchParams);
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      tenantSlug: slug,
      limit: DEFAULT_LIMIT,
    }),
  );

  // Dehydrate only once
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProductListView tenantSlug={slug} narrowView />
    </HydrationBoundary>
  );
}
