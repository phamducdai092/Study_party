// import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

// type LayoutProps = { children?: ReactNode };

export default function Layout() {
	return (
		<div className="min-h-screen w-full flex flex-col">
			<main className="flex-1 w-full overflow-x-clip p-4">
				<Outlet />
			</main>
		</div>
	);
}
