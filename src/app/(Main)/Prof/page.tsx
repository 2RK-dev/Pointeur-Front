"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getTeacher } from "@/server/Teacher";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
	const [teachers, setTeachers] = useState<Teacher[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const data = await getTeacher();
			setTeachers(data);
		};
		fetchData();
	}, []);

	const handleExportPDF = () => {
		const doc = new jsPDF();
		autoTable(doc, {
			head: [["Nom", "Abréviation"]],
			body: teachers.map((teacher) => [teacher.name, teacher.Abr_Teacher]),
		});
		doc.save("liste_des_salles.pdf");
	};

	return (
		<div className="container mx-auto p-4 bg-gray-50 min-h-screen">
			<Card className="mb-8">
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="text-3xl font-bold text-gray-800">
						Liste des Enseignants
					</CardTitle>
					<div className="flex space-x-2">
						<Button variant="outline" onClick={handleExportPDF}>
							<FileDown className="mr-2 h-4 w-4" /> Exporter en PDF
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Nom</TableHead>
								<TableHead>Abréviation</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{teachers.map((teacher, index) => (
								<TableRow key={index}>
									<TableCell>{index + 1}</TableCell>
									<TableCell>{teacher.name}</TableCell>
									<TableCell>{teacher.Abr_Teacher}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
