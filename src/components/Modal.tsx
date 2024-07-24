import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";

interface Modalprops {
	children?: React.ReactNode;
	TitleModal?: string;
	TitleBtn?: string;
	isopen: boolean;
	setopen: Dispatch<SetStateAction<boolean>>;
	Description?: string;
}

export default function Modal({
	children,
	TitleModal,
	TitleBtn,
	isopen,
	setopen,
	Description,
}: Modalprops) {
	return (
		<Dialog open={isopen} onOpenChange={setopen}>
			<DialogTrigger asChild></DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{TitleModal}</DialogTitle>
					<DialogDescription>{Description}</DialogDescription>
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	);
}
