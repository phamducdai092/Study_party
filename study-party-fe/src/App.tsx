import './App.css';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './routes';
import { ThemeProvider } from './components/theme/theme-provider';
import { Toaster } from './components/ui/sonner';
import useAuthStore from './store/auth/authStore';
import { useEffect, useRef } from 'react';
import { getAccess } from '@/lib/token';

function AppRoutes() {
	const element = useRoutes(routes);
	return element;
}

function App() {
	const loadMe = useAuthStore((s) => s.loadMe);
	const didInit = useRef(false);

	useEffect(() => {
		// Avoid double-run in React 18 StrictMode (dev)
		if (didInit.current) return;
		didInit.current = true;

		const token = getAccess();
		if (
			!token ||
			token === 'null' ||
			token === 'undefined' ||
			token.trim() === ''
		) {
			return; // chưa đăng nhập thì khỏi gọi /auth/me
		}

		// Chỉ gọi 1 lần khi app boot và có token
		loadMe().catch(() => {
			// optional: nếu token hết hạn thì store tự clear token/redirect
			// hoặc m xử lý show toast ở đây
		});
	}, [loadMe]);

	return (
		<BrowserRouter>
			<ThemeProvider defaultTheme="system" storageKey="theme">
				<AppRoutes />
				<Toaster />
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
