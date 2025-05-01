import { Footer } from "@/components/core/footer";
import { Navbar } from "@/components/core/navbar";
import { SearchFilters, SearchFiltersSkeleton } from "@/components/core/search-filters";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Suspense fallback={<SearchFiltersSkeleton />}>
					<SearchFilters />
				</Suspense>
			</HydrationBoundary>
			<div className="flex-1 bg-[#f4f4f0]">{children}</div>
			<Footer />
		</div>
	);
};

export default Layout;
