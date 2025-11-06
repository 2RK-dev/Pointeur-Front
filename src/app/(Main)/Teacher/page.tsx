"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {getTeachers, removeTeacher} from "@/services/Teacher";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {Edit, FileDown, PlusCircle, Trash2} from "lucide-react";
import {useEffect, useState} from "react";
import {Teacher} from "@/Types/Teacher";
import {useTeacherStore} from "@/Stores/Teacher";
import TeacherForm from "@/app/(Main)/Teacher/ui/teacher-form";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {ScrollArea} from "@/components/ui/scroll-area";
import {notifications} from "@/components/notifications";

export default function Home() {
    const teachers = useTeacherStore((s) => s.teachers);
    const setTeachers = useTeacherStore((s) => s.setTeachers);
    const removeTeacherInStore = useTeacherStore((s) => s.removeTeacher);
    const [isOpenForm, setIsOpenForm] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

    useEffect(() => {
        const promise = getTeachers().then((data) =>
            setTeachers(data)
        );
        notifications.promise(promise,{
            loading: "Chargement des enseignants...",
            success: "Enseignants chargés avec succès !",
            error: "Erreur lors du chargement des enseignants."
        })
    }, []);

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, {
            head: [["Nom", "Abréviation"]],
            body: teachers?.map((teacher) => [teacher.name, teacher.abr]),
        });
        doc.save("liste_des_salles.pdf");
        notifications.success("Exportation PDF réussie", "Le fichier PDF a été généré avec succès.");
    };

    const handleRemoveTeacher = (id: number) => {
        const promise = removeTeacher(id).then((removedTeacherId) => {
            removeTeacherInStore(removedTeacherId);
            notifications.success("Enseignant supprimé avec succès"," L'enseignant avec l'ID " + removedTeacherId + " a été supprimé.");
        }).catch((err) => {
            notifications.error("Erreur lors de la suppression de l'enseignant", err.message);
        })
        notifications.promise(promise,{
            loading: "Suppression de l'enseignant...",
            success: "Enseignant supprimé avec succès !",
            error: "Erreur lors de la suppression de l'enseignant."
        })
    }

    return (
        <div>
            <Card className="mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-3xl font-bold text-gray-800">
                        Liste des Enseignants
                    </CardTitle>
                    <div className="flex space-x-2">
                        <Button onClick={() => {
                            setSelectedTeacher(null);
                            setIsOpenForm(true);
                        }}>
                            <PlusCircle className="mr-2 h-4 w-4"/> Ajouter un enseignant
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
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teachers?.map((teacher) => (
                                <TableRow key={teacher.id}>
                                    <TableCell>{teacher.name}</TableCell>
                                    <TableCell>{teacher.abr}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedTeacher(teacher);
                                                setIsOpenForm(true);
                                            }}
                                        >
                                            <Edit className={"h-4 w-4"}/>
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="ml-2"
                                            onClick={() => {
                                                setSelectedTeacher(teacher);
                                                setIsConfirmationModalOpen(true);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <TeacherForm isOpen={isOpenForm} setIsOpen={setIsOpenForm} selectedTeacher={selectedTeacher}/>
            <Dialog open={isConfirmationModalOpen} onOpenChange={setIsConfirmationModalOpen}>
                <DialogContent className={"w-full max-h-[90vh] min-h-[100px]"}>
                    <DialogHeader>
                        <DialogTitle>Supprimer l'enseignant ?</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className={"max-h-[80vh] w-full"}>
                        Cette action est irréversible. L'enseignant et toutes les données associées seront
                        définitivement supprimées.
                        Voulez-vous vraiment continuer ?
                        <div className="mt-4 flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsConfirmationModalOpen(false)}>Annuler</Button>
                            <Button variant="destructive" onClick={() => {
                                if (!selectedTeacher) return;
                                handleRemoveTeacher(selectedTeacher.id);
                                setIsConfirmationModalOpen(false);
                            }}>Confirmer</Button>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}
