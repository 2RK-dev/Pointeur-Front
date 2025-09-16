import { IGroup, IRoom, IScheduleItem, ITeacher, ITeachingUnit } from "@/api/types";
import { Group } from "@/Types/Group";
import { Room } from "@/Types/Room";
import { TeachingUnit } from "@/Types/TeachingUnit";
import { Teacher } from "@/Types/Teacher";
import { ScheduleItem } from "@/Types/ScheduleItem";

export const GroupMapper = {
    fromDto (dto: IGroup): Group {
        return {
            id: dto.id,
            abr: dto.name,
            name: dto.name,
            size: dto.size
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
            associatedLevels: dto.level?.id
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
            Room: RoomMapper.fromDto(dto.room),
            Groups: dto.groups.map(g => GroupMapper.fromDto(g))
        };
    },
}