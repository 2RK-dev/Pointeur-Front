"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {Edit, FileDown, Plus, Trash2} from "lucide-react";
import {useEffect, useState} from "react";
import {Room} from "@/Types/Room";
import {getRoomsService} from "@/services/Room";
import RoomForm from "@/app/(Main)/Room/ui/room-form";

export default function Home() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isOpen, setOpenForm] = useState(false);

    useEffect(() => {
        getRoomsService().then((data) => setRooms(data))
    }, []);

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
        <div className="bg-gray-50">
            <Card className="mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-3xl font-bold text-gray-800">
                        Gestion des Salles
                    </CardTitle>
                    <div className="flex space-x-2">
                        <Button onClick={() => {
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
                                                onClick={() => {

                                                }}>
                                                <Edit className="h-4 w-4"/>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => {

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
            <RoomForm isFormOpen={isOpen} setIsFormOpen={setOpenForm}/>
        </div>
    );
}
