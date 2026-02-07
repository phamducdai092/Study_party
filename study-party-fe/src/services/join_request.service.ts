import http from "@/lib/http.ts";
import type {ApiResponse, UnwrappedResponse} from "@/types/api.type.ts";
import type {JoinRequestForUser, JoinRequestResponse} from "@/types/group/join_request.type.ts";

const join_request_prefix = 'request/';


export const joinRequestService = {

    createJoinRequest: async (slug: string) => {
        const res = await http.post<ApiResponse<void>>(`${join_request_prefix}/${slug}`);
        return res.data;
    },

    cancelJoinRequest: async (slug: string) => {
        const res = await http.delete<ApiResponse<void>>(`${join_request_prefix}/${slug}`);
        return res.data;
    },

    approveJoinRequest: async (requestId: number) => {
        const res = await http.post<ApiResponse<void>>(`${join_request_prefix}/${requestId}/approve`);
        return res.data;
    },

    rejectJoinRequest: async (requestId: number) => {
        const res = await http.post<ApiResponse<void>>(`${join_request_prefix}/${requestId}/reject`);
        return res.data;
    },

    getJoinRequestsForGroup: async (slug: string) => {
        const res = await http.get<JoinRequestResponse[]>(`${join_request_prefix}/group/${slug}`);
        return res as unknown as UnwrappedResponse<JoinRequestResponse[]>;
    },

    getJoinRequestsByUser: async (
        params?: {
            page?: number;
            size?: number;
        }
    ) => {
        const res = await http.get<JoinRequestForUser[]>(`${join_request_prefix}/user`, {params});
        return res as unknown as UnwrappedResponse<JoinRequestForUser[]>;
    },
}
