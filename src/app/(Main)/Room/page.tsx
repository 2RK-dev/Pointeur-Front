"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {Edit, FileDown, Plus, Trash2} from "lucide-react";
import {useEffect, useState} from "react";
import {Room} from "@/Types/Room";
import {removeRoomService, getRoomsService} from "@/services/Room";
import RoomForm from "@/app/(Main)/Room/ui/room-form";
import {useRoomsStore} from "@/Stores/Room";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {ScrollArea} from "@/components/ui/scroll-area";
import {notifications} from "@/components/notifications";

export default function Home() {
    const rooms = useRoomsStore((s) => s.rooms);
    const setRooms = useRoomsStore((s) => s.setRooms);
    const removeRoomInStore = useRoomsStore((s) => s.removeRoom);
    const [isOpen, setOpenForm] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

    useEffect(() => {
        const promise = getRoomsService().then((data) => {
            setRooms(data)
        })
        notifications.promise(promise, {
            loading: "Chargement des salles...",
            success: "Salles chargées avec succès !",
            error: "Erreur lors du chargement des salles."
        })
    }, []);

    const handleRemoveRoom = (id: number) => {
        const promise = removeRoomService(id).then((removedRoom) => {
            removeRoomInStore(removedRoom);
            notifications.success("Salle supprimée avec succès", " La salle N°" + removedRoom + " a été supprimée.");
        }).catch((err) => {
            notifications.error("Erreur lors de la suppression de la salle", err.message);
            throw err;
        })
        notifications.promise(promise, {
            loading: "Suppression de la salle...",
            success: "Salle supprimée avec succès !",
            error: "Erreur lors de la suppression de la salle."
        })
    }

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, {
            head: [["Nom", "Abréviation", "Capacité"]],
            body: rooms?.map((room) => [
                room.name,
                room.abr,
                room.capacity,
            ]),
        });
        doc.save("liste_des_salles.pdf");
        notifications.success("Exportation PDF réussie", "Le fichier PDF a été généré avec succès.");
    };

    return (
        <div className="bg-gray-50">
            <Card className="mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-3xl font-bold text-gray-800">
                        Gestion des Salles
                    </CardTitle>
                    <div className="flex space-x-2">
                        <Button onClick={() => {
                            setSelectedRoom(null);
                            setOpenForm(true);
                        }}>
                            <Plus className="mr-2 h-4 w-4"/> Ajouter une salle
                        </Button>
                        <Button variant="outline" onClick={handleExportPDF}>
                            <FileDown className="mr-2 h-4 w-4"/> Exporter en PDF
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Abréviation</TableHead>
                                <TableHead>Capacité</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rooms?.map((room) => (
                                <TableRow key={room.id}>
                                    <TableCell>{room.name}</TableCell>
                                    <TableCell>{room.abr}</TableCell>
                                    <TableCell>{room.capacity}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedRoom(room);
                                                    setOpenForm(true);
                                                }}>
                                                <Edit className="h-4 w-4"/>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedRoom(room);
                                                    setIsConfirmationModalOpen(true);
                                                }}>
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <RoomForm isFormOpen={isOpen} setIsFormOpen={setOpenForm} selectedRoom={selectedRoom}/>
            <Dialog open={isConfirmationModalOpen} onOpenChange={setIsConfirmationModalOpen}>
                <DialogContent className={"w-full max-h-[90vh] min-h-[100px]"}>
                    <DialogHeader>
                        <DialogTitle>Supprimer la salle ?</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className={"max-h-[80vh] w-full"}>
                        Cette action est irréversible. La salle et toutes les données associées seront définitivement supprimées.
                        Voulez-vous vraiment continuer ?
                        <div className="mt-4 flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsConfirmationModalOpen(false)}>Annuler</Button>
                            <Button variant="destructive" onClick={() => {
                                if(!selectedRoom) return;
                                handleRemoveRoom(selectedRoom.id);
                                setIsConfirmationModalOpen(false);
                            }}>Confirmer</Button>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}
