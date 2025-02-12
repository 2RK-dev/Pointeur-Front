import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface MatterTableProps {
	MatterList: Matter[];
}

export default function MatterTable({ MatterList }: MatterTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>ID</TableHead>
					<TableHead>Désignation</TableHead>
					<TableHead>Abréviation</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{MatterList.map((Matter, index) => (
					<TableRow key={index}>
						<TableCell>{index}</TableCell>
						<TableCell>{Matter.name}</TableCell>
						<TableCell>{Matter.Abr_Matter}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
