import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from '@/components/mode-toggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Nexus',
    description: 'Your personal context operating system',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN" suppressHydrationWarning>
            <body
                className={inter.className}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                            <main>
                                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white dark:bg-slate-900">
                                    <SidebarTrigger className="-ml-1" />
                                    <ModeToggle />
                                </header>
                                <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950">
                                    {children}
                                </div>
                            </main>
                        </SidebarInset>
                    </SidebarProvider>
                </ThemeProvider>
            </body >
        </html >
    );
}
