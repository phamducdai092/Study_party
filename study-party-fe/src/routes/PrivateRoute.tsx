import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '@/store/auth/authStore';
import { getAccess } from '@/lib/token';

export default function PrivateRoute() {
	const user = useAuthStore((s) => s.user);
	const isLoadingMe = useAuthStore((s) => s.isLoadingMe); // nhớ có cờ này trong store

	const hasToken =
		!!getAccess() &&
		getAccess() !== 'null' &&
		getAccess() !== 'undefined' &&
		getAccess()!.trim() !== '';

	// Không có token -> về login
	if (!hasToken) return <Navigate to="/login" replace />;

	// Có token nhưng chưa có user (đang fetch ở App) -> show loading
	if (isLoadingMe || !user) {
		return (
			<div className="min-h-screen grid place-items-center">
				Đang kiểm tra…
			</div>
		);
	}

	return <Outlet />;
}
