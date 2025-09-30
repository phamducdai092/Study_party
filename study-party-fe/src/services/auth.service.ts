import http from "@/lib/http.ts";
import type { AuthResponse, LoginPayload, RegisterPayload, TokenPair } from "@/types/auth.type.ts";
import { clearTokens } from "@/lib/token.ts";

export const login = (payload: LoginPayload) => {
	return http.post<AuthResponse>("auth/login", payload);
};

export const register = (payload: RegisterPayload) => {
	return http.post<AuthResponse>("auth/register", payload);
};

export const logout = () => {
	clearTokens();
	return http.post("auth/logout");
};

export const loadMe = () => {
	return http.get("user/me");
};

export const refreshToken = () => {
    return http.post<TokenPair>("auth/refresh");
}