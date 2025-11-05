import { ICreateScheduleItem, IGroup, IRoom, IScheduleItem, ITeacher, ITeachingUnit } from "@/api/types";
import { Group } from "@/Types/Group";
import { Room } from "@/Types/Room";
import { TeachingUnit } from "@/Types/TeachingUnit";
import { Teacher } from "@/Types/Teacher";
import { ScheduleItem, ScheduleItemPost } from "@/Types/ScheduleItem";

export const GroupMapper = {
    fromDto (dto: IGroup): Group {
        return {
            id: dto.id,
            abr: dto.name,
            name: dto.name,
            size: dto.size,
            levelName: dto.level.name,
            levelId: dto.level.id
        };
    },
}

export const RoomMapper = {
    fromDto (dto: IRoom): Room {
        return {
            id: dto.id,
            abr: dto.abbreviation,
            name: dto.name,
            capacity: dto.size
        };
    },
}

export const TeachingUnitMapper = {
    fromDto (dto: ITeachingUnit): TeachingUnit {
        return {
            id: dto.id,
            abr: dto.abbreviation,
            name: dto.name,
            associatedLevels: dto.level?.id || null
        };
    },
}

export const TeacherMapper = {
    fromDto (dto: ITeacher): Teacher {
        return {
            id: dto.id,
            name: dto.name,
            abr: dto.abbreviation
        };
    },
}

export const ScheduleItemMapper = {
    fromDto (dto: IScheduleItem): ScheduleItem {
        return {
            id: dto.id,
            startTime: new Date(dto.startTime),
            endTime: new Date(dto.endTime),
            Teacher: TeacherMapper.fromDto(dto.teacher),
            TeachingUnit: TeachingUnitMapper.fromDto(dto.teachingUnit),
            Room: dto.room ? RoomMapper.fromDto(dto.room) : null,
            Groups: dto.groups.map(g => GroupMapper.fromDto(g))
        };
    },
    iCreateItemFromItemPost (dto: ScheduleItemPost): ICreateScheduleItem {
        return {
            startTime: dto.startTime,
            endTime: dto.endTime,
            groupIds: dto.GroupIds.map(s => parseInt(s, 10)),
            teacherId: dto.TeacherId,
            teachingUnitId: dto.TeachingUnitID,
            roomId: dto.RoomId
        };
    },
    itemPostFromICreateItem (dto: ICreateScheduleItem): ScheduleItemPost {
        return {
            GroupIds: dto.groupIds.map(id => "" + id),
            RoomId: dto.roomId,
            TeacherId: dto.teacherId,
            TeachingUnitID: dto.teachingUnitId,
            endTime: dto.startTime,
            startTime: dto.endTime
        };
    }
}