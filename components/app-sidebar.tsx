"use client"
import { HugeiconsIcon } from "@hugeicons/react"
import { DashboardSquare01Icon, Task01Icon, Clock01Icon, Wallet01Icon, BookOpen01Icon } from "@hugeicons/core-free-icons"
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
        icon: DashboardSquare01Icon,
    },
    {
        title: "任务",
        url: "/tasks",
        icon: Task01Icon,
    },
    {
        title: "专注",
        url: "/focus",
        icon: Clock01Icon,
    },
    {
        title: "财务",
        url: "/finance",
        icon: Wallet01Icon,
    },
    {
        title: "日记",
        url: "/journal",
        icon: BookOpen01Icon,
    },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader >
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Nexus
                </h1>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Context OS</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild
                                        isActive={pathname === item.url}
                                    >
                                        <Link href={item.url}>
                                            <HugeiconsIcon icon={item.icon} />
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
