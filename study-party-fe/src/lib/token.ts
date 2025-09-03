export type Tokens = { accessToken?: string; refreshToken?: string };

const ACCESS_KEY = 'token';
const REFRESH_KEY = 'refreshToken';

const hasWindow = typeof window !== 'undefined';

export function getAccess(): string {
	if (!hasWindow) return '';
	return localStorage.getItem(ACCESS_KEY) || '';
}

export function getRefresh(): string {
	if (!hasWindow) return '';
	return localStorage.getItem(REFRESH_KEY) || '';
}

export function setTokens(tokens: Tokens) {
	if (!hasWindow) return;
	const { accessToken, refreshToken } = tokens;
	if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
	if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
	if (!hasWindow) return;
	localStorage.removeItem(ACCESS_KEY);
	localStorage.removeItem(REFRESH_KEY);
}

export function isLoggedIn() {
	return !!getAccess();
}

// Cho phép modules khác listen thay đổi token (ví dụ sync nhiều tab)
type Sub = (t: Tokens | null) => void;
const subs = new Set<Sub>();

export function subscribeTokenChange(cb: Sub) {
	subs.add(cb);
	return () => subs.delete(cb);
}

function notify(t: Tokens | null) {
	subs.forEach((cb) => cb(t));
}

// Optional: sync giữa tabs
if (hasWindow) {
	window.addEventListener('storage', (e) => {
		if (e.key === ACCESS_KEY || e.key === REFRESH_KEY) {
			notify({ accessToken: getAccess(), refreshToken: getRefresh() });
		}
	});
}

// -------- Refresh manager (singleton) ----------
let isRefreshing = false;
let queue: Array<(token: string) => void> = [];

export function queueRefresh(cb: (newAccess: string) => void) {
	queue.push(cb);
}

export function startRefreshing() {
	isRefreshing = true;
}

export function doneRefreshing(newAccess: string) {
	isRefreshing = false;
	queue.forEach((fn) => fn(newAccess));
	queue = [];
}

export function failRefreshing() {
	isRefreshing = false;
	queue = [];
}

export function getRefreshing() {
	return isRefreshing;
}
