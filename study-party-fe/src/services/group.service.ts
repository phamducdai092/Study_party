import http from "@/lib/http";
import type {PagingPayload} from "@/types/paging.type.ts";
import type {ApiResponse} from "@/types/enum.type.ts";
import type {Room} from "@/types/group.type.ts";

export const getRoomsUserJoined = async (pagingPayload?: PagingPayload) => {
    const res = await http.get<ApiResponse<Room[]>>("groups/joined", {params: pagingPayload});
    return res.data;
};

export const getRoomsUserOwned = async (pagingPayload?: PagingPayload) => {
    const res = await http.get<ApiResponse<Room[]>>("groups/owned", {params: pagingPayload})
    return res.data;
}