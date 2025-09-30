import {NavLink, Outlet} from "react-router-dom";
import {ScrollArea} from "@/components/ui/scroll-area";
import {cn} from "@/lib/utils";

const items = [
    {to: "/settings", label: "Hồ sơ", end: true},
    {to: "/settings/account", label: "Tài khoản"},
    {to: "/settings/security", label: "Bảo mật"},
    {to: "/settings/notifications", label: "Thông báo"},
    {to: "/settings/privacy", label: "Riêng tư"},
    {to: "/settings/connections", label: "Kết nối"},
    {to: "/settings/appearance", label: "Giao diện"},
];

export default function SettingsLayout() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 px-4 py-6">
            <aside className="text-left lg:sticky lg:top-16 self-start">
                <div className="my-4 text-center">
                    Cài Đặt
                </div>
                <nav className="space-y-1">
                    {items.map(i => (
                        <NavLink key={i.to} to={i.to} end={i.end}
                                 className={({isActive}) => cn(
                                     "block px-3 py-2 rounded-md text-sm transition-colors",
                                     isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                                 )}>
                            {i.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>
            <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="pr-2">
                    <Outlet/>
                </div>
            </ScrollArea>
        </div>
    );
}
