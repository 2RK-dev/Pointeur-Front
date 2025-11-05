"use server"

import {GroupDTO, GroupPost} from "@/Types/GroupDTO";

export async function addGroupService(groupPost: GroupPost): Promise<GroupDTO>{
    //TODO: implement API call to add group
    throw new Error('Not implemented');
}

export async function updateGroupService(groupId:number,groupPost: GroupPost): Promise<GroupDTO>{
    //TODO: implement API call to update group
    throw new Error('Not implemented');
}

export async function removeGroupService(groupId: number): Promise<void> {
   //TODO: implement API call to remove group
    throw new Error('Not implemented');
}