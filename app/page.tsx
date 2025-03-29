"use client";

import { Avatar } from "@heroui/avatar";
import { Button as HeroUIButton } from "@heroui/button";
import { Input } from "@heroui/input";
import { Tooltip } from "@heroui/tooltip";
import { Icon } from "@iconify/react";
import React from "react";

import MessageCard from "@/components/ai/ai-message";
import { SidebarTrigger } from "@/components/ui/sidebar";

const tutors = [
    {
        id: "1",
        name: "Dr. Smith",
        subject: "Mathematics",
        avatar: "/placeholder.svg?height=40&width=40",
        online: true,
    },
    {
        id: "2",
        name: "Prof. Johnson",
        subject: "Physics",
        avatar: "/placeholder.svg?height=40&width=40",
        online: true,
    },
    {
        id: "3",
        name: "Ms. Williams",
        subject: "Chemistry",
        avatar: "/placeholder.svg?height=40&width=40",
        online: false,
    },
    {
        id: "4",
        name: "Mr. Davis",
        subject: "Biology",
        avatar: "/placeholder.svg?height=40&width=40",
        online: true,
    },
];

const chats = [
    {
        id: "1",
        tutorId: "1",
        title: "Calculus Help",
        lastMessage: "Can you explain derivatives?",
        timestamp: "2h ago",
        unread: true,
    },
    {
        id: "2",
        tutorId: "2",
        title: "Quantum Mechanics",
        lastMessage: "I need help with wave functions",
        timestamp: "1d ago",
        unread: false,
    },
    {
        id: "3",
        tutorId: "1",
        title: "Linear Algebra",
        lastMessage: "Matrix multiplication question",
        timestamp: "3d ago",
        unread: false,
    },
];

export default function Home() {
    const selectedTutor = "1"; // Changed to match a valid tutor ID
    const [message, setMessage] = React.useState("");
    const chatContainerRef = React.useRef<HTMLDivElement>(null);

    const currentTutor = tutors.find((t) => t.id === selectedTutor);

    const sendMessage = () => {
        if (message.trim()) {
            // In a real app, you would send the message to the backend
            setMessage("");
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] !w-full mb-6">
            <SidebarTrigger className="mb-4 md:hidden" />
            <div className="flex-1 rounded-lg border border-zinc-200/50 dark:border-zinc-800 overflow-hidden flex flex-col bg-zinc-50 dark:bg-zinc-900">
                {selectedTutor ? (
                    <>
                        <div className="py-3 px-4 border-b border-zinc-200/50 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-950 shadow-sm">
                            <div className="flex items-center gap-3">
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
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {currentTutor?.subject} • Active now
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Tooltip content="Search in conversation">
                                    <HeroUIButton
                                        isIconOnly
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
                            className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950"
                        >
                            <MessageCard
                                avatar={currentTutor?.avatar}
                                message="Hello! How can I help you today with your mathematics questions?"
                                showFeedback={true}
                            />

                            <div className="flex justify-end">
                                <div className="max-w-[80%] bg-primary text-primary-foreground rounded-t-lg rounded-bl-lg px-4 py-2.5 shadow-sm">
                                    <div>
                                        I&apos;m having trouble understanding
                                        derivatives in calculus. Could you
                                        explain the concept in simple terms?
                                    </div>
                                    <div className="text-xs mt-1 opacity-70 text-right">
                                        10:32 AM
                                    </div>
                                </div>
                            </div>

                            <MessageCard
                                avatar={currentTutor?.avatar}
                                message={
                                    <>
                                        <p>
                                            I&apos;d be happy to help you understand
                                            derivatives!
                                        </p>
                                        <p className="mt-2">
                                            A derivative measures the rate at
                                            which a function is changing at a
                                            specific point. Imagine you&apos;re
                                            driving a car and the speedometer
                                            shows your speed at each moment -
                                            that&apos;s like a derivative. It tells
                                            you how fast your position is
                                            changing.
                                        </p>
                                        <p className="mt-2">
                                            The formal definition involves
                                            limits, but the basic idea is
                                            measuring the slope of the tangent
                                            line to the function at a specific
                                            point.
                                        </p>
                                        <p className="mt-2">
                                            Would you like me to walk you
                                            through an example?
                                        </p>
                                    </>
                                }
                                showFeedback={true}
                            />
                        </div>
                        <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                            <div className="flex items-center gap-2">
                                <Tooltip content="Attach file">
                                    <HeroUIButton
                                        isIconOnly
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
                                    endContent={
                                        <HeroUIButton
                                            isIconOnly
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
                            <div className="mt-2 text-xs text-center text-zinc-500 dark:text-zinc-400">
                                Press Enter to send, Shift+Enter for a new line
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-6">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                            <Icon
                                className="h-8 w-8 text-zinc-500"
                                icon="lucide:message-square"
                            />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            No Active Conversation
                        </h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-md mb-6">
                            Select a tutor from the sidebar to start a new
                            conversation or continue an existing one.
                        </p>
                        <HeroUIButton color="primary">
                            Start New Conversation
                        </HeroUIButton>
                    </div>
                )}
            </div>
        </div>
    );
}
