import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
	return (
		<div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
			{/* <AdminSidebar /> */}
			<div className="flex-1 flex flex-col">
				{/* <AdminNavbar /> */}
				<main className="flex-1 w-full p-6 overflow-x-clip overflow-y-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
