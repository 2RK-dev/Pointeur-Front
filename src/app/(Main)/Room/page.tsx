"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {Edit, FileDown, Plus, Trash2} from "lucide-react";
import {useEffect, useState} from "react";
import {Room} from "@/Types/Room";
import {getRooms} from "@/services/Room";

export default function Home() {
	const [rooms, setRooms] = useState<Room[]>([]);
	const [isAddingRoom, setIsAddingRoom] = useState(false);
	const [editingRoom, setEditingRoom] = useState<Room | null>(null);

	useEffect(() => {
		getRooms().then((data)=> setRooms(data))
	}, []);

	const handleAddRoom = () => {
		// TODO: Implement add room logic
	};

	const handleUpdateRoom = () => {
		// TODO: Implement update room logic
	};

	const handleDeleteRoom = (id: number) => {
		// TODO: Implement delete room logic
	};

	const handleExportPDF = () => {
		const doc = new jsPDF();
		autoTable(doc, {
			head: [["ID", "Nom", "Abréviation", "Capacité"]],
			body: rooms.map((room) => [
				room.id,
				room.name,
				room.abr,
				room.capacity,
			]),
		});
		doc.save("liste_des_salles.pdf");
	};

	return (
		<div className="container mx-auto p-4 bg-gray-50 min-h-screen">
			<Card className="mb-8">
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="text-3xl font-bold text-gray-800">
						Gestion des Salles
					</CardTitle>
					<div className="flex space-x-2">
						<Dialog open={isAddingRoom} onOpenChange={setIsAddingRoom}>
							<DialogTrigger asChild>
								<Button onClick={() => setIsAddingRoom(true)}>
									<Plus className="mr-2 h-4 w-4" /> Ajouter une salle
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								{/* TODO: create a component for */}
							</DialogContent>
						</Dialog>
						<Button variant="outline" onClick={handleExportPDF}>
							<FileDown className="mr-2 h-4 w-4" /> Exporter en PDF
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Nom</TableHead>
								<TableHead>Abréviation</TableHead>
								<TableHead>Capacité</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rooms.map((room) => (
								<TableRow key={room.id}>
									<TableCell>{room.id}</TableCell>
									<TableCell>{room.name}</TableCell>
									<TableCell>{room.abr}</TableCell>
									<TableCell>{room.capacity}</TableCell>
									<TableCell>
										<div className="flex space-x-2">
											<Button
												variant="outline"
												size="icon"
												onClick={() => setEditingRoom(room)}>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="outline"
												size="icon"
												onClick={() => handleDeleteRoom(room.id)}>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Dialog open={!!editingRoom} onOpenChange={() => setEditingRoom(null)}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Modifier la salle</DialogTitle>
					</DialogHeader>
					{editingRoom && (
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="edit_room_name" className="text-right">
									Nom
								</Label>
								<Input
									id="edit_room_name"
									value={editingRoom.name}
									onChange={(e) =>
										setEditingRoom({
											...editingRoom,
											name: e.target.value,
										})
									}
									className="col-span-3"
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="edit_room_abr" className="text-right">
									Abréviation
								</Label>
								<Input
									id="edit_room_abr"
									value={editingRoom.abr}
									onChange={(e) =>
										setEditingRoom({ ...editingRoom, abr: e.target.value })
									}
									className="col-span-3"
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="edit_room_capacity" className="text-right">
									Capacité
								</Label>
								<Input
									id="edit_room_capacity"
									type="number"
									value={editingRoom.capacity}
									onChange={(e) =>
										setEditingRoom({
											...editingRoom,
											capacity: Number.parseInt(e.target.value),
										})
									}
									className="col-span-3"
								/>
							</div>
						</div>
					)}
					<DialogFooter>
						<Button onClick={handleUpdateRoom}>Sauvegarder</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
