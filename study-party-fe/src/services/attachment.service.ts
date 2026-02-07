import http from "@/lib/http.ts";
import type {UnwrappedResponse} from "@/types/api.type.ts";
import type {AttachmentDetailResponse} from "@/types/attachment/attachment.type.ts";
import type {TableParams} from "@/types/paging.type.ts";

export const attachmentService = {
    getGroupAttachments: async (groupId: number, params: TableParams) => {

        const {filters, ...rest} = params;
        const finalParams = {...rest, ...filters};

        const res = await http.get<AttachmentDetailResponse[]>(`attachments/${groupId}`, {
            params: finalParams,
        })
        return res as UnwrappedResponse<AttachmentDetailResponse[]>;
    },

    getMyAttachments: async (params: TableParams) => {

        const {filters, ...rest} = params;
        const finalParams = {...rest, ...filters};

        const res = await http.get<AttachmentDetailResponse[]>('user/me/attachments', {
            params: finalParams,
        });
        return res as UnwrappedResponse<AttachmentDetailResponse[]>;
    }
}