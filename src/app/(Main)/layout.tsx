"use client";
import { Toaster } from "sonner";
import { AppSidebar } from "@/components/sidebar-comp/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
    return <SidebarProvider>
        <AppSidebar userAccess={[]}/>
        <SidebarInset>
            <SidebarTrigger className="ml-4 mt-4 border border-gray-200 rounded-md "/>
            <div>
                <Toaster/>
                {children}
            </div>
        </SidebarInset>
    </SidebarProvider>;
}
