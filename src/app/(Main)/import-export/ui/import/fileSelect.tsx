import {Card, CardContent} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import type {FileType} from "@/Tools/import";
import {fileType, getFileIcon} from "@/Tools/import";

interface props {
    selectedFileType: FileType | null;
    handleFileTypeSelect: (type: FileType) => void;
}

export default function FileSelect({selectedFileType, handleFileTypeSelect}: props) {



    return (
        <div className="space-y-1">
            <Label className="text-sm font-semibold">Sélectionnez le type de fichier</Label>
            <div className="grid grid-cols-3 gap-3">
                {fileType.map((type) => (
                    <Card
                        key={type}
                        className={` flex cursor-pointer hover:border-primary/50 h-16 ${
                            selectedFileType === type && "border-primary border-2 bg-primary/5 shadow-sm"
                        }`}
                        onClick={() => handleFileTypeSelect(type)}
                    >
                        <CardContent className="flex items-center gap-2 p-4 py-0 justify-start px-4">
                            <div className="h-4 w-4">{getFileIcon(type)}</div>
                            <span className="font-medium text-sm capitalize ">
                                    {type}
                                </span>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}