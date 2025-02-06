"use client";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import {
	Horaire,
	getCurrentWeekNumber,
	getWeekDateRange,
	getWeekOptions,
	groupes,
} from "@/lib/edt_utils";

import { initialLevels } from "@/lib/niveau_utils";
import { getedt } from "@/server/edt";
import { jsPDF } from "jspdf";
import { CirclePlus, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import EdtEncapsuler from "./EdtEncapsuler";
import Modal from "./Modal";

export const initialHoraire: Horaire = {
	id: "",
	id_grp: groupes.L1[0],
	jour: 0,
	heure_debut: "07:00",
	heure_fin: "08:00",
	id_ue: "",
	id_salle: "",
	id_prof: "",
	semaine: 1,
};

export default function HorairesPage() {
	const [Originalhoraires, setOriginalHoraires] = useState<Horaire[]>([]);
	const [horaires, setHoraires] = useState<Horaire[]>([]);
	const [selectedWeek, setSelectedWeek] = useState<string>(
		getCurrentWeekNumber().toString()
	);
	const [selectedNiveau, setSelectedNiveau] = useState<string>("L1");
	const [editingHoraire, setEditingHoraire] = useState<Horaire | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleEdit = (horaire: Horaire) => {
		setEditingHoraire(horaire);
		console.log(horaire);
		setIsModalOpen(true);
	};

	useEffect(() => {
		const fetch = async () => {
			const data = await getedt(
				getCurrentWeekNumber(),
				new Date().getFullYear()
			);
			setOriginalHoraires(data);
			const filteredData = filterHorairesByLvl(data, "L1");
			setHoraires(filteredData);
		};
		fetch();
	}, []);

	useEffect(() => {
		const fetch = async () => {
			if (selectedWeek) {
				console.log(selectedWeek);
				console.log(getedt(parseInt(selectedWeek), new Date().getFullYear()));
				const data = await getedt(
					parseInt(selectedWeek),
					new Date().getFullYear()
				);
				setOriginalHoraires(data);
				const filteredData = filterHorairesByLvl(data, selectedNiveau);
				setHoraires(filteredData);
			}
		};
		fetch();
	}, [selectedWeek]);

	useEffect(() => {
		if (selectedNiveau) {
			const filteredData = filterHorairesByLvl(
				Originalhoraires,
				selectedNiveau
			);
			setHoraires(filteredData);
		}
	}, [selectedNiveau]);

	const filterHorairesByLvl = (data: Horaire[], lvl: string) => {
		return data.filter((item) => {
			return lvl === item.id_grp.split(" ")[0];
		});
	};

	const handleAdd = () => {
		setEditingHoraire(null);
		setIsModalOpen(true);
	};

	const handleSubmit = (newHoraire: Horaire) => {
		if (editingHoraire) {
			setHoraires(
				horaires.map((h) => (h.id === editingHoraire.id ? newHoraire : h))
			);
		} else {
			setHoraires([...horaires, { ...newHoraire, id: Date.now().toString() }]);
		}
		setIsModalOpen(false);
	};

	const handleDelete = () => {
		if (editingHoraire) {
			setHoraires(horaires.filter((h) => h.id !== editingHoraire.id));
			setIsModalOpen(false);
		}
	};

	const generatePDF = () => {
		const doc = new jsPDF({
			orientation: "landscape", // Mode paysage
			unit: "mm",
			format: "a4",
		});

		// Calcul des dates de début et de fin de la semaine
		const currentYear = new Date().getFullYear(); // Année en cours
		const { start, end } = getWeekDateRange(
			parseInt(selectedWeek),
			currentYear
		);

		// Titre et date de la semaine
		doc.setFontSize(16);
		doc.text(selectedNiveau, 148.5, 10, { align: "center" }); // Titre centré
		doc.setFontSize(10);
		doc.text(`Semaine : ${start} - ${end}`, 10, 10); // Début et fin de semaine en haut à gauche

		// Contenu du composant EdtEncapsuler
		const componentContent = document.getElementById("edt-content");
		if (componentContent) {
			doc.html(componentContent, {
				x: 10,
				y: 20,
				width: 270, // Ajuste la largeur pour tenir dans une page paysage
				windowWidth: 1024, // Largeur de référence pour le rendu
				callback: (doc) => {
					doc.save(`${selectedNiveau}_${start}_to_${end}.pdf`);
				},
			});
		}
	};

	return (
		<div className="p-4">
			<div className="mb-4 flex justify-between items-center">
				<Select value={selectedWeek} onValueChange={setSelectedWeek}>
					<SelectTrigger className="w-[300px]">
						<SelectValue placeholder="Sélectionner la semaine" />
					</SelectTrigger>
					<SelectContent>
						{getWeekOptions().map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={selectedNiveau} onValueChange={setSelectedNiveau}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Sélectionner le niveau" />
					</SelectTrigger>
					<SelectContent>
						{initialLevels.map((level) => (
							<SelectItem key={level.id} value={level.title}>
								{level.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<div className=" space-x-4">
					<Button onClick={generatePDF}>
						<FileText />
					</Button>
					<Button onClick={handleAdd}>
						<CirclePlus />
					</Button>
				</div>
			</div>
			<div className="flex flex-col space-y-4" id="edt-content">
				<EdtEncapsuler horaires={horaires} onEdit={handleEdit} />
			</div>
			<Modal
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
				onSubmit={handleSubmit}
				onDelete={handleDelete}
				editingHoraire={editingHoraire}
				selectedNiveau={selectedNiveau}
			/>
		</div>
	);
}
