"use client";

import LoadingModal from "@/components/LoadingModal"; // Importation du modal de chargement
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
	DialogDescription,
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
import { Plus, Trash } from "lucide-react"; // Importation des icônes Lucide
import { useEffect, useState } from "react";

export default function MatieresComponent() {
	const [isLoading, setIsLoading] = useState(false);
	const [matieres, setMatieres] = useState<any[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalType, setModalType] = useState<"edit" | "add">("add");
	const [selectedMatiere, setSelectedMatiere] = useState<any>(null);
	const [formData, setFormData] = useState({
		ABR_UE: "",
		DESIGNATION_UE: "",
	});
	const { toast } = useToast();

	useEffect(() => {
		fetchMatieres();
	}, []);

	const fetchMatieres = async () => {
		setIsLoading(true);
		try {
			const res = await axios.get("http://localhost:3001/UE");
			setMatieres(res.data.ues);
		} catch (error) {
			toast({
				title: "Erreur",
				description: "Impossible de récupérer les matières.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (ABR_UE: any) => {
		setIsLoading(true); // Affichage du loading modal lors de la suppression
		try {
			await axios.delete(`http://localhost:3001/UE/Delete/${ABR_UE}`);
			setMatieres((prevMatieres) =>
				prevMatieres.filter((matiere: any) => matiere.ABR_UE !== ABR_UE)
			);
			toast({
				title: "Suppression réussie",
				description: `La matière avec l'abréviation ${ABR_UE} a été supprimée.`,
			});
		} catch (error) {
			toast({
				title: "Erreur",
				description: "Impossible de supprimer la matière.",
			});
		} finally {
			setIsLoading(false); // Masquage du loading modal après la suppression
		}
	};

	const handleEdit = (matiere: any) => {
		setModalType("edit");
		setSelectedMatiere(matiere);
		setFormData(matiere);
		setIsModalOpen(true);
	};

	const handleAdd = () => {
		setModalType("add");
		setSelectedMatiere(null);
		setFormData({ ABR_UE: "", DESIGNATION_UE: "" });
		setIsModalOpen(true);
	};

	const handleSubmit = async () => {
		setIsLoading(true); // Désactivation des boutons lors du traitement
		try {
			if (modalType === "edit") {
				await axios.put(
					`http://localhost:3001/UE/Update/${formData.ABR_UE}`,
					formData
				);
				setMatieres((prevMatieres) =>
					prevMatieres.map((matiere) =>
						matiere.ABR_UE === formData.ABR_UE ? formData : matiere
					)
				);
				toast({
					title: "Modification réussie",
					description: `La matière ${formData.DESIGNATION_UE} a été modifiée.`,
				});
			} else {
				await axios.post("http://localhost:3001/UE/Add", formData);
				setMatieres((prevMatieres) => [...prevMatieres, formData]);
				toast({
					title: "Ajout réussi",
					description: `La matière ${formData.DESIGNATION_UE} a été ajoutée.`,
				});
			}
			setIsModalOpen(false);
		} catch (error) {
			toast({
				title: "Erreur",
				description: "Une erreur est survenue lors de l'opération.",
			});
		} finally {
			setIsLoading(false); // Réactivation des boutons après la soumission
		}
	};

	const filteredMatieres = matieres.filter((matiere) =>
		Object.values(matiere)
			.join(" ")
			.toLowerCase()
			.includes(searchQuery.toLowerCase())
	);

	return (
		<div className="container mx-auto p-4">
			<Card>
				<CardHeader>
					<CardTitle>Liste des Matières</CardTitle>
					<CardDescription>Gérez les matières dans le système</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Recherche et Ajouter Matière */}
					<div className="flex justify-between mb-4">
						<input
							type="text"
							className="w-full p-2 border border-gray-300 rounded-md"
							placeholder="Rechercher une matière"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<Button
							variant="default"
							onClick={handleAdd}
							className="ml-2"
							disabled={isLoading}>
							<Plus size={16} className="mr-2" /> Ajouter
						</Button>
					</div>

					{isLoading ? (
						<LoadingComponent />
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Abbréviation</TableHead>
									<TableHead>Désignation</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredMatieres.map((matiere) => (
									<TableRow key={matiere.ABR_UE}>
										<TableCell>{matiere.ABR_UE}</TableCell>
										<TableCell>{matiere.DESIGNATION_UE}</TableCell>
										<TableCell>
											<Button
												variant="secondary"
												onClick={() => handleEdit(matiere)}
												className="mr-2"
												disabled={isLoading}>
												Modifier
											</Button>
											<Button
												variant="destructive"
												onClick={() => handleDelete(matiere.ABR_UE)}
												disabled={isLoading}>
												<Trash size={16} />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Modal de Formulaire */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{modalType === "edit"
								? "Modifier la Matière"
								: "Ajouter une Matière"}
						</DialogTitle>
						<DialogDescription>
							{modalType === "edit"
								? "Modifiez les détails de la matière"
								: "Entrez les informations pour ajouter une nouvelle matière"}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<Input
							placeholder="Abbréviation"
							value={formData.ABR_UE}
							onChange={(e) =>
								setFormData({ ...formData, ABR_UE: e.target.value })
							}
						/>
						<Input
							placeholder="Désignation"
							value={formData.DESIGNATION_UE}
							onChange={(e) =>
								setFormData({ ...formData, DESIGNATION_UE: e.target.value })
							}
						/>
					</div>
					<DialogFooter>
						<Button variant="secondary" onClick={() => setIsModalOpen(false)}>
							Annuler
						</Button>
						<Button
							variant="default"
							onClick={handleSubmit}
							disabled={isLoading}>
							{modalType === "edit" ? "Modifier" : "Ajouter"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Modal de chargement uniquement pour la suppression */}
			{isLoading && !modalType && (
				<LoadingModal isLoading={isLoading} msg="Traitement en cours..." />
			)}
		</div>
	);
}
