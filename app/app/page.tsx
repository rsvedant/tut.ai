"use client";

import { Avatar } from "@heroui/avatar";
import { Button as HeroUIButton } from "@heroui/button";
import { Input } from "@heroui/input";
import { Tooltip } from "@heroui/tooltip";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";

import MessageCard from "@/components/ai/ai-message";
import { useTutor } from "@/components/tutor-provider";
import { SidebarTrigger } from "@/components/ui/sidebar";

// const tutors = [
//     {
//         id: "1",
//         name: "Dr. Smith",
//         subject: "Mathematics",
//         avatar: "/placeholder.svg?height=40&width=40",
//         online: true,
//     },
//     {
//         id: "2",
//         name: "Prof. Johnson",
//         subject: "Physics",
//         avatar: "/placeholder.svg?height=40&width=40",
//         online: true,
//     },
//     {
//         id: "3",
//         name: "Ms. Williams",
//         subject: "Chemistry",
//         avatar: "/placeholder.svg?height=40&width=40",
//         online: false,
//     },
//     {
//         id: "4",
//         name: "Mr. Davis",
//         subject: "Biology",
//         avatar: "/placeholder.svg?height=40&width=40",
//         online: true,
//     },
// ];

// const chats = [
//     {
//         id: "1",
//         tutorId: "1",
//         title: "Calculus Help",
//         lastMessage: "Can you explain derivatives?",
//         timestamp: "2h ago",
//         unread: true,
//     },
//     {
//         id: "2",
//         tutorId: "2",
//         title: "Quantum Mechanics",
//         lastMessage: "I need help with wave functions",
//         timestamp: "1d ago",
//         unread: false,
//     },
//     {
//         id: "3",
//         tutorId: "1",
//         title: "Linear Algebra",
//         lastMessage: "Matrix multiplication question",
//         timestamp: "3d ago",
//         unread: false,
//     },
// ];

export default function Home() {
    const { selectedTutor } = useTutor(); // Changed to match a valid tutor ID
    const [message, setMessage] = React.useState("");
    const chatContainerRef = React.useRef<HTMLDivElement>(null);
    const { data: tutors } = useQuery({
        queryKey: ["tutors"],
        queryFn: async () => {
            const response = await fetch("/api/tutors");

            if (!response.ok) {
                throw new Error("Failed to fetch tutors");
            }

            return response.json();
        },
        initialData: [],
    });

    const currentTutor = tutors.find((t) => t.id === selectedTutor);

    const sendMessage = () => {
        if (message.trim()) {
            // In a real app, you would send the message to the backend
            setMessage("");
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] w-full max-w-6xl mx-auto mb-6">
            <SidebarTrigger className="mb-4 md:hidden self-start" />
            <div className="flex-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800 overflow-hidden flex flex-col bg-zinc-50 dark:bg-zinc-900 shadow-sm">
                {selectedTutor ? (
                    <>
                        <div className="py-3.5 px-5 border-b border-zinc-200/50 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-950 shadow-sm">
                            <div className="flex items-center gap-3.5">
                                <Avatar
                                    isBordered
                                    className="flex-shrink-0"
                                    color="primary"
                                    name={currentTutor?.name}
                                    size="sm"
                                    src={currentTutor?.avatar}
                                />
                                <div>
                                    <div className="font-medium flex items-center gap-2">
                                        {currentTutor?.name}
                                        {currentTutor?.online && (
                                            <span className="inline-flex items-center">
                                                <span className="h-2 w-2 rounded-full bg-green-500" />
                                                <span className="ml-1 text-xs text-green-600 dark:text-green-400">
                                                    Online
                                                </span>
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                        {currentTutor?.subject} • Active now
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Tooltip content="Search in conversation">
                                    <HeroUIButton
                                        isIconOnly
                                        className="rounded-full"
                                        size="sm"
                                        variant="light"
                                    >
                                        <Icon
                                            className="h-4 w-4"
                                            icon="lucide:search"
                                        />
                                    </HeroUIButton>
                                </Tooltip>
                                <Tooltip content="More options">
                                    <HeroUIButton
                                        isIconOnly
                                        className="rounded-full"
                                        size="sm"
                                        variant="light"
                                    >
                                        <Icon
                                            className="h-4 w-4"
                                            icon="lucide:more-vertical"
                                        />
                                    </HeroUIButton>
                                </Tooltip>
                            </div>
                        </div>
                        <div
                            ref={chatContainerRef}
                            className="flex-1 overflow-y-auto px-5 py-6 space-y-8 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 scroll-smooth"
                        >
                            <MessageCard
                                avatar={currentTutor?.avatar}
                                message="Hello! How can I help you today with your mathematics questions?"
                                showFeedback={true}
                            />

                            <div className="flex justify-end">
                                <div className="max-w-[80%] bg-primary text-primary-foreground rounded-t-xl rounded-bl-xl px-4 py-3 shadow-sm">
                                    <div className="leading-relaxed">
                                        I&apos;m having trouble understanding
                                        derivatives in calculus. Could you
                                        explain the concept in simple terms?
                                    </div>
                                    <div className="text-xs mt-1.5 opacity-70 text-right">
                                        10:32 AM
                                    </div>
                                </div>
                            </div>

                            <MessageCard
                                avatar={currentTutor?.avatar}
                                message={
                                    <>
                                        <p>
                                            I&apos;d be happy to help you
                                            understand derivatives!
                                        </p>
                                        <p className="mt-3">
                                            A derivative measures the rate at
                                            which a function is changing at a
                                            specific point. Imagine you&apos;re
                                            driving a car and the speedometer
                                            shows your speed at each moment -
                                            that&apos;s like a derivative. It
                                            tells you how fast your position is
                                            changing.
                                        </p>
                                        <p className="mt-3">
                                            The formal definition involves
                                            limits, but the basic idea is
                                            measuring the slope of the tangent
                                            line to the function at a specific
                                            point.
                                        </p>
                                        <p className="mt-3">
                                            Would you like me to walk you
                                            through an example?
                                        </p>
                                    </>
                                }
                                showFeedback={true}
                            />
                        </div>
                        <div className="p-5 border-t border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                            <div className="flex items-center gap-2">
                                <Tooltip content="Attach file">
                                    <HeroUIButton
                                        isIconOnly
                                        className="rounded-full h-10 w-10 flex items-center justify-center"
                                        size="sm"
                                        variant="light"
                                    >
                                        <Icon
                                            className="h-5 w-5"
                                            icon="lucide:paperclip"
                                        />
                                    </HeroUIButton>
                                </Tooltip>
                                <Input
                                    className="flex-1"
                                    classNames={{
                                        inputWrapper: "h-12 px-4",
                                    }}
                                    endContent={
                                        <HeroUIButton
                                            isIconOnly
                                            className="rounded-full"
                                            color="primary"
                                            size="lg"
                                            variant="flat"
                                            onPress={sendMessage}
                                        >
                                            <Icon
                                                className="h-5 w-5"
                                                icon="lucide:send"
                                            />
                                        </HeroUIButton>
                                    }
                                    placeholder="Type your message..."
                                    size="lg"
                                    type="text"
                                    value={message}
                                    variant="bordered"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    onValueChange={setMessage}
                                />
                            </div>
                            <div className="mt-2.5 text-xs text-center text-zinc-500 dark:text-zinc-400">
                                Press Enter to send, Shift+Enter for a new line
                            </div>
                        </div>
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
                        <HeroUIButton
                            className="px-6"
                            color="primary"
                            size="lg"
                        >
                            Start New Conversation
                        </HeroUIButton>
                    </div>
                )}
            </div>
        </div>
    );
}
