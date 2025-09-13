"use client";


import {useTeachingUnitStore} from "@/Stores/TeachingUnit";
import {useEffect, useState} from "react";
import {getTeachingUnits} from "@/services/TeachingUnit";
import {useLevelStore} from "@/Stores/Level";
import {getLevels} from "@/services/Level";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Edit, FileDown, Plus, Trash2} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export default function Page() {
    const setTeachingUnits = useTeachingUnitStore(s => s.setTeachingUnits);
    const getTeachingUnitByLevel = useTeachingUnitStore(s => s.getTeachingUnitByLevel);

    const levels = useLevelStore(s => s.levels);
    const setLevels = useLevelStore(s => s.setLevels);

    const [selectedLevelID, setSelectedLevelID] = useState<number | null>( null);

    useEffect(() => {
        getTeachingUnits()
            .then((data) => setTeachingUnits(data))
            .catch((error) => console.log(error));
        if (!levels) {
            getLevels()
                .then((data) => {
                    setLevels(data);
                    if (data.length > 0) {
                        setSelectedLevelID(data[0].id);
                    }
                })
                .catch((error) => console.log(error));
        }
    }, []);

    return (
        <div className="bg-gray-50">
            <Card className="mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <Select value={selectedLevelID?.toString()} onValueChange={(value) => {
                        setSelectedLevelID(value ? parseInt(value, 10) : null)
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrer par niveau"/>
                        </SelectTrigger>
                        <SelectContent>
                            {levels?.map((level) => (
                                <SelectItem key={level.id} value={level.id.toString() || ""}>
                                    {level.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex space-x-2">
                        <Button onClick={() => {
                        }}>
                            <Plus className="mr-2 h-4 w-4"/> Ajouter une salle
                        </Button>
                        <Button variant="outline">
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
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {getTeachingUnitByLevel(selectedLevelID).map((teachingUnit) => (
                                <TableRow key={teachingUnit.id}>
                                    <TableCell>{teachingUnit.name}</TableCell>
                                    <TableCell>{teachingUnit.abr}</TableCell>
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
                                                variant="destructive"
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
        </div>
    )


}
