"use client"

import {useEffect, useState} from "react"
import {LevelCard} from "./ui/level-card"
import {LevelModal} from "./ui/level-modal"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {GraduationCap, Plus, Search} from "lucide-react"
import {LevelDetailsDTO, LevelDTO, LevelPostDTO} from "@/Types/LevelDTO"
import ConfirmeDeleteComp from "@/components/ConfirmeDeleteComp";
import {useLevelStore} from "@/Stores/Level";
import {addLevelService, getLevelListService, removeLevelService, updateLevelService} from "@/services/Level";
import {notifications} from "@/components/notifications";

export default function LevelsPage() {
    const levels = useLevelStore((s) => s.levelsDetails);
    const setLevels = useLevelStore((s) => s.setLevels);
    const addLevel = useLevelStore((s) => s.addLevel);
    const updateLevel = useLevelStore((s) => s.updateLevel);
    const removeLevel = useLevelStore((s) => s.removeLevel);
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredLevels, setFilteredLevels] = useState<LevelDetailsDTO[]>([])

    const [levelModalOpen, setLevelModalOpen] = useState(false)
    const [editingLevel, setEditingLevel] = useState<LevelDTO | null>(null)
    const [isDeleteLevelDialogOpen, setIsDeleteLevelDialogOpen] = useState(false)

    useEffect(() => {
        getLevelListService().then((data) => {
            setLevels(data);
        }).catch((error) => {
            console.error("Error fetching levels:", error);
        })
    }, [])

    useEffect(() => {
        if (!levels) {
            setFilteredLevels([])
            return;
        }
        if (searchQuery.trim() === "") {
            setFilteredLevels(levels)
        } else {
            const filtered = levels.filter(
                (levelDetail) =>
                    levelDetail.level.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    levelDetail.groups.some(
                        (group) =>
                            group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            group.classe.toLowerCase().includes(searchQuery.toLowerCase()),
                    ),
            )
            setFilteredLevels(filtered)
        }
    }, [searchQuery, levels])

    const totalGroups = levels?.reduce((sum, level) => sum + level.groups.length, 0) || 0

    const handleAddLevel = (levelPost: LevelPostDTO) => {
        if(!levelPost) return;
        const promise = addLevelService(levelPost).then((newLevel) => {
            addLevel({
                level: newLevel,
                groups: []
            });
            notifications.success('Niveau ajouté avec succès', ' Le niveau N°' + newLevel.id + ' - ' + newLevel.name + ' a été ajouté.');
        }).catch((err) => {
            notifications.error("Erreur lors de l'ajout du niveau", err.message);
        })
        notifications.promise(promise,{
            loading: "Ajout du niveau...",
            success: "Niveau ajouté avec succès !",
            error: "Erreur lors de l'ajout du niveau."
        })
    }

    const handleUpdateLevel = (levelID:number, levelPost: LevelPostDTO) => {
        if(!levelPost) return;
        const promise = updateLevelService(levelID, levelPost).then((updatedLevel) => {
            updateLevel(levelID,updatedLevel);
            notifications.success("Niveau mis à jour avec succès", " Le niveau N°" + updatedLevel.id + " - " + updatedLevel.name + " a été mis à jour.");
        }).catch((error) => {
            notifications.error("Erreur lors de la mise à jour du niveau", error.message);
        })
        notifications.promise(promise,{
            loading: "Mise à jour du niveau...",
            success: "Niveau mis à jour avec succès !",
            error: "Erreur lors de la mise à jour du niveau."
        })
    }

    const handleDeleteLevel = () => {
        setIsDeleteLevelDialogOpen(false);
        if(!editingLevel) return;
        const promise = removeLevelService(editingLevel.id).then(() => {
            removeLevel(editingLevel.id);
            notifications.success("Niveau supprimé avec succès", " Le niveau N°" + editingLevel.id + " - " + editingLevel.name + " a été supprimé.");
        }).catch((error) => {
            notifications.error("Erreur lors de la suppression du niveau", error.message);
        })
        notifications.promise(promise,{
            loading: "Suppression du niveau...",
            success: "Niveau supprimé avec succès !",
            error: "Erreur lors de la suppression du niveau."
        })
    }

    const openModal = (level: LevelDTO | null, action: string) => {
        setEditingLevel(level)
        if (action === "delete") setIsDeleteLevelDialogOpen(true);
        else setLevelModalOpen(true)
    }


    return (
        <div className="min-h-screen bg-background">
            <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <GraduationCap className="h-6 w-6 text-primary"/>
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-foreground text-balance">Gestion des
                                    Niveaux</h1>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {levels?.length || 0} niveaux • {totalGroups} groupes
                                </p>
                            </div>
                        </div>
                        <Button className="gap-2" onClick={() => openModal(null, 'add')}>
                            <Plus className="h-4 w-4"/>
                            Nouveau niveau
                        </Button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input
                            placeholder="Rechercher un niveau ou un groupe..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-background"
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {filteredLevels.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                            <Search className="h-8 w-8 text-muted-foreground"/>
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2">Aucun résultat</h3>
                        <p className="text-sm text-muted-foreground">Essayez de modifier votre recherche</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredLevels.map((levelDetail) => (
                            <LevelCard
                                key={levelDetail.level.id}
                                currentLevelDetails={levelDetail}
                                openModal={openModal}

                            />
                        ))}
                    </div>
                )}
            </div>

            <LevelModal
                open={levelModalOpen}
                onOpenChange={setLevelModalOpen}
                selectedLevel={editingLevel}
                handleAddLevel={handleAddLevel}
                handleUpdateLevel={handleUpdateLevel}
            />

            <ConfirmeDeleteComp isConfirmationModalOpen={isDeleteLevelDialogOpen}
                                setIsConfirmationModalOpen={setIsDeleteLevelDialogOpen}
                                handleRemoveItem={handleDeleteLevel} title={"Supprimer le niveau ?"}/>

        </div>
    )
}
