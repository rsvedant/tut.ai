"use client";

import type { ThemeProviderProps } from "next-themes";

import { HeroUIProvider } from "@heroui/system";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";

import { TutorProvider } from "@/components/tutor-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
    interface RouterConfig {
        routerOptions: NonNullable<
            Parameters<ReturnType<typeof useRouter>["push"]>[1]
        >;
    }
}

export function Providers({ children, themeProps }: ProvidersProps) {
    const router = useRouter();
    const client = new QueryClient();

    return (
        <QueryClientProvider client={client}>
            <TutorProvider>
                <HeroUIProvider navigate={router.push}>
                    <NextThemesProvider {...themeProps}>
                        <SidebarProvider>{children}</SidebarProvider>
                    </NextThemesProvider>
                </HeroUIProvider>
            </TutorProvider>
        </QueryClientProvider>
    );
}
