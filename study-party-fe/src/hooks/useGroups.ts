import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {groupService} from "@/services/group.service";
import type {TableParams} from "@/types/paging.type.ts";

// 1. Type
export type GroupListType = 'joined' | 'owned' | 'discover';

// 2. Key Factory (Thêm params vào key để cache chuẩn từng mm)
export const groupListKeys = {
    all: ['groups-list'] as const,
    list: (type: GroupListType, params: TableParams) =>
        [...groupListKeys.all, type, params] as const,
};

// 3. Hook chính
export function useGroups(type: GroupListType, params: TableParams, enabled = true) {

    // Map API call tương ứng với type
    const apiCall = {
        joined: groupService.getRoomsUserJoined,
        owned: groupService.getRoomsUserOwned,
        discover: groupService.getRoomsDiscover,
    }[type];

    return useQuery({
        // Key thay đổi theo params -> Tự động refetch
        queryKey: groupListKeys.list(type, params),

        queryFn: async () => {
            const res = await apiCall(params);
            return {
                items: res.data || [],
                meta: res.meta
            };
        },
        placeholderData: keepPreviousData, // Giữ data cũ cho đỡ giật lag
        staleTime: 1000 * 60 * 2, // 2 phút
        enabled: enabled,
    });
}