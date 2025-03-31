"use client";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

import { ChatHeader, ChatInput, ChatMessages } from "@/components/ai/chat";
import { useTutor } from "@/components/tutor-provider";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TutorModel } from "@/types";

export default function Home() {
    const { status } = useSession();
    const { selectedTutor } = useTutor();
    const router = useRouter();
    const handleSubmit = async () => {
        if (!message || !selectedTutor) return;

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
                console.error("Failed to create chat", response);
                // Handle error appropriately (e.g., display an error message)
            }
        } catch (error) {
            console.error("Error creating chat:", error);
            // Handle error appropriately
        }
    };

    const [message, setMessage] = React.useState("");

    const chatContainerRef = React.useRef<HTMLDivElement>(null);
    const { data: tutors } = useQuery<TutorModel[]>({
        queryKey: ["tutors"],
        queryFn: async () => {
            const response = await fetch("/api/tutors");

            if (!response.ok) {
                throw new Error("Failed to fetch tutors");
            }

            return response.json() as Promise<TutorModel[]>;
        },
        initialData: [],
    });
    const currentTutor = tutors.find((t) => t.id === selectedTutor);

    if (status === "unauthenticated") {
        router.push("/auth/signin");
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
                            handleSubmit={handleSubmit}
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
