"use client";
import { Prof } from "@/app/model";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash } from "lucide-react";

const profs: Prof[] = [
	{
		Abr_Prof: "CYP",
		Nom_Prof: "Mr Cyprien",
	},
	{
		Abr_Prof: "RAL",
		Nom_Prof: "Mr Ralaivao",
	},
	{
		Abr_Prof: "LEA",
		Nom_Prof: "Mme Léa",
	},
	{
		Abr_Prof: "HAJ",
		Nom_Prof: "Mr Haja",
	},
	{
		Abr_Prof: "HJS",
		Nom_Prof: "Mr Hajarisena",
	},
	{
		Abr_Prof: "VOL",
		Nom_Prof: "Mme Volatiana",
	},
	{
		Abr_Prof: "THM",
		Nom_Prof: "Mr Thomas",
	},
];

export default function page() {
	const columns: ColumnDef<Prof>[] = [
		{
			accessorKey: "Abr_Prof",
			header: "Abréviation de l'enseignant",
		},
		{
			accessorKey: "Nom_Prof",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						Nom de l'enseignant
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
		},
		{
			id: "actions",
			header: () => {
				return (
					<div className="text-center">
						<p>Action</p>
					</div>
				);
			},
			cell: ({ row }) => {
				const prof: Prof = row.original;
				return (
					<div className="space-x-3 text-center">
						<Button className="bg-[#004085]" onClick={() => {}}>
							<Pencil />
						</Button>
						<Button variant="destructive" onClick={() => {}}>
							<Trash />
						</Button>
					</div>
				);
			},
		},
	];
	return (
		<div>
			<DataTable
				columns={columns}
				columnsRech="Nom_Prof"
				placeholderInput="Filter Nom..."
				data={profs}>
				<Button className="bg-[#004085]" onClick={() => {}}>
					Ajouter
				</Button>
			</DataTable>
		</div>
	);
}
