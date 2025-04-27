"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["700"],
});

interface NavbarItemProps {
	href: string;
	children: React.ReactNode;
	isActive?: boolean;
}

const NavbarItem = ({ href, children, isActive }: NavbarItemProps) => {
	return (
		<Button
			asChild
			variant={"outline"}
			className={cn(
				"bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",
				isActive && "bg-black text-white hover:bg-black hover:text-white"
			)}
		>
			<Link href={href}>{children}</Link>
		</Button>
	);
};

const navbarItems = [
	{ href: "/", label: "Home", isActive: true },
	{ href: "/about", label: "About" },
	{ href: "/features", label: "Features" },
	{ href: "/pricing", label: "Pricing" },
	{ href: "/contact", label: "Contact" },
];

export const Navbar = () => {
	const currentPath = usePathname();

	return (
		<nav className="h-20 flex border-b justify-between font-medium bg-white">
			<Link className="pl-6 flex items-center" href="/">
				<span className={cn("text-5xl font-semibold", poppins.className)}>funRoad</span>
			</Link>

			<div className="items-center gap-4 hidden lg:flex">
				{navbarItems.map((item) => (
					<NavbarItem key={item.href} href={item.href} isActive={item.href === currentPath}>
						{item.label}
					</NavbarItem>
				))}
			</div>

			<div className="hidden lg:flex">
				<Button
					asChild
					variant={"secondary"}
					className="border-l border-t-0 border-b-0 border-r-0 px-12 rounded-none bg-white h-full hover:bg-pink-400 transition-colors text-lg"
				>
					<Link href="/sign-in">Log in</Link>
				</Button>
				<Button
					asChild
					className="border-l border-t-0 border-b-0 border-r-0 px-12 rounded-none bg-black text-white h-full hover:bg-pink-400 hover:text-black transition-colors text-lg"
				>
					<Link href="/sign-up">Start Selling</Link>
				</Button>
			</div>
		</nav>
	);
};
