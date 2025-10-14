import {refreshToken} from "@/services/auth.service.ts";
import type {Tokens} from "@/types/token.type.ts";
import { sendMessage, listenMessage } from "./broadcast";

function decodeJwt<T = any>(jwt: string | null): T | null {
    if (!jwt) return null;
    const parts = jwt.split(".");
    if (parts.length !== 3) return null;
    try {
        const json = atob(
            parts[1]
                .replace(/-/g, "+")
                .replace(/_/g, "/")
                .padEnd(Math.ceil(parts[1].length / 4) * 4, "=")
        );
        return JSON.parse(json) as T;
    } catch {
        return null;
    }
}

// ---- Proactive refresh timer ----
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleProactiveRefresh(access?: string | null) {
    if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
    }
    const token = access ?? getAccess();
    const payload = decodeJwt<{ exp: number }>(token || null);
    if (!payload?.exp) return;

    const now = Math.floor(Date.now() / 1000);
    const ttl = payload.exp - now;
    // Refresh trước 60s (có thể chỉnh 90s/120s tuỳ thích)
    const waitMs = Math.max((ttl - 60) * 1000, 0);

    if (waitMs > 0) {
        refreshTimer = setTimeout(async () => {
            try {
                await refreshToken(); // interceptor sẽ tự set access mới
            } catch {
                clearTokens();
            }
        }, waitMs);
    }
}

const ACCESS_KEY = "token";
const hasWindow = typeof window !== "undefined";

export function getAccess(): string {
    if (!hasWindow) return "";
    return localStorage.getItem(ACCESS_KEY) || "";
}

// ✅ Trung tâm: setTokens tự schedule/clear
export function setTokens(tokens: Tokens, isFromBroadcast = false) {
    if (!hasWindow) return;
    const access = tokens?.accessToken ?? undefined;

    if (typeof access === "string" && access.trim()) {
        localStorage.setItem(ACCESS_KEY, access);
        scheduleProactiveRefresh(access);

        // Nếu hành động này không phải do broadcast gây ra, thì hãy broadcast cho các tab khác
        if (!isFromBroadcast) {
            sendMessage({ type: 'TOKEN_UPDATED', payload: { accessToken: access } });
        }
    } else {
        localStorage.removeItem(ACCESS_KEY);
        if (refreshTimer) clearTimeout(refreshTimer);
        refreshTimer = null;

        // Broadcast tin nhắn logout
        if (!isFromBroadcast) {
            sendMessage({ type: 'LOGOUT' });
        }
    }
}

export function clearTokens(isFromBroadcast = false) {
    if (!hasWindow) return;
    localStorage.removeItem(ACCESS_KEY);
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = null;

    if (!isFromBroadcast) {
        sendMessage({ type: 'LOGOUT' });
    }
}

export function isLoggedIn() {
    return !!getAccess();
}

// ---- Refresh queue (cho interceptor) ----
let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

export function queueRefresh(cb: (newAccess: string | null) => void) {
    queue.push(cb);
}

export function startRefreshing() {
    isRefreshing = true;
}

export function doneRefreshing(newAccess: string) {
    isRefreshing = false;
    // Khi refresh xong: lưu token + (setTokens sẽ tự schedule)
    setTokens({accessToken: newAccess});
    queue.forEach((fn) => fn(newAccess));
    queue = [];
}

export function failRefreshing() {
    isRefreshing = false;
    queue.forEach((fn) => fn(null));
    queue = [];
}

export function getRefreshing() {
    return isRefreshing;
}

if (hasWindow) {
    listenMessage((message) => {
        if (message.type === 'TOKEN_UPDATED') {
            setTokens({ accessToken: message.payload.accessToken }, true); // true để tránh broadcast ngược lại
        }
        if (message.type === 'LOGOUT') {
            clearTokens(true);
            // Có thể thêm window.location.href = '/login' để tự động chuyển trang
        }
    });
}
