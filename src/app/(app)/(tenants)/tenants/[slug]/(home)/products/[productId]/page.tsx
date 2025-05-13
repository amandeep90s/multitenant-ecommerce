import { ProductView } from "@/modules/products/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface PageProps {
  params: Promise<{ productId: string; slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { productId, slug } = await params;
  const queryClient = getQueryClient();
  queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({ slug }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductView productId={productId} tenantSlug={slug} />
    </HydrationBoundary>
  );
}
