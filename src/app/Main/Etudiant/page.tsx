"use client";

import { LoadingComponent } from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";

export default function EtudiantsComponent() {
	const [isLoading, setIsLoading] = useState(true);
	const [etudiants, setEtudiants] = useState<any[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalType, setModalType] = useState<"edit" | "add">("add");
	const [selectedEtudiant, setSelectedEtudiant] = useState<any>(null);
	const [formData, setFormData] = useState({
		MATRICULE: "",
		NOM: "",
		DESIGNATION_NIVEAU: "",
	});
	const { toast } = useToast();

	useEffect(() => {
		fetchEtudiants();
	}, []);

	const fetchEtudiants = async () => {
		setIsLoading(true);
		try {
			const res = await axios.get("http://localhost:3001/Eleve");
			setEtudiants(res.data.eleves);
		} catch (error) {
			toast({
				title: "Erreur",
				description: "Impossible de récupérer les étudiants.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (Matricule: any) => {
		try {
			await axios.delete(`http://localhost:3001/Eleve/Delete/${Matricule}`);
			setEtudiants((prevEtudiants) =>
				prevEtudiants.filter(
					(etudiant: any) => etudiant.MATRICULE !== Matricule
				)
			);
			toast({
				title: "Suppression réussie",
				description: `L'étudiant avec le matricule ${Matricule} a été supprimé.`,
			});
		} catch (error) {
			toast({
				title: "Erreur",
				description: "Impossible de supprimer l'étudiant.",
			});
		}
	};

	const handleEdit = (etudiant: any) => {
		setModalType("edit");
		setSelectedEtudiant(etudiant);
		setFormData(etudiant);
		setIsModalOpen(true);
	};

	const handleAdd = () => {
		setModalType("add");
		setSelectedEtudiant(null);
		setFormData({ MATRICULE: "", NOM: "", DESIGNATION_NIVEAU: "" });
		setIsModalOpen(true);
	};

	const handleSubmit = async () => {
		try {
			if (modalType === "edit") {
				await axios.put(
					`http://localhost:3001/Eleve/Update/${formData.MATRICULE}`,
					formData
				);
				setEtudiants((prevEtudiants) =>
					prevEtudiants.map((etudiant) =>
						etudiant.MATRICULE === formData.MATRICULE ? formData : etudiant
					)
				);
				toast({
					title: "Modification réussie",
					description: `L'étudiant ${formData.NOM} a été modifié.`,
				});
			} else {
				await axios.post("http://localhost:3001/Eleve/Add", formData);
				setEtudiants((prevEtudiants) => [...prevEtudiants, formData]);
				toast({
					title: "Ajout réussi",
					description: `L'étudiant ${formData.NOM} a été ajouté.`,
				});
			}
			setIsModalOpen(false);
		} catch (error) {
			toast({
				title: "Erreur",
				description: "Une erreur est survenue lors de l'opération.",
			});
		}
	};

	const filteredEtudiants = etudiants.filter((etudiant) =>
		Object.values(etudiant)
			.join(" ")
			.toLowerCase()
			.includes(searchQuery.toLowerCase())
	);

	return (
		<div className="container mx-auto p-4">
			<Card>
				<CardHeader>
					<CardTitle>Liste des Étudiants</CardTitle>
					<CardDescription>
						Gérez les étudiants enregistrés dans le système
					</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Bouton Ajouter */}
					<div className="flex justify-between mb-4">
						<input
							type="text"
							className="w-full p-2 border border-gray-300 rounded"
							placeholder="Rechercher..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<Button className="ml-4" onClick={handleAdd}>
							Ajouter un étudiant
						</Button>
					</div>

					{isLoading ? (
						<LoadingComponent />
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Matricule</TableHead>
									<TableHead>Nom</TableHead>
									<TableHead>Classe</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredEtudiants.map((etudiant: any) => (
									<TableRow key={etudiant.MATRICULE}>
										<TableCell>{etudiant.MATRICULE}</TableCell>
										<TableCell>{etudiant.NOM}</TableCell>
										<TableCell>{etudiant.DESIGNATION_NIVEAU}</TableCell>
										<TableCell>
											<Button
												variant="outline"
												onClick={() => handleDelete(etudiant.MATRICULE)}>
												Supprimer
											</Button>
											<Button
												variant="outline"
												className="ml-2"
												onClick={() => handleEdit(etudiant)}>
												Modifier
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Modal */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{modalType === "edit"
								? "Modifier l'étudiant"
								: "Ajouter un étudiant"}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<Input
							placeholder="Matricule"
							value={formData.MATRICULE}
							onChange={(e) =>
								setFormData({ ...formData, MATRICULE: e.target.value })
							}
							disabled={modalType === "edit"}
						/>
						<Input
							placeholder="Nom"
							value={formData.NOM}
							onChange={(e) =>
								setFormData({ ...formData, NOM: e.target.value })
							}
						/>
						<Input
							placeholder="Classe"
							value={formData.DESIGNATION_NIVEAU}
							onChange={(e) =>
								setFormData({
									...formData,
									DESIGNATION_NIVEAU: e.target.value,
								})
							}
						/>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsModalOpen(false)}>
							Annuler
						</Button>
						<Button onClick={handleSubmit}>Confirmer</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
