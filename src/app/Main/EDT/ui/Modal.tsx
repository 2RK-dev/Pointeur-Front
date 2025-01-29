"use client";

import TimePicker from "@/components/time-picker";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { Horaire, days, groupes, initialHoraire } from "@/lib/edt_utils";
import { useEffect, useState } from "react";

interface ModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (horaire: Horaire) => void;
	onDelete?: () => void;
	editingHoraire: Horaire | null;
	selectedNiveau: string;
}

export default function Modal({
	isOpen,
	onOpenChange,
	onSubmit,
	onDelete,
	editingHoraire,
	selectedNiveau,
}: ModalProps) {
	const [horaire, setHoraire] = useState<Horaire>(
		editingHoraire || initialHoraire
	);

	useEffect(() => {
		if (editingHoraire) {
			setHoraire(editingHoraire);
		}
	}, [editingHoraire]);

	// Handle submit logic
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(horaire);
		onOpenChange(false);
	};

	// Handle delete logic
	const handleDelete = () => {
		if (onDelete) {
			onDelete();
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{editingHoraire ? "Modifier horaire" : "Ajouter horaire"}
					</DialogTitle>
					<DialogDescription>
						{editingHoraire
							? "Modifiez les détails de l'horaire ici."
							: "Ajoutez les détails du nouvel horaire ici."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Jour Select */}
					<Select
						value={days[horaire.jour]}
						onValueChange={(value) => {
							setHoraire({ ...horaire, jour: days.indexOf(value) });
						}}>
						<SelectTrigger>
							<SelectValue placeholder="Jour" />
						</SelectTrigger>
						<SelectContent>
							{days.map((day, index) => (
								<SelectItem
									key={index}
									value={day}
									onSelect={() => setHoraire({ ...horaire, jour: index })}>
									{day}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* Groupe Select */}
					<Select
						value={horaire.id_grp}
						onValueChange={(value) => {
							setHoraire({ ...horaire, id_grp: value });
						}}>
						<SelectTrigger>
							<SelectValue placeholder="Groupe" />
						</SelectTrigger>
						<SelectContent>
							{groupes[selectedNiveau].map((groupe: any) => (
								<SelectItem
									key={groupe}
									value={groupe}
									onSelect={() => setHoraire({ ...horaire, id_grp: groupe })}>
									{groupe}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<div className="flex gap-4">
						{/* Heure de début */}
						<div className="flex-1">
							<label className="block text-sm font-medium mb-2">
								Heure de début
							</label>
							<TimePicker
								value={horaire.heure_debut}
								onChange={(time) =>
									setHoraire({ ...horaire, heure_debut: time })
								}
								minTime="07:00"
								maxTime="18:00"
							/>
						</div>

						{/* Heure de fin */}
						<div className="flex-1">
							<label className="block text-sm font-medium mb-2">
								Heure de fin
							</label>
							<TimePicker
								value={horaire.heure_fin}
								onChange={(time) => setHoraire({ ...horaire, heure_fin: time })}
								minTime="07:00"
								maxTime="18:00"
							/>
						</div>
					</div>

					{/* UE Select */}
					<Select
						value={horaire.id_ue}
						onValueChange={(value) => {
							setHoraire({ ...horaire, id_ue: value });
						}}>
						<SelectTrigger>
							<SelectValue placeholder="UE" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem
								value="ue1"
								onSelect={() => setHoraire({ ...horaire, id_ue: "ue1" })}>
								UE1
							</SelectItem>
							<SelectItem
								value="ue2"
								onSelect={() => setHoraire({ ...horaire, id_ue: "ue2" })}>
								UE2
							</SelectItem>
						</SelectContent>
					</Select>

					{/* Salle Select */}
					<Select>
						<SelectTrigger>
							<SelectValue>{horaire.id_salle}</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectItem
								value="salle1"
								onSelect={() => setHoraire({ ...horaire, id_salle: "salle1" })}>
								Salle 1
							</SelectItem>
							<SelectItem
								value="salle2"
								onSelect={() => setHoraire({ ...horaire, id_salle: "salle2" })}>
								Salle 2
							</SelectItem>
						</SelectContent>
					</Select>

					{/* Prof Select */}
					<Select>
						<SelectTrigger>
							<SelectValue>{horaire.id_prof}</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectItem
								value="prof1"
								onSelect={() => setHoraire({ ...horaire, id_prof: "prof1" })}>
								Prof 1
							</SelectItem>
							<SelectItem
								value="prof2"
								onSelect={() => setHoraire({ ...horaire, id_prof: "prof2" })}>
								Prof 2
							</SelectItem>
						</SelectContent>
					</Select>

					<div className="flex justify-between">
						<Button type="submit">
							{editingHoraire ? "Modifier" : "Enregistrer"}
						</Button>

						{editingHoraire && onDelete && (
							<Button
								type="button"
								variant="destructive"
								onClick={handleDelete}>
								Supprimer
							</Button>
						)}
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
