"use client";

import {
	ArrowRightLeft,
	AudioWaveform,
	Book,
	Command,
	DoorClosed,
	Frown,
	GalleryVerticalEnd,
	GraduationCap,
	Layers,
	School,
	Settings2,
	UserRound,
} from "lucide-react";
import * as React from "react";

import { Logo } from "@/components/logo";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
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
			title: "Tableau de bord",
			url: "http://localhost:4444/Main",
			icon: Layers,
			access: "Dashboard",
		},
		{
			title: "Absence",
			icon: Frown,
			url: "http://localhost:4444/Main/Abs",
			access: "Abs",
		},
		{
			title: "Planification",
			isActive: true,
			icon: School,
			items: [
				{
					title: "Emploi du temp",
					url: "http://localhost:4444/Main/EDT",
				},
				{
					title: "UE",
					icon: Book,
					url: "http://localhost:4444/Main/UE",
					access: "UE",
				},
				{
					title: "Salle",
					icon: DoorClosed,
					url: "http://localhost:4444/Main/Salle",
					access: "UE",
				},
			],
		},
		{
			title: "Resource Humaine",
			isActive: true,
			icon: School,
			items: [
				{
					title: "Etudiant",
					icon: UserRound,
					url: "http://localhost:4444/Main/Etudiant",
					access: "UE",
				},
				{
					title: "Professeur",
					icon: GraduationCap,
					url: "http://localhost:4444/Main/Prof",
					access: "UE",
				},
				{
					title: "Niveau",
					icon: School,
					url: "http://localhost:4444/Main/Level",
					access: "UE",
				},
			],
		},
		{
			title: "Transfére de données",
			url: "http://localhost:4444/Main/Setting",
			icon: ArrowRightLeft,
			access: "DataTransfere",
		},

		{
			title: "Paramétre",
			url: "http://localhost:4444/Main/Setting",
			icon: Settings2,
			access: "Setting",
		},
	],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	userAccess: string[];
}

export function AppSidebar({ userAccess, ...props }: AppSidebarProps) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<Logo />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
