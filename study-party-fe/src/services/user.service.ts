import http from "@/lib/http.ts";
import type {UserInformationResponse, UserInformationUpdatePayload, UserSearchResponse} from "@/types/user.type.ts";
import type {ApiResponse, UnwrappedResponse} from "@/types/api.type.ts";
import type {TableParams} from "@/types/paging.type.ts";


export const userService = {

    updateUserProfile: (userInformation: UserInformationUpdatePayload) => {
        return http.put("user/me", userInformation);
    },

// GET /user/{userId}
    getUserProfile: async (userId: number) => {
        const res = await http.get<ApiResponse<UserInformationResponse>>(`/user/${userId}`);
        return res.data;
    },

// GET /user/search
    searchUsers: async (
        params: TableParams
    ) => {

        const {filters, ...rest} = params;
        const finalParams = {...rest, ...filters};

        const res = await http.get<UserSearchResponse[]>(`/user/search`, {
            params: finalParams,
        });
        return res as UnwrappedResponse<UserSearchResponse[]>;
    },

}