"use client";

import {
	ArrowRightLeft,
	AudioWaveform,
	Book,
	Command,
	DoorClosed,
	GalleryVerticalEnd,
	GraduationCap, KeyRound,
	School,
} from "lucide-react";
import * as React from "react";

import { Logo } from "@/components/sidebar-comp/logo";
import { NavMain } from "@/components/sidebar-comp/nav-main";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { NavUser } from "@/components/sidebar-comp/nav-user";
import { useAuthStore } from "@/Stores/Auth";

const data = {
	user: {
		name: "Ryan Lai",
		email: "Ryan@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	teams: [
		{
			name: "Acme Inc",
			logo: GalleryVerticalEnd,
			plan: "Enterprise",
		},
		{
			name: "Acme Corp.",
			logo: AudioWaveform,
			plan: "Startup",
		},
		{
			name: "Evil Corp.",
			logo: Command,
			plan: "Free",
		},
	],
	navMain: [
		{
			title: "Planification",
			isActive: true,
			icon: School,
			items: [
				{
					title: "Emploi du temp",
					url: "/EDT",
				},
				{
					title: "Matière",
					icon: Book,
					url: "/TeachingUnit",
					access: "TeachingUnit",
				},
				{
					title: "Salle",
					icon: DoorClosed,
					url: "/Room",
					access: "matter_abr",
				},
			],
		},
		{
			title: "Resource Humaine",
			isActive: true,
			icon: School,
			items: [
				{
					title: "Professeur",
					icon: GraduationCap,
					url: "/Teacher",
					access: "matter_abr",
				},
				{
					title: "Niveau",
					icon: School,
					url: "/Level",
					access: "Matter",
				},
			],
		},
		{
			title: "Transfére de données",
			url: "/import-export",
			icon: ArrowRightLeft,
			access: "DataTransfere",
		},
		{
			title: "Clés d'accès API",
			url: "/Acces-Token",
			icon: KeyRound,
			access: "Acces-Token",
		}
	],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	userAccess: string[];
}

export function AppSidebar({ userAccess, ...props }: AppSidebarProps) {
    const {user} = useAuthStore();

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<Logo />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
            {user && (
                <SidebarFooter>
                    <NavUser user={{name: user.username, avatar: "/avatars/shadcn.jpg"}}/>
                </SidebarFooter>
            )}
			<SidebarRail />
		</Sidebar>
	);
}
