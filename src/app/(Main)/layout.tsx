"use client";
import { useState } from "react";
import {Toaster} from "sonner";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div>
		<Toaster />
		{children}
	</div>;
}
