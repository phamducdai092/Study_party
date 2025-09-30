import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import {
    Home,
    BookOpen,
    Command,
    Settings2,
    LifeBuoy, Send, Frame, PieChart, Map, User, School, Files
} from "lucide-react";
import {NavMain} from "@/components/common/sidebar/nav-main.tsx";
// import {NavProjects} from "@/components/common/sidebar/nav-projects.tsx";
// import {NavSecondary} from "@/components/common/sidebar/nav-secondary.tsx";
import {NavUser} from "@/components/common/sidebar/nav-user.tsx";
import useAuthStore from "@/store/auth.store.ts";


// const settingItems = [
//     {to: "/settings", label: "Hồ sơ", end: true},
//     {to: "/settings/account", label: "Tài khoản"},
//     {to: "/settings/security", label: "Bảo mật"},
//     {to: "/settings/notifications", label: "Thông báo"},
//     {to: "/settings/privacy", label: "Riêng tư"},
//     {to: "/settings/connections", label: "Kết nối"},
//     {to: "/settings/appearance", label: "Giao diện"},
// ];

const data = {
    navMain: [
        {
            title: "Trang chủ",
            url: "/",
            icon: Home,
            isActive: true,
        },
        {
            title: "Trang cá nhân",
            url: "/me",
            icon: User,
        },
        {
            title: "Phòng học",
            url: "/rooms",
            icon: School,
        },
        {
            title: "FlashCards",
            url: "/flashcard",
            icon: BookOpen,
        },
        {
            title: "Tài liêu",
            url: "/docs",
            icon: Files,
        },
        {
            title: "Cài đặt",
            url: "/settings",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Support",
            url: "#",
            icon: LifeBuoy,
        },
        {
            title: "Feedback",
            url: "#",
            icon: Send,
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
}

export default function AppSidebar() {
    // const {pathname} = useLocation();
    // const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));
    const {user} = useAuthStore();
    return (
        <Sidebar
            collapsible="icon"
            className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border"
        >
            <SidebarHeader className="">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/">
                                <div
                                    className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Command className="size-4"/>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">Study party</span>
                                    <span className="truncate text-xs">Enterprise</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={data.navMain}/>
                {/*<NavProjects projects={data.projects}/>*/}
                {/*<NavSecondary items={data.navSecondary} className="mt-auto"/>*/}
            </SidebarContent>
            <SidebarFooter>
                <NavUser name={user!.displayName} email={user!.email} avatar={user!.avatarUrl}/>
            </SidebarFooter>
        </Sidebar>
    );
}
