import "@/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";

import { Providers } from "./providers";

import { ChatSidebar } from "@/components/sidebar";
import { fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import AuthProvider from '@/components/auth/auth-provider';

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    icons: {
        icon: "/favicon.ico",
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <html suppressHydrationWarning lang="en">
                <head />
                <body
                    className={clsx(
                        "min-h-screen bg-background font-sans antialiased",
                        fontSans.variable,
                    )}
                >
                    <Providers
                        themeProps={{ attribute: "class", defaultTheme: "dark" }}
                    >
                        <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                            {children}
                        </main>
                    </Providers>
                </body>
            </html>
        </AuthProvider>
    );
}