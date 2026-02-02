import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { attachmentService } from "@/services/attachment.service.ts";

export const attachmentKeys = {
    all: ['group-attachments'] as const,
    list: (groupId: number, page: number, size: number, sort: string) =>
        [...attachmentKeys.all, groupId, page, size, sort] as const,
};

type UseGroupAttachmentsOptions = {
    page?: number;
    size?: number;
    sort?: string;
    enabled?: boolean;
}

export function useGroupAttachments(groupId: number, options: UseGroupAttachmentsOptions = {}) {
    const { page = 0, size = 5, sort = 'uploadedAt', enabled = true } = options;

    return useQuery({
        queryKey: attachmentKeys.list(groupId, page, size, sort),
        queryFn: async () => {
            const res = await attachmentService.getGroupAttachments(groupId, page, size, sort);
            return {
                items: res.data || [],
                meta: res.meta
            };
        },
        placeholderData: keepPreviousData, // Giữ dữ liệu cũ khi chuyển trang để không bị nháy
        staleTime: 1000 * 60 * 5, // Cache 5 phút
        enabled: !!groupId && enabled,
    });
}

export const myAttachmentKeys = {
    all: ['my-attachments'] as const,
    list: (page: number, size: number, sort: string) =>
        [...myAttachmentKeys.all, page, size, sort] as const,
};

export function useMyAttachments(page: number, size: number, sort: string) {
    return useQuery({
        queryKey: myAttachmentKeys.list(page, size, sort),
        queryFn: async () => {
            const res = await attachmentService.getMyAttachments(page, size, sort);
            return {
                items: res.data || [],
                meta: res.meta
            };
        },
        placeholderData: keepPreviousData, // Giữ data cũ khi chuyển trang
        staleTime: 1000 * 60 * 2, // Cache 2 phút
    });
}