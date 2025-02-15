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
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Room, initialRooms } from "@/lib/Room_utils";
import {
	CURRENT_YEAR,
	DayOption,
	getDayOptions,
	initialHoraire,
} from "@/lib/edt_utils";
import { getMatterForLevel } from "@/server/Matter";
import { getTeacher } from "@/server/Teacher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	edt_id: z.string().min(1, "L'identifiant de l'horaire est requis"),
	date: z.string().min(1, "La date est requise"),
	ue: z.string().min(1, "Une matière est requis"),
	start_hours: z.string().min(1, "L'heure de début est requise"),
	end_hours: z.string().min(1, "L'heure de fin est requise"),
	teacher: z.string().min(1, "Le professeur est requis"),
	room_abr: z.string().min(1, "La salle est requise"),
	level: z.string().min(1, "Le niveau est requis"),
});

interface ModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (horaire: z.infer<typeof formSchema>) => void;
	onDelete?: () => void;
	editingHoraire: z.infer<typeof formSchema> | null;
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
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: editingHoraire || {
			...initialHoraire,
			level: selectedNiveau,
		},
	});

	const [MatterOption, setMatterOption] = useState<Matter[]>([]);
	const [TeacherOption, setTeacherOption] = useState<Teacher[]>([]);
	const [RoomOption, setRoomOption] = useState<Room[]>(initialRooms);
	const [DayOption, setDayOption] = useState<DayOption[]>([]);

	useEffect(() => {
		async function fetchOptions() {
			const [matter, teacher] = await Promise.all([
				getMatterForLevel(selectedNiveau),
				getTeacher(),
			]);
			setMatterOption(matter);
			setTeacherOption(teacher);
		}
		fetchOptions();
	}, [selectedNiveau]);

	useEffect(() => {
		if (editingHoraire) form.reset(editingHoraire);
	}, [editingHoraire, form]);

	useEffect(() => {
		setDayOption(getDayOptions(selectedWeek, CURRENT_YEAR));
	}, [selectedWeek]);

	function onFormSubmit(values: z.infer<typeof formSchema>) {
		onSubmit(values);
		form.reset(initialHoraire);
		onOpenChange(false);
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(value) => {
				form.reset(initialHoraire);
				onOpenChange(value);
			}}>
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

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onFormSubmit)}
						className="space-y-4">
						<FormField
							control={form.control}
							name="edt_id"
							render={({ field }) => <input type="hidden" {...field} />}
						/>

						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Jour</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Jour" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{DayOption.map((dayOption, index) => (
												<SelectItem key={index} value={dayOption.date}>
													{dayOption.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="ue"
							render={({ field }) => (
								<FormItem>
									<FormLabel>EC</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="EC" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{MatterOption.map((Matter, index) => (
												<SelectItem key={index} value={Matter.Abr_Matter}>
													{Matter.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="start_hours"
							render={({ field: startField }) => (
								<FormField
									control={form.control}
									name="end_hours"
									render={({ field: endField }) => (
										<FormItem>
											<FormLabel>Heures</FormLabel>
											<div className="flex items-center space-x-2">
												<FormControl>
													<TimePicker
														value={startField.value || "08:00"}
														onChange={startField.onChange}
													/>
												</FormControl>
												<span>à</span>
												<FormControl>
													<TimePicker
														value={endField.value || "10:00"}
														onChange={endField.onChange}
													/>
												</FormControl>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						/>

						<FormField
							control={form.control}
							name="teacher"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Prof</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Prof" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{TeacherOption.map((teacher, index) => (
												<SelectItem key={index} value={teacher.Abr_Teacher}>
													{teacher.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="room_abr"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Salle</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Salle" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{RoomOption.map((room, index) => (
												<SelectItem key={index} value={room.room_abr}>
													{room.room_name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="level"
							render={({ field }) => <input type="hidden" {...field} />}
						/>

						<div className="flex justify-between">
							<Button type="submit">
								{editingHoraire ? "Modifier" : "Enregistrer"}
							</Button>
							{editingHoraire && onDelete && (
								<Button type="button" variant="destructive" onClick={onDelete}>
									Supprimer
								</Button>
							)}
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
