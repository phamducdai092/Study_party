import { Outlet } from 'react-router-dom';

export default function UserLayout() {
	return (
		<div className="flex min-h-screen w-full">
			{/* <UserSidebar /> */}
			<div className="flex-1 flex flex-col">
				<main className="flex-1 w-full px-4 py-6 overflow-x-clip">
					<div className="mx-auto w-full">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}
