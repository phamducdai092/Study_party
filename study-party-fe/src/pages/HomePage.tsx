import useAuthStore from '@/store/auth/authStore';
import { Button } from '@/components/ui/button';

export default function Home() {
	const { user, logout } = useAuthStore();
	return (
		<div className="p-6 space-y-4">
			<h1 className="text-2xl font-semibold">
				Hello {user?.email || 'there'} 👋
			</h1>
			<Button className="text-red-500" onClick={logout}>Đăng xuất</Button>
		</div>
	);
}
