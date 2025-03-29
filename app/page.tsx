"use client";

import { Button as HeroUIButton } from "@heroui/button";
import { Input } from "@heroui/input";
import { Icon } from "@iconify/react";

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
    const selectedTutor = "Donkey Kong";

    return (
        <div className="flex-1 flex flex-col p-4">
            <SidebarTrigger className="mb-4 md:hidden" />
            <div className="flex-grow rounded-lg border border-zinc-200/50 dark:border-zinc-800 p-4 mb-20 overflow-y-auto">
                {selectedTutor ? (
                    <>
                        <div className="mb-2 text-sm text-muted-foreground">
                            Chat with{" "}
                            {tutors.find((t) => t.id === selectedTutor)?.name}
                        </div>
                        <div className="space-y-4">
                            <MessageCard message="Hello! How can I help you today?" />
                            {/* <div className="p-2 rounded bg-gray-100 dark:bg-gray-700">
                                Hello! How can I help you today?
                            </div> */}
                        </div>
                    </>
                ) : (
                    <div className="text-center text-lg font-semibold">
                        Please select a tutor to start chatting.
                    </div>
                )}
            </div>
            {selectedTutor && (
                <div className="sticky bottom-0 bg-white dark:bg-zinc-900 p-4">
                    <div className="flex items-center gap-2">
                        <Input
                            className="flex-1 rounded p-2 focus:outline-none focus:ring"
                            endContent={
                                <HeroUIButton
                                    className="px-4 py-2"
                                    color="primary"
                                    endContent={<Icon className="h-4 w-4" icon="lucide:send" />}
                                    variant="shadow"
                                >
                                    Send
                                </HeroUIButton>
                            }
                            placeholder="Type your message..."
                            size="lg"
                            type="text"
                            variant="bordered"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
