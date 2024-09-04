"use client";
//#region import and config
import { edt, edtTemplatInterface, Semaine } from "@/app/model";
import Form_Item from "@/components/formItem";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	getDateByDayOfWeek,
	getDayOfWeek,
	obtenirSemaines,
} from "./Fonction_date";
import { edtTemplate } from "./TemplateEdt";

const data: edt[] = [
	{
		date: new Date("2024-07-22"),
		niveau: "L1 GB Grp 1",
		prof: "RAL",
		salle: "A1",
		tranche_horaire: "07h30-09h00",
		ue: "Programmation Web",
	},
];
const semaines: Semaine[] = obtenirSemaines();
const formSchema = z.object({
	date: z.string(),
	tranche_horaire: z.string(),
	niveau: z.string().min(1, "Niveau is required"),
	ue: z.string().min(1, "UE is required"),
	prof: z.string().min(1, "Prof is required"),
	salle: z.string().min(1, "Salle is required"),
});
const ue_ex = [
	"Algorithmique",
	"Programmation Web",
	"Base de Données",
	"Réseaux",
	"Intelligence Artificielle",
];
const niveau_ex = [
	"L1 GB Grp 1",
	"L1 GB Grp 2",
	"L1 SR Grp 1",
	"L1 IG Grp 1",
	"L1 IG Grp 2",
];
const prof_ex = ["RAL", "GIL", "THO", "HAJ", "HJS"];
const salle_ex = ["A1", "A2", "A3", "A4", "A5"];

//#endregion

export default function page() {
	const [IsOpen, setOpen] = useState<boolean>(false);
	const [Template, setTemplate] = useState([...edtTemplate]);
	const [ue, setUe] = useState<string[]>(ue_ex);
	const [niveau, setNiveau] = useState<string[]>(niveau_ex);
	const [prof, setProf] = useState<string[]>(prof_ex);
	const [salle, setSalle] = useState<string[]>(salle_ex);
	const [selectedSemaine, setSelectedSemaine] = useState(
		semaines[1].debut.toISOString().split("T")[0]
	);
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [selectedTranche, setSelectedTranche] = useState<string>("");
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: "",
			tranche_horaire: "",
			niveau: "",
			ue: "",
			prof: "",
			salle: "",
		},
		values: {
			date: selectedDate,
			tranche_horaire: selectedTranche,
			niveau: "",
			ue: "",
			prof: "",
			salle: "",
		},
	});
	const data: edt[] = [
		{
			date: new Date("2024-07-22"),
			niveau: "L1 GB Grp 1",
			prof: "RAL",
			salle: "A1",
			tranche_horaire: "07h30-09h00",
			ue: "Programmation Web",
		},
		{
			date: new Date("2024-07-22"),
			niveau: "L1 GB Grp 1",
			prof: "RAL",
			salle: "A1",
			tranche_horaire: "07h30-09h00",
			ue: "Programmation Web",
		},
	];
	useEffect(() => {
		refresh();
	}, []);
	const refresh = () => {
		let temp = JSON.parse(JSON.stringify(edtTemplate));
		data.forEach((item) => {
			let day = getDayOfWeek(item.date);
			temp.forEach((template: edtTemplatInterface) => {
				if (template.date === day) {
					template.cours.forEach((cours) => {
						if (cours.tranche_horaire === item.tranche_horaire) {
							if (cours.case[0].ue === "") {
								cours.case[0] = {
									ue: item.ue,
									salle: item.salle,
									prof: item.prof,
									niveau: item.niveau,
								};
							} else {
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
		setTemplate(temp);
	};

	const openModal = (day: string, tranche_horaire: string) => {
		setSelectedDate(day);
		setSelectedTranche(tranche_horaire);
		setOpen(true);
	};

	return (
		<div className="flex flex-col space-y-4 h-full">
			<div className="flex flex-row space-x-2">
				<div className="flex flex-row items-center space-x-2">
					<Label htmlFor="terms">Niveau:</Label>
					<Select defaultValue="L1">
						<SelectTrigger className="w-[180px]">
							<SelectValue></SelectValue>
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="L1">L1</SelectItem>
							<SelectItem value="L2">L2</SelectItem>
							<SelectItem value="L3">L3</SelectItem>
							<SelectItem value="M1">M1</SelectItem>
							<SelectItem value="M2">M2</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-row items-center space-x-2">
					<Label htmlFor="terms">Semaine du :</Label>
					<Select
						defaultValue={semaines[1].debut.toISOString().split("T")[0]}
						onValueChange={(value) => setSelectedSemaine(value)}>
						<SelectTrigger className="w-[250px]">
							<SelectValue></SelectValue>
						</SelectTrigger>

						<SelectContent>
							{semaines.map((semaine, index) => (
								<SelectItem
									key={index}
									value={semaine.debut.toISOString().split("T")[0]}>
									{semaine.debut.toDateString()} - {semaine.fin.toDateString()}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="flex flex-col p-4 h-full w-full rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="space-y-4 flex flex-col h-full">
					{Template.map((item, index) =>
						item.date ? (
							<div key={index} className="flex flex-row space-x-4 h-1/6">
								<div className="w-32 flex items-center justify-center">
									{item.date}
								</div>
								<div className="flex flex-row w-full space-x-4">
									{item.cours.map((cours, index) => (
										<div
											key={index}
											className="flex flex-row justify-center space-x-1 w-1/6 text-center text-xs rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-blue-500">
											{cours.case[0].ue ? (
												<>
													<div>
														<p>{cours.case[0].niveau}</p>
														<p>{cours.case[0].ue}</p>
														<p>{cours.case[0].prof}</p>
														<p>{cours.case[0].salle}</p>
													</div>
													<div>
														<p>{cours.case[1].niveau}</p>
														<p>{cours.case[1].ue}</p>
														<p>{cours.case[1].prof}</p>
														<p>{cours.case[1].salle}</p>
													</div>
												</>
											) : (
												<div
													className="flex h-full w-full justify-center items-center text-gray-400"
													onClick={() =>
														openModal(
															getDateByDayOfWeek(
																item.date ?? "Lundi",
																new Date(selectedSemaine)
															),
															cours.tranche_horaire
														)
													}>
													<Plus />
												</div>
											)}
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
				<Modal
					isopen={IsOpen}
					setopen={setOpen}
					TitleModal="Ajouter un cours"
					Description="Ajouter un cours à l'emploie du temps">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit((value) => {
								console.log(value);
								const add = {
									date: new Date(value.date),
									tranche_horaire: value.tranche_horaire,
									niveau: value.niveau,
									ue: value.ue,
									prof: value.prof,
									salle: value.salle,
								};
								data.push(add);
								refresh();
								setOpen(false);
								console.log(data);
								console.log(getDayOfWeek(data[0].date));
							})}
							className="space-y-8">
							<FormField
								control={form.control}
								name="niveau"
								render={({ field }) => (
									<Form_Item label="Niveau">
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger className="w-[250px]">
												<SelectValue></SelectValue>
											</SelectTrigger>
											<SelectContent>
												{niveau.map((niveau, index) => (
													<SelectItem key={index} value={niveau}>
														{niveau}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Form_Item>
								)}
							/>
							<FormField
								control={form.control}
								name="ue"
								render={({ field }) => (
									<Form_Item label="UE">
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger className="w-[250px]">
												<SelectValue></SelectValue>
											</SelectTrigger>
											<SelectContent>
												{ue.map((ue, index) => (
													<SelectItem key={index} value={ue}>
														{ue}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Form_Item>
								)}
							/>
							<FormField
								control={form.control}
								name="prof"
								render={({ field }) => (
									<Form_Item label="Prof">
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger className="w-[250px]">
												<SelectValue></SelectValue>
											</SelectTrigger>
											<SelectContent>
												{prof.map((prof, index) => (
													<SelectItem key={index} value={prof}>
														{prof}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Form_Item>
								)}
							/>
							<FormField
								control={form.control}
								name="salle"
								render={({ field }) => (
									<Form_Item label="Salle">
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger className="w-[250px]">
												<SelectValue></SelectValue>
											</SelectTrigger>
											<SelectContent>
												{salle.map((salle, index) => (
													<SelectItem key={index} value={salle}>
														{salle}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Form_Item>
								)}
							/>
							<Button type="submit">Submit</Button>
						</form>
					</Form>
				</Modal>
			</div>
		</div>
	);
}
