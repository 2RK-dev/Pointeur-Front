import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface MyCardProps {
	title: string;
	description?: string;
	children?: React.ReactNode;
	className?: string;
}

export function MyCard({
	children,
	className,
	title,
	description,
}: MyCardProps) {
	return (
		<Card className={className}>
			<CardHeader className="h-1/6">
				<CardTitle className="text-center">{title}</CardTitle>
				<CardDescription className="text-center">{description}</CardDescription>
			</CardHeader>
			<CardContent className="h-5/6">{children}</CardContent>
		</Card>
	);
}
