"use client";

import { useChat } from "@ai-sdk/react";
import { Form } from "@heroui/form";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRef } from "react";

import { ChatHeader, ChatInput, ChatMessages } from "@/components/ai/chat";
import { useTutor } from "@/components/tutor-provider";
import { TutorModel } from "@/types";

export default function Chat() {
    const { chatId } = useParams();
    const { selectedTutor } = useTutor();
    const { data: tutors } = useQuery<TutorModel[]>({
        queryKey: ["tutors"],
        queryFn: async () => {
            const response = await fetch("/api/tutors");

            if (!response.ok) {
                throw new Error("Failed to fetch tutors");
            }

            return response.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
    });

    const { messages, input, setInput, handleSubmit } = useChat({
        api: `/api/chats/${chatId}`,
        initialMessages: [],
    });
    const chatContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] w-full max-w-6xl mx-auto mb-6">
            <div className="flex-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800 overflow-hidden flex flex-col bg-zinc-50 dark:bg-zinc-900 shadow-sm">
                {selectedTutor ? (
                    <Form
                        className="flex flex-col h-full"
                        onSubmit={handleSubmit}
                    >
                        <ChatHeader
                            tutor={
                                tutors?.find(
                                    (tutor) => tutor.id === selectedTutor,
                                ) || {
                                    description: "Unknown, a mysterious tutor",
                                    id: "unknown",
                                    name: "Unknown Tutor",
                                    systemPrompt: "You are a mysterious tutor.",
                                    subject: "Unknown",
                                }
                            }
                        />
                        <ChatMessages chatContainerRef={chatContainerRef} />
                        <ChatInput
                            handleSubmit={async () => {}}
                            message={input}
                            setMessage={setInput}
                        />
                    </Form>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-zinc-500 dark:text-zinc-400">
                            Select a tutor to start chatting
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
//     {/* <div className="flex-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800 overflow-hidden flex flex-col bg-zinc-50 dark:bg-zinc-900 shadow-sm">
//     <ChatHeader
//         tutor={
//             tutors?.find((tutor) => tutor.id === selectedTutor) || {
//                 description: "Unknown, a mysterious tutor",
//                 id: "unknown",
//                 name: "Unknown Tutor",
//                 systemPrompt: "You are a mysterious tutor.",
//                 subject: "Unknown",
//             }
//         }
//     />
//     <ChatMessages chatContainerRef={chatContainerRef} />
//     <ChatInput prompt={input} setPrompt={setInput} />
// </div> */}
