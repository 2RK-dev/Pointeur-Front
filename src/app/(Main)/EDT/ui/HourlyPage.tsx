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
	getCurrentWeekNumber,
	getWeekDateRange,
	getWeekOptions,
	hourly,
} from "@/lib/edt_utils";

import { initialLevels } from "@/lib/niveau_utils";
import { getedt } from "@/server/edt";
import { jsPDF } from "jspdf";
import { CirclePlus, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import EdtEncapsuler from "./EdtEncapsuler";
import Modal from "./Modal";

export default function HourlyPage() {
	const [OriginalHourlys, setOriginalHourlys] = useState<hourly[]>([]);
	const [hourlys, setHourlys] = useState<hourly[]>([]);
	const [selectedWeek, setSelectedWeek] = useState<string>(
		getCurrentWeekNumber().toString()
	);
	const [selectedNiveau, setSelectedNiveau] = useState<string>("L1");
	const [editingHoraire, setEditingHoraire] = useState<hourly | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleEdit = (horaire: hourly) => {
		setEditingHoraire(horaire);
		setIsModalOpen(true);
	};

	useEffect(() => {
		const fetch = async () => {
			const data = await getedt(
				getCurrentWeekNumber(),
				new Date().getFullYear()
			);
			setOriginalHourlys(data);
			const filteredData = filterHorairesByLvl(data, "L1");
			setHourlys(filteredData);
		};
		fetch();
	}, []);

	useEffect(() => {
		const fetch = async () => {
			if (selectedWeek) {
				const data = await getedt(
					parseInt(selectedWeek),
					new Date().getFullYear()
				);
				setOriginalHourlys(data);
				const filteredData = filterHorairesByLvl(data, selectedNiveau);
				setHourlys(filteredData);
			}
		};
		fetch();
	}, [selectedWeek]);

	useEffect(() => {
		if (selectedNiveau) {
			const filteredData = filterHorairesByLvl(OriginalHourlys, selectedNiveau);
			setHourlys(filteredData);
		}
	}, [selectedNiveau]);

	const filterHorairesByLvl = (data: hourly[], lvl: string) => {
		return data.filter((item) => {
			return lvl === item.level.split(" ")[0];
		});
	};

	const handleAdd = () => {
		setEditingHoraire(null);
		setIsModalOpen(true);
	};

	const handleSubmit = (newHoraire: hourly) => {
		console.log(newHoraire);
		if (editingHoraire) {
			setHourlys(
				hourlys.map((h) =>
					h.edt_id === editingHoraire.edt_id ? newHoraire : h
				)
			);
		} else {
			setHourlys([
				...hourlys,
				{ ...newHoraire, edt_id: Date.now().toString() },
			]);
		}
		console.log(newHoraire);
	};

	const handleDelete = () => {
		if (editingHoraire) {
			setHourlys(hourlys.filter((h) => h.edt_id !== editingHoraire.edt_id));
			setIsModalOpen(false);
		}
	};

	const generatePDF = () => {
		const doc = new jsPDF({
			orientation: "landscape",
			unit: "mm",
			format: "a4",
		});

		const currentYear = new Date().getFullYear();
		const { start, end } = getWeekDateRange(
			parseInt(selectedWeek),
			currentYear
		);

		doc.setFontSize(16);
		doc.text(selectedNiveau, 148.5, 10, { align: "center" });
		doc.setFontSize(10);
		doc.text(`Semaine : ${start} - ${end}`, 10, 10);

		const componentContent = document.getElementById("edt-content");
		if (componentContent) {
			doc.html(componentContent, {
				x: 10,
				y: 20,
				width: 270,
				windowWidth: 1024,
				callback: (doc) => {
					doc.save(`${selectedNiveau}_${start}_to_${end}.pdf`);
				},
			});
		}
	};

	return (
		<div className="p-4  min-w-[1250px]">
			<div className="mb-4 flex justify-between items-center">
				<Select value={selectedWeek} onValueChange={setSelectedWeek}>
					<SelectTrigger className="w-[300px]">
						<SelectValue placeholder="Sélectionner la semaine" />
					</SelectTrigger>
					<SelectContent>
						{getWeekOptions(new Date().getFullYear()).map((option) => (
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
				<EdtEncapsuler hourly={hourlys} onEdit={handleEdit} />
			</div>
			<Modal
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
				onSubmit={handleSubmit}
				onDelete={handleDelete}
				editingHoraire={editingHoraire}
				selectedNiveau={selectedNiveau}
				selectedWeek={parseInt(selectedWeek)}
			/>
		</div>
	);
}
