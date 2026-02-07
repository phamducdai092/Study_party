import http from "@/lib/http.ts";
import type {ApiResponse, UnwrappedResponse} from "@/types/api.type.ts";
import type {MemberResponse} from "@/types/group/member.type.ts";
import type {MemberRole} from "@/types/enum/group.enum.ts";
import type {TableParams} from "@/types/paging.type.ts";

const groupMemberPrefix = '/groups/members'

export const groupMemberService = {
    getGroupMembers: async (groupId: number, params: TableParams) => {

        const {filters, ...rest} = params;
        const finalParams = {...rest, ...filters};

        const res = await http.get<MemberResponse[]>(`${groupMemberPrefix}/${groupId}`, {
            params: finalParams,
        });
        return res as UnwrappedResponse<MemberResponse[]>;
    },

    leaveGroup: async (groupId: number) => {
        const res = await http.delete<ApiResponse<void>>(`${groupMemberPrefix}/${groupId}/leave`);
        return res.data;
    },

    kickGroupMember: async (groupId: number, memberId: number) => {
        const res = await http.delete<ApiResponse<void>>(`${groupMemberPrefix}/${groupId}/kick/${memberId}`);
        return res.data;
    },

    setMemberRole: async (groupId: number, memberId: number, newMemberRole: MemberRole) => {
        const res = await http.put<ApiResponse<void>>(`${groupMemberPrefix}/${groupId}/role/${memberId}`, {newMemberRole});
        return res.data;
    },

    transferGroupOwnership: async (groupId: number, newOwnerId: number) => {
        const res = await http.put<ApiResponse<void>>(`${groupMemberPrefix}/${groupId}/transfer-ownership/${newOwnerId}`);
        return res.data;
    },
}
