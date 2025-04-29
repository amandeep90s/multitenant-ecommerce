import { Footer } from "@/components/core/footer";
import { Navbar } from "@/components/core/navbar";
import { SearchFilters } from "@/components/core/search-filters";
import { Category } from "@/payload-types";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { CustomCategory } from "./types";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
	const payload = await getPayload({
		config: configPromise,
	});

	const data = await payload.find({
		collection: "categories",
		depth: 1, // Populate the subcategories, subcategories[0] will be of type Category
		pagination: false,
		where: {
			parent: { exists: false },
		},
		sort: ["name"],
	});

	// Because of depth 1, we are confident doc will be a type of Category
	const formattedData: CustomCategory[] = data.docs.map((doc) => ({
		...doc,
		subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({ ...(doc as Category), subcategories: undefined })),
	}));

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<SearchFilters data={formattedData} />
			<div className="flex-1 bg-[#f4f4f0]">{children}</div>
			<Footer />
		</div>
	);
};

export default Layout;
