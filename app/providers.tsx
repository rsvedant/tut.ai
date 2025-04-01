"use client";

import type { ThemeProviderProps } from "next-themes";

import { HeroUIProvider } from "@heroui/system";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";

import AuthProvider from "@/components/auth/auth-provider";
import { TutorProvider } from "@/components/tutor-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatProvider } from "@/components/chat-provider";

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

    // Create a QueryClient instance that persists between renders
    const [queryClient] = React.useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        retry: 1,
                        refetchOnWindowFocus: true,
                    },
                },
            }),
    );

    return (
        <AuthProvider>
            <ChatProvider>
                <QueryClientProvider client={queryClient}>
                    {/* {process.env.NODE_ENV === "development" && (
                        <ReactQueryDevtools initialIsOpen={false} />
                    )} */}
                    <TutorProvider>
                        <HeroUIProvider navigate={router.push}>
                            <NextThemesProvider {...themeProps}>
                                <SidebarProvider>{children}</SidebarProvider>
                            </NextThemesProvider>
                        </HeroUIProvider>
                    </TutorProvider>
                </QueryClientProvider>
            </ChatProvider>
        </AuthProvider>
    );
}
