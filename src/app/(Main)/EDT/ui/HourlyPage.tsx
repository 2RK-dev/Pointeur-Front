"use client";

import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";

import {CURRENT_YEAR, getWeekOptions, hourly, transposeHourlies,} from "@/lib/edt_utils";

import html2canvas from "html2canvas";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {getCurrentWeekNumber, getWeekDateRange} from "@/lib/common/dateUtils";
import {initialLevels} from "@/lib/niveau_utils";
import {getedt} from "@/server_old/edt";
import {jsPDF} from "jspdf";
import {CirclePlus, Copy, FileText} from "lucide-react";
import {useEffect, useState} from "react";
import EdtEncapsuler from "./EdtEncapsuler";
import ScheduleForm from "@/app/(Main)/EDT/ui/schedule-form";
import {ScrollArea} from "@/components/ui/scroll-area";

export default function HourlyPage() {
    const [OriginalHourlys, setOriginalHourlys] = useState<hourly[]>([]);
    const [hourlys, setHourlys] = useState<hourly[]>([]);
    const [WeekOptions, setWeekOptions] = useState<
        { value: number; label: string }[]
    >([]);
    const [selectedWeek, setSelectedWeek] = useState<number>(
        getCurrentWeekNumber(CURRENT_YEAR)
    );
    const [TargetWeek, setTargetWeek] = useState<number>(0);
    const [selectedNiveau, setSelectedNiveau] = useState<string>("L1");
    const [editingHoraire, setEditingHoraire] = useState<hourly | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isTransposeModalOpen, setIsTransposeModalOpen] = useState(false);

    const handleEdit = (horaire: hourly) => {
        setEditingHoraire(horaire);
        setIsFormOpen(true);
    };

    useEffect(() => {
        const fetch = async () => {
            setWeekOptions(getWeekOptions(CURRENT_YEAR));
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
        setIsFormOpen(true);
    };

    const handleSubmit = (newHoraire: hourly) => {
        console.log(newHoraire);
        if (editingHoraire) {
            setHourlys(
                hourlys.map((h) =>
                    h.hourly_id === editingHoraire.hourly_id ? newHoraire : h
                )
            );
        } else {
            setHourlys([
                ...hourlys,
                {...newHoraire, hourly_id: hourlys.length + 1},
            ]);
        }
        console.log(newHoraire);
    };

    const handleDelete = () => {
        if (editingHoraire) {
            setHourlys(
                hourlys.filter((h) => h.hourly_id !== editingHoraire.hourly_id)
            );
            setIsFormOpen(false);
        }
    };

    const TransposeData = (TargetWeek: number) => {
        if (TargetWeek <= selectedWeek) return;

        const {start, end} = getWeekDateRange(selectedWeek, CURRENT_YEAR);
        const dataForSelectedWeek = hourlys.filter((item) => {
            return item.date >= start && item.date <= end;
        });

        const lastIdNumber = OriginalHourlys[OriginalHourlys.length - 1].hourly_id;

        const transposedData = transposeHourlies(
            dataForSelectedWeek,
            TargetWeek - selectedWeek,
            lastIdNumber
        );

        alert("Données transposées avec succès");
    };

    const generatePDF = () => {
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
        });

        const currentYear = new Date().getFullYear();
        const {start, end} = getWeekDateRange(selectedWeek, currentYear);

        // Set up header
        doc.setFontSize(16);
        doc.text(selectedNiveau, 148.5, 10, {align: "center"});
        doc.setFontSize(10);
        doc.text(`Semaine : ${start} - ${end}`, 10, 10);

        const componentContent = document.getElementById("edt-content");
        if (componentContent) {
            const contentHeight = componentContent.offsetHeight;
            const pageHeight = doc.internal.pageSize.getHeight();
            const contentWidth = 270;

            const scaleFactor = contentWidth / componentContent.offsetWidth;
            const scaledContentHeight = contentHeight * scaleFactor;

            const totalPages = Math.ceil(
                (scaledContentHeight + 20) / (pageHeight - 20)
            );
            html2canvas(componentContent).then((canvas) => {
                for (let i = 0; i < totalPages; i++) {
                    if (i > 0) {
                        doc.addPage();
                    }

                    const sourceY = i * (canvas.height / totalPages);
                    const sourceHeight = canvas.height / totalPages;

                    const tempCanvas = document.createElement("canvas");
                    tempCanvas.width = canvas.width;
                    tempCanvas.height = sourceHeight;
                    const ctx = tempCanvas.getContext("2d");

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
                        <SelectValue placeholder="Sélectionner la semaine"/>
                    </SelectTrigger>
                    <SelectContent>
                        {WeekOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value.toString()}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={selectedNiveau} onValueChange={setSelectedNiveau}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sélectionner le niveau"/>
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
                    <Button
                        onClick={() => {
                            setIsTransposeModalOpen(true);
                        }}>
                        <Copy/>
                    </Button>
                    <Button onClick={generatePDF}>
                        <FileText/>
                    </Button>
                    <Button onClick={handleAdd}>
                        <CirclePlus/>
                    </Button>
                </div>
            </div>
            <div className="flex flex-col space-y-4" id="edt-content">
                <EdtEncapsuler hourly={hourlys} onEdit={handleEdit}/>
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className={"max-w-2xl w-full max-h-[90vh] min-h-[300px]"}>
                    <DialogHeader>
                        <DialogTitle>Planification</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className={"max-h-[80vh] w-full"}>
                        <ScheduleForm/>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            <Dialog
                open={isTransposeModalOpen}
                onOpenChange={setIsTransposeModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transposer les données</DialogTitle>
                    </DialogHeader>
                    <Select
                        onValueChange={(value) => {
                            setTargetWeek(parseInt(value));
                        }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner la semaine cible"/>
                        </SelectTrigger>
                        <SelectContent>
                            {WeekOptions.map(
                                (option) =>
                                    selectedWeek < option.value && (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value.toString()}>
                                            {option.label}
                                        </SelectItem>
                                    )
                            )}
                        </SelectContent>
                    </Select>
                    <DialogFooter>
                        <Button
                            onClick={() => {
                                TransposeData(TargetWeek);
                                setIsTransposeModalOpen(false);
                            }}>
                            Transposer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
