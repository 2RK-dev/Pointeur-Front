import { useSidebar } from "@/components/ui/sidebar";
import { Layers } from "lucide-react";

export function Logo() {
	const { state } = useSidebar();

	return (
		<div className="flex items-center gap-2 px-2 py-4">
			<Layers className="h-6 w-6 text-primary" />
			{state === "expanded" && (
				<span className="text-sm font-semibold">Système d'emploi du temp</span>
			)}
		</div>
	);
}
