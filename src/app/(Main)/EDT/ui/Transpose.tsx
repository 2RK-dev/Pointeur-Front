import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {TranspositionResponse, Week, WeekSchema} from "@/Types/ScheduleItem";
import {useState} from "react";
import {
    AddWeeksToScheduleItems,
    getAllNextWeeksFromDate,
    getWeekDifference,
    ScheduleItemToPost
} from "@/Tools/ScheduleItem";
import {AddScheduleItemListService} from "@/services/ScheduleItem";
import {useCurrentScheduleItemsStore, useDisplayScheduleItem} from "@/Stores/ScheduleItem";

const NUMBER_OF_WEEK_TO_DISPLAY = 5;

interface Props {
    isTransposeModalOpen: boolean;
    setIsTransposeModalOpen: (open: boolean) => void;
    selectedWeek: Week;
    setTransposeResponse: (response: TranspositionResponse) => void;
}

export default function Transpose({isTransposeModalOpen, setIsTransposeModalOpen, selectedWeek, setTransposeResponse}: Props) {
    const {displayScheduleItems} = useDisplayScheduleItem();
    const {addScheduleItem} = useCurrentScheduleItemsStore();
    const [targetWeek, setTargetWeek] = useState<Week>();

    const initialDate = new Date(selectedWeek.end);
    initialDate.setDate(initialDate.getDate() + 1);

    const TransposeData = () => {
        if (!targetWeek) return;

        const weekDiff = getWeekDifference(selectedWeek.start, targetWeek.start);
        const scheduleItemListToAdd = AddWeeksToScheduleItems(displayScheduleItems, weekDiff);
        AddScheduleItemListService(scheduleItemListToAdd.map(item => ScheduleItemToPost(item))).then((value) => {
            setTransposeResponse(value);
            value.successItems.forEach(successItem => {
                addScheduleItem(successItem);
            })
        }).catch((error) => {
            console.error("Error transposing schedule items:", error);
        })
    }

    return (
        <Dialog
            open={isTransposeModalOpen}
            onOpenChange={setIsTransposeModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Transposer les données</DialogTitle>
                </DialogHeader>
                <Select
                    value={JSON.stringify(targetWeek)}
                    onValueChange={(value) => {
                        setTargetWeek(WeekSchema.parse(JSON.parse(value)))
                    }}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la semaine cible"/>
                    </SelectTrigger>
                    <SelectContent>
                        {getAllNextWeeksFromDate(NUMBER_OF_WEEK_TO_DISPLAY, initialDate).map((week, index) => (
                            <SelectItem key={index} value={JSON.stringify(week)}>
                                {`(${week.start.toLocaleDateString()} - ${week.end.toLocaleDateString()})`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <DialogFooter>
                    <Button
                        onClick={() => {
                            TransposeData();
                            setIsTransposeModalOpen(false);
                        }}>
                        Transposer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}