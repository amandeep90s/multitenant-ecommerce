import { Footer } from "@/components/core/footer";
import { Navbar } from "@/components/core/navbar";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<div className="flex-1 bg-[#f4f4f0]">{children}</div>
			<Footer />
		</div>
	);
};

export default Layout;
