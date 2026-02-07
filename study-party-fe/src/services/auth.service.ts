import http from "@/lib/http.ts";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth.type.ts";
import { clearTokens } from "@/lib/token.ts";
import type {TokenPair} from "@/types/token.type.ts";

export const authService = {
	login: (payload: LoginPayload) => {
		return http.post<AuthResponse>("auth/login", payload, { withCredentials: true });
	},

	register: (payload: RegisterPayload) => {
		return http.post<void>("auth/register", payload,  { withCredentials: true });
	},

	logout: async () => {
		try {
			await http.post("/auth/logout");
		} catch (error) {
			console.error("Lỗi logout API:", error);
		} finally {
			clearTokens();
		}
	},

	loadMe: () => {
		return http.get("user/me");
	},

	refreshToken: () => {
		return http.post<TokenPair>("auth/refresh", {}, { withCredentials: true });
	},
}