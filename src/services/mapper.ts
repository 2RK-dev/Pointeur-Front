import {
    IApiKeyResponse, IApiKeyResponseWithRawToken,
    ICreateScheduleItem,
    IGroup,
    IImportMapping,
    ILevel,
    IRoom,
    IScheduleItem,
    ITeacher,
    ITeachingUnit
} from "@/api/types";
import { GroupDTO } from "@/Types/GroupDTO";
import { Room } from "@/Types/Room";
import { TeachingUnit } from "@/Types/TeachingUnit";
import { Teacher } from "@/Types/Teacher";
import { ScheduleItem, ScheduleItemPost } from "@/Types/ScheduleItem";
import { LevelDTO } from "@/Types/LevelDTO";
import { ImportMapping } from "@/lib/types";
import { ApiToken, ApiTokenResponse } from "@/Types/token";

export const LevelMapper = {
    fromDto(dto: ILevel): LevelDTO{
        return {
            id: dto.id,
            name: dto.name,
            abr: dto.abbreviation
        }
    }
}

export const GroupMapper = {
    fromDto (dto: IGroup): GroupDTO {
        return {
            id: dto.id,
            type: dto.type,
            classe: dto.classe,
            name: dto.name,
            size: dto.size,
            levelAbr: dto.level.name,
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

export const ImportMapper = {
    parseMapping: (mapping: ImportMapping[]) => {
        return mapping.reduce((acc: IImportMapping, m) => {
            const {sourceFileName, sourceSubFileName, tableName, columnMappings} = m;
            const sub = sourceSubFileName || "";
            if (!acc.metadata[sourceFileName]) acc.metadata[sourceFileName] = {};
            acc.metadata[sourceFileName][sub] = {
                entityType: tableName || "",
                headersMapping: Object.fromEntries(columnMappings
                    .filter(c => !!c)
                    .map(c => [c.fileColumn, c.tableColumn || ""])
                ),
            };
            return acc;
        }, {metadata: {}} as IImportMapping);
    }
}

export const ApiTokenMapper = {
    fromDto (dto: IApiKeyResponse): ApiToken {
        return {
            name: dto.name,
            id: dto.id + "",
            prefix: dto.prefix,
            createdAt: new Date(dto.createdAt),
        }
    },
    fromDtoWithRawToken (dto: IApiKeyResponseWithRawToken): ApiTokenResponse {
        return {
            token: dto.rawToken,
            name: dto.name,
            id: dto.id + "",
            prefix: dto.prefix,
            createdAt: new Date(dto.createdAt)
        }
    },
}
