"use client";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronRight, LucideIcon } from "lucide-react";
import Link from "next/link";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url?: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	return (
		<TooltipProvider>
			<SidebarGroup>
				<SidebarGroupLabel>Menu</SidebarGroupLabel>
				<SidebarMenu className="space-y-2">
					{items.map((item) =>
						item.url ? (
							<Tooltip key={item.title}>
								<TooltipTrigger asChild>
									<SidebarMenuItem>
										<SidebarMenuButton
											asChild
											className={cn(
												"relative overflow-hidden",
												"before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary before:opacity-0 before:transition-opacity",
												"hover:before:opacity-100"
											)}>
											<Link href={item.url}>
												{item.icon && <item.icon />}
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</TooltipTrigger>
								<TooltipContent
									side="right"
									align="center"
									className="flex flex-col items-start p-2 rounded-lg bg-gradient-to-br from-primary/80 to-primary shadow-lg">
									<motion.span
										initial={{ opacity: 0, y: -5 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.2 }}
										className="text-white font-medium">
										{item.title}
									</motion.span>
								</TooltipContent>
							</Tooltip>
						) : (
							<Tooltip key={item.title}>
								<TooltipTrigger asChild>
									<Collapsible
										asChild
										defaultOpen={item.isActive}
										className="group/collapsible">
										<SidebarMenuItem>
											<CollapsibleTrigger asChild>
												<SidebarMenuButton
													className={cn(
														"relative overflow-hidden",
														"before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary before:opacity-0 before:transition-opacity",
														"hover:before:opacity-100"
													)}>
													{item.icon && <item.icon />}
													<span>{item.title}</span>
													<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
												</SidebarMenuButton>
											</CollapsibleTrigger>
											<CollapsibleContent>
												<SidebarMenuSub>
													{item.items?.map((subItem) => (
														<SidebarMenuSubItem key={subItem.title}>
															<SidebarMenuSubButton asChild>
																<Link href={subItem.url}>
																	<span>{subItem.title}</span>
																</Link>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													))}
												</SidebarMenuSub>
											</CollapsibleContent>
										</SidebarMenuItem>
									</Collapsible>
								</TooltipTrigger>
								<TooltipContent
									side="right"
									align="center"
									className="flex flex-col items-start p-3 rounded-lg bg-gradient-to-br from-primary/80 to-primary shadow-lg">
									<motion.span
										initial={{ opacity: 0, y: -5 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.2 }}
										className="text-white font-semibold mb-2">
										{item.title}
									</motion.span>
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.1, duration: 0.2 }}
										className="flex flex-col gap-1">
										{item.items?.map((subItem) => (
											<Link
												key={subItem.title}
												href={subItem.url}
												className="text-sm text-white/90 hover:text-white hover:underline transition-colors">
												{subItem.title}
											</Link>
										))}
									</motion.div>
								</TooltipContent>
							</Tooltip>
						)
					)}
				</SidebarMenu>
			</SidebarGroup>
		</TooltipProvider>
	);
}
