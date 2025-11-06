import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Button} from "@/components/ui/button";

interface Props {
    isConfirmationModalOpen: boolean;
    setIsConfirmationModalOpen: (open: boolean) => void;
    handleRemoveItem: () => void;
    title: string
}

export default function ConfirmeDeleteComp({
                                               title,
                                               isConfirmationModalOpen,
                                               setIsConfirmationModalOpen,
                                               handleRemoveItem,
                                           }: Props) {
    return (
        <Dialog open={isConfirmationModalOpen} onOpenChange={setIsConfirmationModalOpen}>
            <DialogContent className={"w-full max-h-[90vh] min-h-[100px]"}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <ScrollArea className={"max-h-[80vh] w-full"}>
                    Cette action est irréversible. L'item et toutes les données associées seront définitivement
                    supprimées.
                    Voulez-vous vraiment continuer ?
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsConfirmationModalOpen(false)}>Annuler</Button>
                        <Button variant="destructive" onClick={handleRemoveItem}>Confirmer</Button>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}