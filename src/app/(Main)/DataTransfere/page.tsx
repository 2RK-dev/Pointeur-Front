"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown, FileUp } from "lucide-react";
import { useState } from "react";

const initialTables: string[] = [
	"Emploi du temp",
	"matter_abr",
	"Salle",
	"Etudiant",
	"Enseignant",
	"Niveau",
];

export default function Home() {
	const [tables, setTables] = useState<string[]>(initialTables);
	const [selectedExportTable, setSelectedExportTable] = useState<string>("");
	const [selectedExportFormat, setSelectedExportFormat] = useState<string>("");
	const [importFile, setImportFile] = useState<File | null>(null);
	const [selectedImportFormat, setSelectedImportFormat] = useState<string>("");
	const [selectedImportTable, setSelectedImportTable] = useState<string>("");
	const [deleteOldData, setDeleteOldData] = useState(false);

	const handleImport = () => {
		if (!importFile || !selectedImportFormat || !selectedImportTable) {
			alert(
				"Veuillez sélectionner un fichier, un format et une table cible pour l'importation."
			);
			return;
		}

		// Ici, vous implémenteriez la logique réelle d'importation.
		// Pour cet exemple, nous allons simplement simuler une importation réussie.
		alert(
			`Importation simulée pour la table ${selectedImportTable} au format ${selectedImportFormat}. Suppression des anciennes données : ${deleteOldData}`
		);
	};

	const handleExport = () => {
		if (!selectedExportTable || !selectedExportFormat) {
			alert("Veuillez sélectionner une table et un format d'exportation.");
			return;
		}

		// Ici, vous implémenteriez la logique réelle d'exportation.
		// Pour cet exemple, nous allons simplement simuler une exportation réussie.
		alert(
			`Exportation simulée de la table ${selectedExportTable} au format ${selectedExportFormat}`
		);
	};

	return (
		<div className="container mx-auto p-4 bg-gray-50 min-h-screen">
			<Card className="mb-8">
				<CardHeader></CardHeader>
				<CardContent>
					<Tabs defaultValue="import" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="import">Importation</TabsTrigger>
							<TabsTrigger value="export">Exportation</TabsTrigger>
						</TabsList>
						<TabsContent value="import">
							<div className="flex flex-col space-y-4 mt-4">
								<div className="flex items-center space-x-2">
									<Input
										type="file"
										onChange={(e) => setImportFile(e.target.files?.[0] || null)}
										className="max-w-xs"
									/>
									<Select onValueChange={setSelectedImportFormat}>
										<SelectTrigger className="w-[180px]">
											<SelectValue placeholder="Format d'import" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="json">JSON</SelectItem>
											<SelectItem value="csv">CSV</SelectItem>
											<SelectItem value="excel">Excel</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<Select onValueChange={setSelectedImportTable}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Table cible" />
									</SelectTrigger>
									<SelectContent>
										{tables.map((table) => (
											<SelectItem key={table} value={table}>
												{table}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<div className="flex items-center space-x-2">
									<Checkbox
										id="deleteOldData"
										checked={deleteOldData}
										onCheckedChange={(checked) =>
											setDeleteOldData(checked as boolean)
										}
									/>
									<Label htmlFor="deleteOldData">
										Supprimer les anciennes données
									</Label>
								</div>
								<Button
									onClick={handleImport}
									disabled={
										!importFile || !selectedImportFormat || !selectedImportTable
									}>
									<FileUp className="mr-2 h-4 w-4" /> Importer
								</Button>
							</div>
						</TabsContent>
						<TabsContent value="export">
							<div className="flex items-center space-x-2 mt-4">
								<Select onValueChange={setSelectedExportTable}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Sélectionner une table" />
									</SelectTrigger>
									<SelectContent>
										{tables.map((table) => (
											<SelectItem key={table} value={table}>
												{table}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Select onValueChange={setSelectedExportFormat}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Format d'exportation" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="json">JSON</SelectItem>
										<SelectItem value="csv">CSV</SelectItem>
										<SelectItem value="excel">Excel</SelectItem>
									</SelectContent>
								</Select>
								<Button
									onClick={handleExport}
									disabled={!selectedExportTable || !selectedExportFormat}>
									<FileDown className="mr-2 h-4 w-4" /> Exporter
								</Button>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
