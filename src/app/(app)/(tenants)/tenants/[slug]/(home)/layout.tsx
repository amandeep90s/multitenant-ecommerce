import { Footer } from "@/modules/tenants/ui/components/footer";
import { Navbar, NavbarSkeleton } from "@/modules/tenants/ui/components/navbar";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

const Layout = async ({ children, params }: LayoutProps) => {
  const { slug } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({ slug }));

  // Dehydrate only once
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f4f0]">
      <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar slug={slug} />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1">
        <div className="mx-auto max-w-(-breakpoint-xl)">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
