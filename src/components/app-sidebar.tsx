"use client"
import { LayoutDashboard, CheckSquare, Clock, Wallet, BookOpen } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Menu items.
const items = [
    {
        title: "概览",
        url: "/",
        icon: LayoutDashboard,
    },
    {
        title: "任务",
        url: "/tasks",
        icon: CheckSquare,
    },
    {
        title: "专注",
        url: "/focus",
        icon: Clock,
    },
    {
        title: "财务",
        url: "/finance",
        icon: Wallet,
    },
    {
        title: "日记",
        url: "/journal",
        icon: BookOpen,
    },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar>
            <SidebarHeader >
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Nexus
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Context OS</p>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                    >
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
