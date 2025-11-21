import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";

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
                <AuthProvider>
                    {children}
                </AuthProvider>
			</body>
		</html>
	);
}
