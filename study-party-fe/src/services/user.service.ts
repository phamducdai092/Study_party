import http from "@/lib/http.ts";
import type {UserInformationUpdatePayload} from "@/types/user.type.ts";

export const updateUserProfile = ( userInformation: UserInformationUpdatePayload) => {
    return http.put("user/me", userInformation);
}