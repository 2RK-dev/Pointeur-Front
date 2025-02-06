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
import { initialRooms } from "@/lib/Room_utils";

import { Horaire, days, initialHoraire } from "@/lib/edt_utils";
import { initialLevels } from "@/lib/niveau_utils";
import { getMatterForLevel } from "@/server/Matter";
import { getTeacher } from "@/server/Teacher";
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
	const [MatterOption, setMatterOption] = useState<Matter[]>([]);
	const [TeacherOption, setTeacherOption] = useState<Teacher[]>([]);

	useEffect(() => {
		async function fetchMatter() {
			const matter = await getMatterForLevel(selectedNiveau);
			setMatterOption(matter);
		}
		fetchMatter();
	}, [selectedNiveau]);

	useEffect(() => {
		async function fetchTeacher() {
			const teacher = await getTeacher();
			setTeacherOption(teacher);
		}
		fetchTeacher();
	}, []);

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

	useEffect(() => {
		console.log(horaire);
		// Split the string by spaces
		const parts = horaire.id_grp.split(" ");
		// Combine the parts after the first split
		const id_grp = parts.slice(1).join(" ");
		console.log(id_grp);
	}, [horaire]);

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
						value={horaire.id_grp.split(" ").slice(1).join(" ")}
						onValueChange={(value) => {
							setHoraire({ ...horaire, id_grp: selectedNiveau + " " + value });
						}}>
						<SelectTrigger>
							<SelectValue placeholder="Groupe" />
						</SelectTrigger>
						<SelectContent>
							{initialLevels.map(
								(level) =>
									level.title === selectedNiveau &&
									level.groups.map((group, index) => (
										<SelectItem
											key={index}
											value={group}
											onSelect={() =>
												setHoraire({ ...horaire, id_grp: group })
											}>
											{group}
										</SelectItem>
									))
							)}
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
							{MatterOption.map((Matter, index) => (
								<SelectItem key={index} value={Matter.Abr_Matter}>
									{Matter.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* Salle Select */}
					<Select
						value={horaire.id_salle}
						onValueChange={(value) =>
							setHoraire({ ...horaire, id_salle: value })
						}>
						<SelectTrigger>
							<SelectValue placeholder="Salle" />
						</SelectTrigger>
						<SelectContent>
							{initialRooms.map((room, index) => (
								<SelectItem key={index} value={room.room_abr}>
									{room.room_name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* Prof Select */}
					<Select
						value={horaire.id_prof}
						onValueChange={(value) => {
							setHoraire({ ...horaire, id_prof: value });
						}}>
						<SelectTrigger>
							<SelectValue placeholder="Prof" />
						</SelectTrigger>
						<SelectContent>
							{TeacherOption.map((teacher, index) => (
								<SelectItem key={index} value={teacher.Abr_Teacher}>
									{teacher.name}
								</SelectItem>
							))}
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
