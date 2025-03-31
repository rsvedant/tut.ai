"use client";

import { useChat } from "@ai-sdk/react";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRef } from "react";

import { ChatHeader, ChatInput, ChatMessages } from "@/components/ai/chat";
import { useTutor } from "@/components/tutor-provider";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
            <SidebarTrigger className="mb-4 md:hidden self-start" />
            <div className="flex-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800 overflow-hidden flex flex-col bg-zinc-50 dark:bg-zinc-900 shadow-sm">
                {selectedTutor && selectedTutor ? (
                    <>
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
                        <ChatMessages
                            chatContainerRef={chatContainerRef}
                            messages={messages as any}
                        />
                        <ChatInput
                            handleSubmit={async () => {
                                await handleSubmit();
                                setInput("");
                            }}
                            message={input}
                            setMessage={setInput}
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

        // <div className="flex flex-col h-[calc(100vh-6rem)] w-full max-w-6xl mx-auto px-4 py-6">
        //     <div className="flex-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800 overflow- flex flex-col bg-zinc-50 dark:bg-zinc-900 shadow-sm">
        //         {selectedTutor ? (
        //             <Form
        //                 className="flex flex-col h-full"
        //                 onSubmit={handleSubmit}
        //             >
        //                 <ChatHeader
        //                     tutor={
        //                         tutors?.find(
        //                             (tutor) => tutor.id === selectedTutor,
        //                         ) || {
        //                             description: "Unknown, a mysterious tutor",
        //                             id: "unknown",
        //                             name: "Unknown Tutor",
        //                             systemPrompt: "You are a mysterious tutor.",
        //                             subject: "Unknown",
        //                         }
        //                     }
        //                 />
        //                 <div className="flex-1 overflow-auto p-4">
        //                     <ChatMessages
        //                         chatContainerRef={chatContainerRef}
        //                         messages={messages}
        //                     />
        //                 </div>
        //                 <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        //                     <ChatInput
        //                         handleSubmit={async     () => { }}
        //                         message={input}
        //                         setMessage={setInput}
        //                     />
        //                 </div>
        //             </Form>
        //         ) : (
        //             <div className="flex-1 flex items-center justify-center p-8">
        //                 <p className="text-zinc-500 dark:text-zinc-400 text-lg">
        //                     Select a tutor to start chatting
        //                 </p>
        //             </div>
        //         )}
        //     </div>
        // </div>
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
