import http from "@/lib/http.ts";
import type {UnwrappedResponse} from "@/types/api.type.ts";
import type {AttachmentDetailResponse} from "@/types/attachment/attachment.type.ts";

export const attachmentService = {
    getGroupAttachments: async (groupId: number, page: number, size: number, sort: string) => {
        const res = await http.get<AttachmentDetailResponse[]>(`attachments/${groupId}`, {
            params: {
                page: page || 0,
                size: size || 5,
                sort: sort || 'uploadedAt'
            }
        })
        return res as UnwrappedResponse<AttachmentDetailResponse[]>;
    },

    getMyAttachments: async (page: number, size: number, sort: string) => {
        const res = await http.get<AttachmentDetailResponse[]>('user/me/attachments', {
            params: {
                page: page || 0,
                size: size || 12,
                sort: sort || 'uploadedAt'
            }
        });
        return res as UnwrappedResponse<AttachmentDetailResponse[]>;
    }
}