"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Room, initialRooms } from "@/lib/Room_utils";
import { Edit, FileDown, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Home() {
	const [rooms, setRooms] = useState<Room[]>(initialRooms);
	const [isAddingRoom, setIsAddingRoom] = useState(false);
	const [editingRoom, setEditingRoom] = useState<Room | null>(null);
	const [newRoom, setNewRoom] = useState<Omit<Room, "room_id">>({
		room_name: "",
		room_abr: "",
		room_capacity: 0,
	});

	const handleAddRoom = () => {
		if (newRoom.room_name && newRoom.room_abr) {
			const roomToAdd: Room = {
				...newRoom,
				room_id:
					rooms.length > 0 ? Math.max(...rooms.map((r) => r.room_id)) + 1 : 1,
			};
			setRooms([...rooms, roomToAdd]);
			setNewRoom({ room_name: "", room_abr: "", room_capacity: 0 });
			setIsAddingRoom(false);
		}
	};

	const handleUpdateRoom = () => {
		if (editingRoom) {
			setRooms(
				rooms.map((room) =>
					room.room_id === editingRoom.room_id ? editingRoom : room
				)
			);
			setEditingRoom(null);
		}
	};

	const handleDeleteRoom = (id: number) => {
		setRooms(rooms.filter((room) => room.room_id !== id));
	};

	const handleExportPDF = () => {
		// Ici, vous implémenteriez la logique pour exporter en PDF
		console.log("Exporting to PDF...");
		// Pour l'instant, nous allons simplement afficher une alerte
		alert("Fonctionnalité d'export en PDF à implémenter");
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
								<DialogHeader>
									<DialogTitle>Ajouter une nouvelle salle</DialogTitle>
								</DialogHeader>
								<div className="grid gap-4 py-4">
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="room_name" className="text-right">
											Nom
										</Label>
										<Input
											id="room_name"
											value={newRoom.room_name}
											onChange={(e) =>
												setNewRoom({ ...newRoom, room_name: e.target.value })
											}
											className="col-span-3"
										/>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="room_abr" className="text-right">
											Abréviation
										</Label>
										<Input
											id="room_abr"
											value={newRoom.room_abr}
											onChange={(e) =>
												setNewRoom({ ...newRoom, room_abr: e.target.value })
											}
											className="col-span-3"
										/>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="room_capacity" className="text-right">
											Capacité
										</Label>
										<Input
											id="room_capacity"
											type="number"
											value={newRoom.room_capacity}
											onChange={(e) =>
												setNewRoom({
													...newRoom,
													room_capacity: Number.parseInt(e.target.value),
												})
											}
											className="col-span-3"
										/>
									</div>
								</div>
								<DialogFooter>
									<Button onClick={handleAddRoom}>Ajouter</Button>
								</DialogFooter>
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
								<TableRow key={room.room_id}>
									<TableCell>{room.room_id}</TableCell>
									<TableCell>{room.room_name}</TableCell>
									<TableCell>{room.room_abr}</TableCell>
									<TableCell>{room.room_capacity}</TableCell>
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
												onClick={() => handleDeleteRoom(room.room_id)}>
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
									value={editingRoom.room_name}
									onChange={(e) =>
										setEditingRoom({
											...editingRoom,
											room_name: e.target.value,
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
									value={editingRoom.room_abr}
									onChange={(e) =>
										setEditingRoom({ ...editingRoom, room_abr: e.target.value })
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
									value={editingRoom.room_capacity}
									onChange={(e) =>
										setEditingRoom({
											...editingRoom,
											room_capacity: Number.parseInt(e.target.value),
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
