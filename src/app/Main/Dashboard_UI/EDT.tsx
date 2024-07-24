"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { edtTemplate } from "./TemplateEdt";

interface edt {
	date: Date;
	tranche_horaire: string;
	ue: string;
	salle: string;
	prof: string;
	niveau: string;
}
interface caseInterface {
	ue: string | null;
	salle: string | null;
	prof: string | null;
	niveau: string | null;
}
interface cours {
	tranche_horaire: string;
	case: caseInterface[];
}
interface edtTemplatInterface {
	date: string | null;
	cours: cours[];
}

const data: edt[] = [
	{
		date: new Date("2024-07-22"),
		tranche_horaire: "07h30-09h00",
		ue: "Algo",
		salle: "A101",
		prof: "Dupont",
		niveau: "L2 IG Grp1",
	},
	{
		date: new Date("2024-07-22"),
		tranche_horaire: "07h30-09h00",
		ue: "ASDA",
		salle: "A102",
		prof: "Chong",
		niveau: "L2 IG Grp2",
	},
	{
		date: new Date("2024-07-22"),
		tranche_horaire: "09h00-10h30",
		ue: "BDD",
		salle: "B202",
		prof: "Martin",
		niveau: "L2 IG Grp1",
	},
	{
		date: new Date("2024-07-22"),
		tranche_horaire: "10h30-12h00",
		ue: "Reseaux",
		salle: "C303",
		prof: "Durand",
		niveau: "L2 SR",
	},
	{
		date: new Date("2024-07-22"),
		tranche_horaire: "13h30-15h00",
		ue: "SE",
		salle: "D404",
		prof: "Petit",
		niveau: "L2 GB Grp2",
	},
	{
		date: new Date("2024-07-22"),
		tranche_horaire: "15h00-16h30",
		ue: "DevWeb",
		salle: "E505",
		prof: "Moreau",
		niveau: "L2 GB Grp2",
	},
	{
		date: new Date("2024-07-22"),
		tranche_horaire: "16h30-18h00",
		ue: "IA",
		salle: "F606",
		prof: "Fournier",
		niveau: "L2 IG Grp2",
	},
	{
		date: new Date("2024-07-23"),
		tranche_horaire: "07h30-09h00",
		ue: "Secu",
		salle: "A101",
		prof: "Bernard",
		niveau: "L2 SR",
	},
	{
		date: new Date("2024-07-23"),
		tranche_horaire: "09h00-10h30",
		ue: "Cloud",
		salle: "B202",
		prof: "Leroy",
		niveau: "L2 GB Grp1",
	},
	{
		date: new Date("2024-07-23"),
		tranche_horaire: "10h30-12h00",
		ue: "Prog",
		salle: "C303",
		prof: "Lefevre",
		niveau: "L2 IG Grp2",
	},
	{
		date: new Date("2024-07-23"),
		tranche_horaire: "13h30-15h00",
		ue: "Data",
		salle: "D404",
		prof: "Girard",
		niveau: "L2 SR",
	},
	{
		date: new Date("2024-07-23"),
		tranche_horaire: "15h00-16h30",
		ue: "DevOps",
		salle: "E505",
		prof: "Roux",
		niveau: "L2 GB Grp1",
	},
	{
		date: new Date("2024-07-23"),
		tranche_horaire: "16h30-18h00",
		ue: "ML",
		salle: "F606",
		prof: "Vincent",
		niveau: "L2 IG Grp2",
	},
	{
		date: new Date("2024-07-24"),
		tranche_horaire: "07h30-09h00",
		ue: "Algo",
		salle: "A101",
		prof: "Gautier",
		niveau: "L2 IG Grp1",
	},
	{
		date: new Date("2024-07-24"),
		tranche_horaire: "09h00-10h30",
		ue: "BDD",
		salle: "B202",
		prof: "Denis",
		niveau: "L2 GB Grp2",
	},
	{
		date: new Date("2024-07-24"),
		tranche_horaire: "10h30-12h00",
		ue: "Reseaux",
		salle: "C303",
		prof: "Perrot",
		niveau: "L2 SR",
	},
	{
		date: new Date("2024-07-24"),
		tranche_horaire: "13h30-15h00",
		ue: "SE",
		salle: "D404",
		prof: "Richard",
		niveau: "L2 IG Grp1",
	},
	{
		date: new Date("2024-07-24"),
		tranche_horaire: "15h00-16h30",
		ue: "DevWeb",
		salle: "E505",
		prof: "Dubois",
		niveau: "L2 GB Grp2",
	},
	{
		date: new Date("2024-07-24"),
		tranche_horaire: "16h30-18h00",
		ue: "IA",
		salle: "F606",
		prof: "Fontaine",
		niveau: "L2 IG Grp1",
	},
	{
		date: new Date("2024-07-24"),
		tranche_horaire: "16h30-18h00",
		ue: "RO",
		salle: "F650",
		prof: "Haja",
		niveau: "L2 GB Grp1",
	},
	{
		date: new Date("2024-07-25"),
		tranche_horaire: "07h30-09h00",
		ue: "Secu",
		salle: "A101",
		prof: "Lefebvre",
		niveau: "L2 SR",
	},
	{
		date: new Date("2024-07-25"),
		tranche_horaire: "07h30-09h00",
		ue: "SeSy",
		salle: "A105",
		prof: "Alyx",
		niveau: "L2 IG Grp1",
	},
	{
		date: new Date("2024-07-25"),
		tranche_horaire: "09h00-10h30",
		ue: "Cloud",
		salle: "B202",
		prof: "Perrin",
		niveau: "L2 GB Grp1",
	},
	{
		date: new Date("2024-07-25"),
		tranche_horaire: "10h30-12h00",
		ue: "Prog",
		salle: "B202",
		prof: "Perrin",
		niveau: "L2 IG Grp2",
	},
];

export default function EDT() {
	const [Template, setTemplate] = useState([...edtTemplate]);
	useEffect(() => {
		let temp = JSON.parse(JSON.stringify(edtTemplate));
		console.log(edtTemplate); // Copie profonde pour éviter la mutation directe de l'état
		data.forEach((item) => {
			let day = getDayOfWeek(item.date);
			temp.forEach((template: edtTemplatInterface) => {
				if (template.date === day) {
					template.cours.forEach((cours) => {
						if (cours.tranche_horaire === item.tranche_horaire) {
							if (cours.case[0].ue === "") {
								// Remplir case[0] si vide
								cours.case[0] = {
									ue: item.ue,
									salle: item.salle,
									prof: item.prof,
									niveau: item.niveau,
								};
							} else {
								// Remplir case[1] si case[0] est déjà rempli et case[1] est vide
								cours.case[1] = {
									ue: item.ue,
									salle: item.salle,
									prof: item.prof,
									niveau: item.niveau,
								};
							}
							console.log("ok");
						}
					});
				}
			});
		});
		setTemplate(temp); // Mettre à jour l'état à la fin
	}, [data]); // Ajoute data comme dépendance pour exécuter useEffect chaque fois que data change

	return (
		<div className=" flex flex-col p-4 h-full w-full rounded-lg border bg-card text-card-foreground shadow-sm">
			<ScrollArea>
				<div className="space-y-4">
					{Template.map((item, index) =>
						item.date ? (
							<div key={index} className="flex flex-row space-x-4 h-1/6">
								<div className="w-32 flex items-center justify-center">
									{item.date}
								</div>
								<div className="flex flex-row w-full space-x-4">
									{item.cours.map((item, index) => (
										<div
											key={index}
											className="flex flex-row justify-center space-x-1 w-1/6 h-1/6 text-center text-xs">
											<div>
												<p>{item.case[0].niveau}</p>
												<p>{item.case[0].ue}</p>
												<p>{item.case[0].prof}</p>
												<p>{item.case[0].salle}</p>
											</div>
											<div>
												<p>{item.case[1].niveau}</p>
												<p>{item.case[1].ue}</p>
												<p>{item.case[1].prof}</p>
												<p>{item.case[1].salle}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						) : (
							<div key={index} className="flex flex-row space-x-4 mb-2">
								<div className="w-32"></div>
								<div className="flex flex-row text-center w-full space-x-4">
									{item.cours.map((item, index) => (
										<div key={index} className="w-1/6 text-center">
											{item.tranche_horaire}
										</div>
									))}
								</div>
							</div>
						)
					)}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
}
function getDayOfWeek(date: Date) {
	const days = [
		"Dimanche",
		"Lundi",
		"Mardi",
		"Mercredi",
		"Jeudi",
		"Vendredi",
		"Samedi",
	];
	return days[date.getDay()];
}
