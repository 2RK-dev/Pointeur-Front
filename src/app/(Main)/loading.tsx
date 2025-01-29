import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
	return (
		<div className="space-y-4 w-full">
			<div className="flex flex-col lg:flex-row w-full lg:space-x-4 space-y-4 lg:space-y-0">
				<Skeleton className="w-full lg:w-[400px] h-[350px] space-y-4" />

				<Skeleton className="space-y-4 h-[350px] flex flex-col flex-grow justify-center items-center" />
			</div>
			<div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
				<Skeleton className="w-full lg:w-[600px] h-[550px]" />

				<Skeleton className="flex flex-grow flex-col h-[550px]" />
			</div>
		</div>
	);
}
