import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
	return (
		<div className="flex flex-col flex-grow space-y-3">
			<Skeleton className="h-[200px] w-full rounded-xl" />
			<div className="space-y-2">
				<Skeleton className="h-6 w-full" />
				<Skeleton className="h-6 w-full" />
				<Skeleton className="h-6 w-full" />
				<Skeleton className="h-6 w-full" />
			</div>
		</div>
	);
}
