import {ChevronRight, type LucideIcon} from "lucide-react"
import * as React from "react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

type NavSubItem = {
    title: string
    url: string
    isActive?: boolean
}

type NavItem = {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: NavSubItem[]
    onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

export function NavMain({items}: { items: NavItem[] }) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Trang chính</SidebarGroupLabel>

            <SidebarMenu>
                {items.map((item) => {
                    const hasChildren = !!item.items?.length
                    const Icon = item.icon

                    // ---- CASE 1: Item có submenu (Collapsible) ----
                    if (hasChildren) {
                        return (
                            <Collapsible
                                key={item.title}
                                asChild
                                defaultOpen={!!item.isActive}
                            >
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        data-active={item.isActive ? "" : undefined}
                                        aria-expanded={item.isActive ? true : undefined}
                                    >
                                        <a href={item.url} onClick={item.onClick}>
                                            {Icon ? <Icon/> : null}
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>

                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuAction
                                            className="data-[state=open]:rotate-90"
                                            aria-label="Toggle submenu"
                                        >
                                            <ChevronRight/>
                                        </SidebarMenuAction>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items!.map((sub) => (
                                                <SidebarMenuSubItem key={sub.title}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        data-active={sub.isActive ? "" : undefined}
                                                    >
                                                        <a href={sub.url}>
                                                            <span>{sub.title}</span>
                                                        </a>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        )
                    }

                    // ---- CASE 2: Item không có submenu (link thường) ----
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                data-active={item.isActive ? "" : undefined}
                            >
                                <a href={item.url} onClick={item.onClick}>
                                    {Icon ? <Icon/> : null}
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
