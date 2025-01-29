import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
	return (
		<div className="flex flex-col space-y-4 h-full w-full">
			<div className="flex flex-row space-x-2 w-full h-[50px]">
				<Skeleton className="h-full w-[250px]" />

				<Skeleton className="h-full w-[380px]" />
			</div>
			<div className="flex flex-col p-4 h-full w-full rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="space-y-4 flex flex-col h-full">
					<Skeleton className="h-full w-full" />
				</div>
			</div>
		</div>
	);
}
