import axios, {
	AxiosError,
	type AxiosRequestConfig
} from "axios";
import {
	getAccess,
	setTokens,
	clearTokens,
	getRefreshing,
	startRefreshing,
	doneRefreshing,
	failRefreshing,
	queueRefresh,
} from "./token";
import {authService} from "@/services/auth.service.ts";

// 🔧 Normalize baseURL: bỏ trailing slash để tránh // khi ghép path
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

// ⚙️ Base URL + cookies (bắt buộc for refresh cookie)
const http = axios.create({
	baseURL: API_BASE,
	withCredentials: true,
	// timeout: 15000,
});

// ───────────────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────────────
function getPath(u?: string): string {
	if (!u) return "";
	try {
		if (/^https?:\/\//i.test(u)) return new URL(u).pathname;
		return u.startsWith("/") ? u : "/" + u;
	} catch {
		return u;
	}
}

function isRefreshUrl(u?: string) {
	const p = getPath(u);
	return p.startsWith("/auth/refresh");
}

function isPublicAuthUrl(u?: string) {
	const p = getPath(u);
	// Các endpoint không cần/bị cấm gắn Authorization
	return (
		p.startsWith("/auth/login") ||
		p.startsWith("/auth/refresh") ||
		p.startsWith("/auth/logout") ||
		p.startsWith("/account/register")
	);
}

function attachAccess(config: AxiosRequestConfig, token?: string) {
	if (!token) return config;
	config.headers = config.headers ?? {};
	(config.headers as any).Authorization = `Bearer ${token}`;
	return config;
}

// 🚧 Chuẩn hoá url relative: ép bỏ leading slash để khớp baseURL đã cắt trailing
function normalizeRelativeUrl(u?: string): string | undefined {
	if (!u) return u;
	if (/^https?:\/\//i.test(u)) return u; // absolute thì kệ
	return u.replace(/^\/+/, ""); // "/groups/joined" -> "groups/joined"
}

// ───────────────────────────────────────────────────────────────────────────────
// Request interceptor: gắn Authorization + normalize url
// ───────────────────────────────────────────────────────────────────────────────
http.interceptors.request.use((config) => {
	// ⚠️ Loại bỏ leading slash để tránh tạo "//"
	if (typeof config.url === "string") {
		config.url = normalizeRelativeUrl(config.url);
	}

	if (!isPublicAuthUrl(config.url)) {
		const access = getAccess?.();
		if (access && access !== "null" && access !== "undefined" && access.trim()) {
			attachAccess(config, access);
		}
	}
	return config;
});

// ───────────────────────────────────────────────────────────────────────────────
// Response interceptor: handle 401 → refresh queue (không loop /auth/refresh)
// ───────────────────────────────────────────────────────────────────────────────
http.interceptors.response.use(
	(res) => {
		// --- UNWRAP ---
		const rt = res.config?.responseType;
		if (rt !== "blob" && rt !== "arraybuffer") {
			const body = res.data;
			(res as any).meta = body?.meta;
			(res as any).raw  = body;
			(res as any).data = body && typeof body === "object" && "data" in body ? body.data : body;
		}
		return res;
	},
	async (error: AxiosError) => {
		const status = error.response?.status;
		const original = (error.config || {}) as AxiosRequestConfig & { _retry?: boolean };
		const url = original?.url || "";

		// bắt 401 và 403
		if (status !== 401 && status !== 403 /* && status !== 419 */) {
			return Promise.reject(error);
		}
		if (isRefreshUrl(url) || getPath(url).startsWith("/auth/login")) {
			clearTokens?.();
			return Promise.reject(error);
		}
		if (original._retry) {
			clearTokens?.();
			return Promise.reject(error);
		}

		if (getRefreshing?.()) {
			return new Promise((resolve, reject) => {
				queueRefresh?.((newAccess) => {
					if (!newAccess) return reject(error);
					const cfg: AxiosRequestConfig = { ...original, _retry: true };
					cfg.url = normalizeRelativeUrl(cfg.url);
					attachAccess(cfg, newAccess);
					resolve(http(cfg));
				});
			});
		}

		startRefreshing?.();
		try {
			const { data } = await authService.refreshToken();
			const newAccess: string | undefined = (data as any)?.data?.accessToken || (data as any)?.accessToken;
			if (!newAccess) {
				failRefreshing?.(); clearTokens?.();
				return Promise.reject(error);
			}
			setTokens?.({ accessToken: newAccess });
			doneRefreshing?.(newAccess);

			const retryCfg: AxiosRequestConfig = { ...original, _retry: true };
			retryCfg.url = normalizeRelativeUrl(retryCfg.url);
			attachAccess(retryCfg, newAccess);
			return http(retryCfg);
		} catch (e) {
			failRefreshing?.(); clearTokens?.();
			return Promise.reject(error);
		}
	}
);

export default http;
