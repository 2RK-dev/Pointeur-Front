"use client";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { CURRENT_YEAR, getWeekOptions, hourly } from "@/lib/edt_utils";

import html2canvas from "html2canvas";

import { getCurrentWeekNumber, getWeekDateRange } from "@/lib/common/dateUtils";
import { initialLevels } from "@/lib/niveau_utils";
import { getedt } from "@/server/edt";
import { jsPDF } from "jspdf";
import { CirclePlus, Copy, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import EdtEncapsuler from "./EdtEncapsuler";
import Modal from "./Modal";

export default function HourlyPage() {
	const [OriginalHourlys, setOriginalHourlys] = useState<hourly[]>([]);
	const [hourlys, setHourlys] = useState<hourly[]>([]);
	const [selectedWeek, setSelectedWeek] = useState<number>(
		getCurrentWeekNumber(CURRENT_YEAR)
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
				getCurrentWeekNumber(CURRENT_YEAR),
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
				const data = await getedt(selectedWeek, new Date().getFullYear());
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
			setHourlys([...hourlys, { ...newHoraire, edt_id: hourlys.length + 1 }]);
		}
		console.log(newHoraire);
	};

	const handleDelete = () => {
		if (editingHoraire) {
			setHourlys(hourlys.filter((h) => h.edt_id !== editingHoraire.edt_id));
			setIsModalOpen(false);
		}
	};

	const TransposeData = (WeekTarget: string) => {};

	const generatePDF = () => {
		const doc = new jsPDF({
			orientation: "landscape",
			unit: "mm",
			format: "a4",
		});

		const currentYear = new Date().getFullYear();
		const { start, end } = getWeekDateRange(selectedWeek, currentYear);

		// Set up header
		doc.setFontSize(16);
		doc.text(selectedNiveau, 148.5, 10, { align: "center" });
		doc.setFontSize(10);
		doc.text(`Semaine : ${start} - ${end}`, 10, 10);

		const componentContent = document.getElementById("edt-content");
		if (componentContent) {
			// First, get the height of the content
			const contentHeight = componentContent.offsetHeight;
			const pageHeight = doc.internal.pageSize.getHeight();
			const contentWidth = 270; // keeping original width

			// Calculate scaling factor based on content size
			const scaleFactor = contentWidth / componentContent.offsetWidth;
			const scaledContentHeight = contentHeight * scaleFactor;

			// Determine if we need multiple pages
			const totalPages = Math.ceil(
				(scaledContentHeight + 20) / (pageHeight - 20)
			); // 20mm margin

			// Use html2canvas to capture the content
			html2canvas(componentContent).then((canvas) => {
				// Split content across pages if necessary
				for (let i = 0; i < totalPages; i++) {
					if (i > 0) {
						doc.addPage();
					}

					// Calculate the portion of the canvas to use for this page
					const sourceY = i * (canvas.height / totalPages);
					const sourceHeight = canvas.height / totalPages;

					// Create a temporary canvas for this portion
					const tempCanvas = document.createElement("canvas");
					tempCanvas.width = canvas.width;
					tempCanvas.height = sourceHeight;
					const ctx = tempCanvas.getContext("2d");

					// Draw the portion of the original canvas
					ctx?.drawImage(
						canvas,
						0,
						sourceY,
						canvas.width,
						sourceHeight,
						0,
						0,
						canvas.width,
						sourceHeight
					);

					// Add to PDF
					const imgData = tempCanvas.toDataURL("image/png");
					doc.addImage(
						imgData,
						"PNG",
						10,
						20,
						contentWidth,
						sourceHeight * scaleFactor
					);
				}

				// Save the PDF
				doc.save(`${selectedNiveau}_${start}_to_${end}.pdf`);
			});
		}
	};

	return (
		<div className="p-4  min-w-[1250px]">
			<div className="mb-4 flex justify-between items-center">
				<Select
					value={selectedWeek.toString()}
					onValueChange={(value) => {
						setSelectedWeek(parseInt(value));
					}}>
					<SelectTrigger className="w-[300px]">
						<SelectValue placeholder="Sélectionner la semaine" />
					</SelectTrigger>
					<SelectContent>
						{getWeekOptions(new Date().getFullYear()).map((option) => (
							<SelectItem key={option.value} value={option.value.toString()}>
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
					<Button onClick={() => {}}>
						<Copy />
					</Button>
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
				selectedWeek={selectedWeek}
			/>
		</div>
	);
}
