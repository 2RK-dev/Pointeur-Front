import { AppSidebar } from "@/components/sidebar-comp/app-sidebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
			<body className={inter.className}>
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
