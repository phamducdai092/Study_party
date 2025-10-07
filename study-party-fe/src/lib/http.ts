import axios, {
	AxiosError,
	type AxiosRequestConfig,
	type AxiosResponse,
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

// ⚙️ Base URL + cookies (bắt buộc for refresh cookie)
const http = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
	// timeout: 15000, // bật nếu muốn
});

// ───────────────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────────────
function getPath(u?: string): string {
	if (!u) return "";
	// axios config.url có thể là relative hoặc absolute
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

// ───────────────────────────────────────────────────────────────────────────────
// Request interceptor: gắn Authorization nếu có accessToken và không phải auth public
// ───────────────────────────────────────────────────────────────────────────────
http.interceptors.request.use((config) => {
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
	(res: AxiosResponse) => res,
	async (error: AxiosError) => {
		const status = error.response?.status;
		const original = (error.config || {}) as AxiosRequestConfig & { _retry?: boolean };
		const url = original?.url || "";

		// Nếu lỗi không phải 401, trả về luôn
		if (status !== 401) {
			return Promise.reject(error);
		}

		// 401 cho chính /auth/refresh hoặc /auth/login → không cố gắng refresh nữa
		if (isRefreshUrl(url) || getPath(url).startsWith("/auth/login")) {
			// Dọn auth state để FE chuyển hướng login (tuỳ logic app)
			clearTokens?.();
			return Promise.reject(error);
		}

		// Tránh retry vô hạn trên cùng request
		if (original._retry) {
			clearTokens?.();
			return Promise.reject(error);
		}

		// Nếu đang refresh: xếp hàng đợi token mới
		if (getRefreshing?.()) {
			return new Promise((resolve, reject) => {
				queueRefresh?.((newAccess) => {
					if (!newAccess) return reject(error);
					const cfg: AxiosRequestConfig = { ...original, _retry: true };
					attachAccess(cfg, newAccess);
					resolve(http(cfg));
				});
			});
		}

		// Bắt đầu refresh
		startRefreshing?.();
		try {
			// Dùng axios gốc (không interceptor) + withCredentials để mang cookie refresh
			const { data } = await axios.post(
				`${import.meta.env.VITE_API_URL}/auth/refresh`,
				{},
				{ withCredentials: true }
			);
			const newAccess: string | undefined =
				(data as any)?.data?.accessToken || (data as any)?.accessToken;

			if (!newAccess) {
				failRefreshing?.();
				clearTokens?.();
				return Promise.reject(error);
			}

			// Lưu token mới + đánh thức hàng đợi
			setTokens?.({ accessToken: newAccess });
			doneRefreshing?.(newAccess);

			// Retry request gốc với token mới
			const retryCfg: AxiosRequestConfig = { ...original, _retry: true };
			attachAccess(retryCfg, newAccess);
			return http(retryCfg);
		} catch (e) {
			// Refresh thất bại: dọn dẹp và thông báo fail cho hàng đợi
			failRefreshing?.();
			clearTokens?.();
			return Promise.reject(error);
		}
	}
);

export default http;
