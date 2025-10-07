import {ChevronRight, type LucideIcon} from "lucide-react"
import * as React from "react"
import {NavLink, useLocation, matchPath} from "react-router-dom"

import {
    Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction,
    SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {cn} from "@/lib/utils"

type NavSubItem = { title: string; url: string }
type NavItem = {
    title: string
    url: string
    icon?: LucideIcon
    match?: string | string[]
    items?: NavSubItem[]
    onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

const isPatternActive = (pathname: string, pattern: string) =>
    !!matchPath({path: pattern, end: !pattern.endsWith("/*")}, pathname)

export function NavMain({
                            items,
                            activeClassName = "bg-primary/10 text-primary",
                            activeSubClassName = "bg-primary/5 text-primary",
                            showLeftIndicator = true,
                        }: {
    items: NavItem[]
    /** màu/kiểu active cho item cha */
    activeClassName?: string
    /** màu/kiểu active cho submenu item */
    activeSubClassName?: string
    /** thêm vạch trái khi active */
    showLeftIndicator?: boolean
}) {
    const {pathname} = useLocation()

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Các trang chính</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const Icon = item.icon
                    const hasChildren = !!item.items?.length

                    const subActives = new Map<string, boolean>()
                    const hasActiveChild = !!item.items?.some((s) => {
                        const a = isPatternActive(pathname, s.url)
                        subActives.set(s.url, a)
                        return a
                    })

                    const patterns = Array.isArray(item.match) ? item.match : item.match ? [item.match] : [item.url]
                    const selfActive = patterns.some((p) => isPatternActive(pathname, p))
                    const active = selfActive || hasActiveChild

                    // indicator trái cho item cha
                    const leftBar = showLeftIndicator && active
                        ? "relative before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:rounded-full before:bg-primary"
                        : ""

                    if (hasChildren) {
                        return (
                            <Collapsible key={item.title} asChild defaultOpen={active}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        isActive={active}
                                        data-active={active ? "true" : undefined}
                                        className={cn(leftBar, active && activeClassName)}
                                        aria-expanded={active || undefined}
                                    >
                                        <NavLink to={item.url} onClick={item.onClick} end>
                                            {Icon ? <Icon/> : null}
                                            <span>{item.title}</span>
                                        </NavLink>
                                    </SidebarMenuButton>

                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuAction className="data-[state=open]:rotate-90" aria-label="Toggle">
                                            <ChevronRight/>
                                        </SidebarMenuAction>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items!.map((sub) => {
                                                const subActive = subActives.get(sub.url) === true
                                                return (
                                                    <SidebarMenuSubItem key={sub.title}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={subActive}
                                                            data-active={subActive ? "true" : undefined}
                                                            className={cn(subActive && activeSubClassName)}
                                                        >
                                                            <NavLink to={sub.url} end>
                                                                <span>{sub.title}</span>
                                                            </NavLink>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                )
                                            })}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        )
                    }

                    // item không có submenu
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                isActive={active}
                                data-active={active ? "true" : undefined}
                                className={cn(leftBar, active && activeClassName)}
                            >
                                <NavLink to={item.url} onClick={item.onClick} end>
                                    {Icon ? <Icon/> : null}
                                    <span>{item.title}</span>
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
