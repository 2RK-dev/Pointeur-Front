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

import {
	days,
	getDateByWeekAndDay,
	getDayNumber,
	hourly,
	initialHoraire,
} from "@/lib/edt_utils";
import { initialLevels } from "@/lib/niveau_utils";
import { getMatterForLevel } from "@/server/Matter";
import { getTeacher } from "@/server/Teacher";
import { useEffect, useState } from "react";

interface ModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (horaire: hourly) => void;
	onDelete?: () => void;
	editingHoraire: hourly | null;
	selectedNiveau: string;
	selectedWeek: number;
}

export default function Modal({
	isOpen,
	onOpenChange,
	onSubmit,
	onDelete,
	editingHoraire,
	selectedNiveau,
	selectedWeek,
}: ModalProps) {
	const [horaire, setHoraire] = useState<hourly>(
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
						value={getDayNumber(horaire.date).toString()}
						onValueChange={(value) => {
							setHoraire({
								...horaire,
								date: getDateByWeekAndDay(
									new Date().getFullYear(),
									selectedWeek,
									parseInt(value)
								),
							});
						}}>
						<SelectTrigger>
							<SelectValue placeholder="Jour" />
						</SelectTrigger>
						<SelectContent>
							{days.map((day, index) => (
								<SelectItem key={index} value={index.toString()}>
									{day}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* Groupe Select */}
					<Select
						value={horaire.level.split(" ").slice(1).join(" ")}
						onValueChange={(value) => {
							setHoraire({ ...horaire, level: selectedNiveau + " " + value });
						}}>
						<SelectTrigger>
							<SelectValue placeholder="Groupe" />
						</SelectTrigger>
						<SelectContent>
							{initialLevels.map(
								(level) =>
									level.title === selectedNiveau &&
									level.groups.map((group, index) => (
										<SelectItem key={index} value={group}>
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
								value={horaire.start_hours}
								onChange={(time) =>
									setHoraire({ ...horaire, start_hours: time })
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
								value={horaire.end_hours}
								onChange={(time) => setHoraire({ ...horaire, end_hours: time })}
								minTime="07:00"
								maxTime="18:00"
							/>
						</div>
					</div>

					{/* UE Select */}
					<Select
						value={horaire.ue}
						onValueChange={(value) => {
							setHoraire({ ...horaire, ue: value });
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
						value={horaire.room_abr}
						onValueChange={(value) =>
							setHoraire({ ...horaire, room_abr: value })
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
						value={horaire.teacher}
						onValueChange={(value) => {
							setHoraire({ ...horaire, teacher: value });
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
