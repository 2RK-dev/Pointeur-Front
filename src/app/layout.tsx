import { AppSidebar } from "@/components/app-sidebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import type { Metadata } from "next";
import Head from "next/head";
import "./globals.css";

export const metadata: Metadata = {
	title: "ENI",
	description: "Gestion de presence",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<Head>
				<title>ENI</title>
			</Head>
			<body className="font-sans">
				<SidebarProvider>
					<AppSidebar userAccess={[]} />
					<SidebarInset>
						<SidebarTrigger className="-ml-1" />
						{children}
					</SidebarInset>
				</SidebarProvider>
			</body>
		</html>
	);
}
