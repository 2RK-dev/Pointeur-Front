"use server"

import { GroupDTO, GroupPost } from "@/Types/GroupDTO";
import { createGroup, deleteGroup, updateGroup } from "@/api/http/group";
import { GroupMapper } from "@/services/mapper";

export async function addGroupService(groupPost: GroupPost): Promise<GroupDTO>{
    const createdGroup = await createGroup(groupPost.levelId, {
        classe: groupPost.classe,
        name: groupPost.name,
        size: groupPost.size,
        type: groupPost.type
    });
    return GroupMapper.fromDto(createdGroup);
}

export async function updateGroupService (groupId: number, groupPost: GroupPost): Promise<GroupDTO> {
    const updatedGroup = await updateGroup(groupPost.levelId, groupId, {
        classe: groupPost.classe,
        name: groupPost.name,
        size: groupPost.size,
        type: groupPost.type
    });
    return GroupMapper.fromDto(updatedGroup);
}

export async function removeGroupService(levelId: number, groupId: number): Promise<void> {
    await deleteGroup(levelId, groupId);
}