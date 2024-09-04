import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface props {
	children: React.ReactNode;
	message: string;
	className?: string;
}

export default function MyTooltip({ children, message, className }: props) {
	return (
		<TooltipProvider>
			<Tooltip>
				<div className="flex items-center justify-center w-full">
					<TooltipTrigger asChild>{children}</TooltipTrigger>
					<TooltipContent side="right" className={className}>
						<p>{message}</p>
					</TooltipContent>
				</div>
			</Tooltip>
		</TooltipProvider>
	);
}
