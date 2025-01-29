"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import {
	Book,
	Calendar,
	FileDown,
	Filter,
	GraduationCap,
	Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { presencesData, type Presence } from "./presences";

const joursDelaSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const niveaux = ["L1", "L2", "L3", "M1", "M2"];

interface GroupedPresences {
	niveau: string;
	matiere: string;
	horaire: string;
	presents: Presence[];
	absents: Presence[];
	retards: Presence[];
}

export default function VerificationPresencePeriode() {
	const [selectedSemaine, setSelectedSemaine] = useState<string>("");
	const [selectedJour, setSelectedJour] = useState<string>("");
	const [selectedNiveau, setSelectedNiveau] = useState<string>("");
	const [selectedMatiere, setSelectedMatiere] = useState<string>("");
	const [selectedStatut, setSelectedStatut] = useState<string>("tous");
	const [resultatPresences, setResultatPresences] = useState<
		GroupedPresences[]
	>([]);

	const presencesFiltrees = useMemo(() => {
		return presencesData.filter(
			(p) =>
				(!selectedSemaine || p.semaine === Number.parseInt(selectedSemaine)) &&
				(!selectedJour || p.jour === selectedJour) &&
				(!selectedNiveau || p.niveau === selectedNiveau) &&
				(!selectedMatiere || selectedMatiere.startsWith(p.matiere))
		);
	}, [selectedSemaine, selectedJour, selectedNiveau, selectedMatiere]);

	const matieresDisponibles = useMemo(() => {
		const matieresMap = new Map<string, Set<string>>();
		presencesFiltrees.forEach((p) => {
			if (!matieresMap.has(p.matiere)) {
				matieresMap.set(p.matiere, new Set());
			}
			matieresMap.get(p.matiere)!.add(`${p.heureDebut}-${p.heureFin}`);
		});
		return Array.from(matieresMap.entries()).map(
			([matiere, horaires]) => `${matiere} (${Array.from(horaires).join(", ")})`
		);
	}, [presencesFiltrees]);

	useEffect(() => {
		setSelectedMatiere("");
	}, [selectedNiveau, selectedJour]); //Fixed useEffect dependency

	const filtrerPresences = () => {
		const groupedPresences = new Map<string, GroupedPresences>();

		presencesFiltrees.forEach((presence) => {
			const key = `${presence.niveau}-${presence.matiere}-${presence.heureDebut}-${presence.heureFin}`;

			if (!groupedPresences.has(key)) {
				groupedPresences.set(key, {
					niveau: presence.niveau,
					matiere: presence.matiere,
					horaire: `${presence.heureDebut}-${presence.heureFin}`,
					presents: [],
					absents: [],
					retards: [],
				});
			}

			const group = groupedPresences.get(key)!;
			if (presence.statut === "present") {
				group.presents.push(presence);
			} else if (presence.statut === "absent") {
				group.absents.push(presence);
			} else {
				group.retards.push(presence);
			}
		});

		setResultatPresences(Array.from(groupedPresences.values()));
	};

	const exportToPDF = () => {
		const doc = new jsPDF();

		doc.text(
			`Présences - ${selectedNiveau} - ${selectedJour} - Semaine ${selectedSemaine}`,
			14,
			15
		);

		const rows: string[][] = [];
		resultatPresences.forEach((groupe) => {
			if (selectedStatut === "tous" || selectedStatut === "present") {
				groupe.presents.forEach((p) => {
					rows.push([
						p.matricule,
						p.nom,
						p.niveau,
						p.matiere,
						groupe.horaire,
						"Présent",
					]);
				});
			}
			if (selectedStatut === "tous" || selectedStatut === "absent") {
				groupe.absents.forEach((p) => {
					rows.push([
						p.matricule,
						p.nom,
						p.niveau,
						p.matiere,
						groupe.horaire,
						"Absent",
					]);
				});
			}
			if (selectedStatut === "tous" || selectedStatut === "retard") {
				groupe.retards.forEach((p) => {
					rows.push([
						p.matricule,
						p.nom,
						p.niveau,
						p.matiere,
						groupe.horaire,
						"En retard",
					]);
				});
			}
		});

		autoTable(doc, {
			head: [["Matricule", "Nom", "Niveau", "Matière", "Horaire", "Statut"]],
			body: rows,
			startY: 25,
		});

		doc.save("presences.pdf");
	};

	return (
		<Card className="w-full max-w-4xl mx-auto mt-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl font-bold text-center">
					Vérification des présences
				</CardTitle>
				<p className="text-center text-gray-500 dark:text-gray-400">
					Sélectionnez une période pour voir les présences
				</p>
			</CardHeader>
			<CardContent className="grid gap-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label
							htmlFor="semaine-select"
							className="flex items-center space-x-2">
							<Calendar className="w-4 h-4" />
							<span>Semaine</span>
						</Label>
						<Select onValueChange={setSelectedSemaine}>
							<SelectTrigger id="semaine-select">
								<SelectValue placeholder="Sélectionner une semaine" />
							</SelectTrigger>
							<SelectContent>
								{Array.from({ length: 52 }, (_, i) => i + 1).map((semaine) => (
									<SelectItem key={semaine} value={semaine.toString()}>
										Semaine {semaine}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label
							htmlFor="jour-select"
							className="flex items-center space-x-2">
							<Calendar className="w-4 h-4" />
							<span>Jour</span>
						</Label>
						<Select onValueChange={setSelectedJour}>
							<SelectTrigger id="jour-select">
								<SelectValue placeholder="Sélectionner un jour" />
							</SelectTrigger>
							<SelectContent>
								{joursDelaSemaine.map((jour) => (
									<SelectItem key={jour} value={jour}>
										{jour}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="space-y-2">
					<Label
						htmlFor="niveau-select"
						className="flex items-center space-x-2">
						<GraduationCap className="w-4 h-4" />
						<span>Niveau</span>
					</Label>
					<Select onValueChange={setSelectedNiveau}>
						<SelectTrigger id="niveau-select">
							<SelectValue placeholder="Sélectionner un niveau" />
						</SelectTrigger>
						<SelectContent>
							{niveaux.map((niveau) => (
								<SelectItem key={niveau} value={niveau}>
									{niveau}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label
						htmlFor="matiere-select"
						className="flex items-center space-x-2">
						<Book className="w-4 h-4" />
						<span>Matière</span>
					</Label>
					<Select
						onValueChange={setSelectedMatiere}
						disabled={!selectedNiveau || !selectedJour}>
						<SelectTrigger id="matiere-select">
							<SelectValue
								placeholder={
									!selectedNiveau || !selectedJour
										? "Sélectionnez d'abord un niveau et un jour"
										: "Sélectionner une matière"
								}
							/>
						</SelectTrigger>
						<SelectContent>
							{matieresDisponibles.map((matiere) => (
								<SelectItem key={matiere} value={matiere}>
									{matiere}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label
						htmlFor="statut-select"
						className="flex items-center space-x-2">
						<Filter className="w-4 h-4" />
						<span>Filtrer par statut</span>
					</Label>
					<Select onValueChange={setSelectedStatut}>
						<SelectTrigger id="statut-select">
							<SelectValue placeholder="Filtrer par statut" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="tous">Tous</SelectItem>
							<SelectItem value="present">Présents</SelectItem>
							<SelectItem value="absent">Absents</SelectItem>
							<SelectItem value="retard">En retard</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Button
					onClick={filtrerPresences}
					className="w-full"
					disabled={!selectedMatiere}>
					<Users className="w-4 h-4 mr-2" />
					Afficher les présences
				</Button>
				{resultatPresences.length > 0 && (
					<>
						<ScrollArea className="h-[400px] w-full rounded-md border">
							{resultatPresences.map((groupe, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: index * 0.1 }}
									className="p-4 border-b last:border-b-0">
									<h3 className="text-lg font-semibold mb-4">
										{groupe.niveau} - {groupe.matiere} ({groupe.horaire})
									</h3>
									{(selectedStatut === "tous" ||
										selectedStatut === "present") && (
										<div className="mb-4">
											<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
												Présents:
											</h4>
											<div className="flex flex-wrap gap-2">
												{groupe.presents.map((presence, i) => (
													<Badge
														key={i}
														variant="secondary"
														className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
														{presence.nom}
													</Badge>
												))}
											</div>
										</div>
									)}
									{(selectedStatut === "tous" ||
										selectedStatut === "absent") && (
										<div className="mb-4">
											<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
												Absents:
											</h4>
											<div className="flex flex-wrap gap-2">
												{groupe.absents.map((presence, i) => (
													<Badge
														key={i}
														variant="secondary"
														className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
														{presence.nom}
													</Badge>
												))}
											</div>
										</div>
									)}
									{(selectedStatut === "tous" ||
										selectedStatut === "retard") && (
										<div className="mb-4">
											<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
												En retard:
											</h4>
											<div className="flex flex-wrap gap-2">
												{groupe.retards.map((presence, i) => (
													<Badge
														key={i}
														variant="secondary"
														className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
														{presence.nom}
													</Badge>
												))}
											</div>
										</div>
									)}
								</motion.div>
							))}
						</ScrollArea>
						<Button onClick={exportToPDF} className="w-full">
							<FileDown className="w-4 h-4 mr-2" />
							Exporter en PDF
						</Button>
					</>
				)}
			</CardContent>
		</Card>
	);
}
