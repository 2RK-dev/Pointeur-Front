import React from "react";
import {
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
interface formItemprops {
	children?: React.ReactNode;
	label?: string;
	Description?: string;
}
export default function Form_Item({
	children,
	label,
	Description,
}: formItemprops) {
	return (
		<FormItem>
			<FormLabel>{label}</FormLabel>
			<FormControl>{children}</FormControl>
			<FormDescription>{Description}</FormDescription>
			<FormMessage />
		</FormItem>
	);
}
