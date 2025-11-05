"use client"

import {useState} from "react"
import {Card} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {GraduationCap, Pencil, Plus, Trash2, Users} from "lucide-react"
import {LevelDetailsDTO, LevelDTO} from "@/Types/LevelDTO";
import {GroupDTO, GroupPost} from "@/Types/GroupDTO";
import {GroupModal} from "./group-modal"
import ConfirmeDeleteComp from "@/components/ConfirmeDeleteComp";
import {useLevelStore} from "@/Stores/Level";
import {addGroupService, removeGroupService, updateGroupService} from "@/services/Group";

interface props {
    currentLevelDetails: LevelDetailsDTO,
    openModal: (level: LevelDTO, action: string) => void,
}

export function LevelCard({
                              currentLevelDetails,
                              openModal
                          }: props) {
    const {level, groups} = currentLevelDetails
    const addGroupInLevel = useLevelStore((s => s.addGroupInLevel))
    const updateGroupInLevel = useLevelStore((s => s.updateGroupInLevel))
    const removeGroupInLevel = useLevelStore((s => s.removeGroupInLevel))
    const [groupModalOpen, setGroupModalOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState<GroupDTO | null>(null)

    const handleUpdateGroup = (groupId: number, groupPost: GroupPost) => {
        if (!selectedGroup) return;
        updateGroupService(groupId, groupPost).then((updatedGroup) => {
            updateGroupInLevel(level.id, updatedGroup)
        }).catch(error => {
            console.error("Failed to update group:", error);
        })
    }

    const handleAddGroup = (groupPost: GroupPost) => {
        addGroupService(groupPost).then((newGroup) => {
            addGroupInLevel(level.id, newGroup)
        }).catch(error => {
            console.error("Failed to add group:", error);
        })
    }


    const handleDeleteGroup = () => {
        if (!selectedGroup) return;
        removeGroupService(level.id, selectedGroup.id).then(() => {
            removeGroupInLevel(level.id, selectedGroup.id)
        }).catch((error) => {
            console.error("Failed to delete group:", error);
        })
        setDeleteDialogOpen(false)
    }


    return (
        <>
            <Card className="overflow-hidden border-border/50 bg-card hover:border-primary/30 transition-colors">
                <div className="p-6 border-b border-border/50 bg-muted/30">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="text-sm font-mono px-3 py-1">
                                    {level.abr}
                                </Badge>
                                <h3 className="text-xl font-semibold text-foreground">{level.name}</h3>
                            </div>
                            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                                <GraduationCap className="h-4 w-4"/>
                                <span>{groups.length} groupes</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => {
                                setSelectedGroup(null)
                                setGroupModalOpen(true)
                            }}>
                                <Plus className="h-4 w-4"/>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openModal(level, "edit")}>
                                <Pencil className="h-4 w-4"/>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openModal(level, "delete")}>
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid gap-3">
                        {groups.map((group) => (
                            <div
                                key={group.id}
                                className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground">{group.name}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-muted-foreground">{group.classe}</span>
                                            <span className="text-xs text-border">•</span>
                                            <Badge variant="outline" className="text-xs">
                                                {group.type}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground"/>
                                        <span className="text-sm font-medium text-foreground">{group.size}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8"
                                                onClick={() => {
                                                    setSelectedGroup(group)
                                                    setGroupModalOpen(true)
                                                }}>
                                            <Pencil className="h-3.5 w-3.5"/>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8"
                                                onClick={() => {
                                                    setSelectedGroup(group)
                                                    setDeleteDialogOpen(true)
                                                }}>
                                            <Trash2 className="h-3.5 w-3.5"/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <GroupModal
                open={groupModalOpen}
                onOpenChange={setGroupModalOpen}
                selectGroup={selectedGroup}
                handleAddGroup={handleAddGroup}
                handleUpdateGroup={handleUpdateGroup}
                currentLevelId={level.id}
            />

            <ConfirmeDeleteComp isConfirmationModalOpen={deleteDialogOpen}
                                setIsConfirmationModalOpen={setDeleteDialogOpen}
                                handleRemoveItem={handleDeleteGroup} title={"Supprimer le groupe ?"}/>
        </>
    )
}
