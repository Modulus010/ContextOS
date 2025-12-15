import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from '@/components/mode-toggle'

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

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
        <html lang="zh-CN" className={jetbrainsMono.variable} suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
