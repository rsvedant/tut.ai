"use client";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo } from "react";

import { ChatHeader, ChatInput, ChatMessages } from "@/components/ai/chat";
import { useTutor } from "@/components/tutor-provider";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TutorModel } from "@/types";

export default function Home() {
    const { status } = useSession();
    const { selectedTutor } = useTutor();
    const router = useRouter();
    const [message, setMessage] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const chatContainerRef = React.useRef<HTMLDivElement>(null);

    // Redirect unauthenticated users
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);

    // Fetch tutors with React Query
    const { data: tutors = [], isLoading } = useQuery<TutorModel[]>({
        queryKey: ["tutors"],
        queryFn: async () => {
            const response = await fetch("/api/tutors");

            if (!response.ok) {
                throw new Error("Failed to fetch tutors");
            }

            return response.json() as Promise<TutorModel[]>;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
    });

    // Memoize the current tutor to prevent unnecessary re-renders
    const currentTutor = useMemo(
        () => tutors.find((t) => t.id === selectedTutor),
        [tutors, selectedTutor],
    );

    // Handle message submission with useCallback
    const handleSubmit = useCallback(async () => {
        if (!message || !selectedTutor) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/chats", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: message,
                    tutorId: selectedTutor,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                router.push(`/app/chats/${data.chatId}`);
                setMessage("");
            } else {
                const errorData = await response.json();

                setError(errorData.message || "Failed to create chat");
            }
        } catch (error) {
            console.error("Error creating chat:", error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }, [message, selectedTutor, router]);

    // Loading state for tutors
    if (isLoading) {
        return (
            <div className="flex flex-col h-[calc(100vh-8rem)] w-full max-w-6xl mx-auto mb-6 justify-center items-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-zinc-500 dark:text-zinc-400">
                    Loading tutors...
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] w-full max-w-6xl mx-auto mb-6">
            <SidebarTrigger className="mb-4 md:hidden self-start" />
            <div className="flex-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800 overflow-hidden flex flex-col bg-zinc-50 dark:bg-zinc-900 shadow-sm">
                {selectedTutor && currentTutor ? (
                    <>
                        <ChatHeader tutor={currentTutor} />
                        <ChatMessages chatContainerRef={chatContainerRef} />
                        <ChatInput
                            error={error}
                            handleSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                            message={message}
                            setMessage={setMessage}
                        />
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <Icon
                                className="h-10 w-10 text-zinc-500"
                                icon="lucide:message-square"
                            />
                        </div>
                        <h3 className="text-2xl font-semibold mb-3">
                            No Active Conversation
                        </h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-md mb-8 leading-relaxed">
                            Select a tutor from the sidebar to start a new
                            conversation or continue an existing one.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
