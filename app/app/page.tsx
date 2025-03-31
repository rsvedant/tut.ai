"use client";

import { Avatar } from "@heroui/avatar";
import { Button, Button as HeroUIButton } from "@heroui/button";
import { Form } from "@heroui/form";
import { cn } from "@heroui/theme";
import { Tooltip } from "@heroui/tooltip";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import MessageCard from "@/components/ai/ai-message";
import PromptInput from "@/components/ai/prompt-input";
import { useTutor } from "@/components/tutor-provider";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TutorModel } from "@/lib/utils/tutors";

interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

export default function Home() {
    const { status } = useSession();
    const { selectedTutor } = useTutor(); // Changed to match a valid tutor ID
    const router = useRouter();

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
    const [messages, setMessages] = useState<Message[]>([]);
    const [partialResponse, setPartialResponse] = React.useState<string>("");
    // function setPartialResponse(result: string) {
    //     throw new Error("Function not implemented.");
    // }

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
                                    showFallback
                                    className="flex-shrink-0"
                                    color="primary"
                                    name={currentTutor?.name}
                                    size="sm"
                                // src={currentTutor?.avatar}
                                />
                                <div>
                                    <div className="font-medium flex items-center gap-2">
                                        {currentTutor?.name}
                                        {/* {currentTutor?.online && (
                                            <span className="inline-flex items-center">
                                                <span className="h-2 w-2 rounded-full bg-green-500" />
                                                <span className="ml-1 text-xs text-green-600 dark:text-green-400">
                                                    Online
                                                </span>
                                            </span>
                                        )} */}
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
                            {messages.map((message, index) => {
                                return (
                                    <MessageCard
                                        key={index}
                                        message={message.content}
                                        role={message.role}
                                    />
                                );
                            })}
                            {partialResponse && (
                                <MessageCard
                                    message={partialResponse}
                                    role="assistant"
                                    // isPartial={true}
                                />
                            )}
                        </div>
                        <div className="p-5 border-t border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                            <div className="flex items-center gap-2">
                                <Form className="flex w-full items-start gap-2">
                                    <PromptInput
                                        classNames={{
                                            innerWrapper: "relative w-full",
                                            input: "pt-1 pb-6 !pr-10 text-medium",
                                        }}
                                        endContent={
                                            <div className="absolute right-0 flex h-full flex-col items-end justify-between gap-2">
                                                <div />{" "}
                                                {/* This is so its at the bottom */}
                                                <div className="flex items-end gap-2">
                                                    <p className="py-1 text-tiny text-default-400">
                                                        {message.length}/2000
                                                    </p>
                                                    <Tooltip
                                                        showArrow
                                                        content="Send message"
                                                    >
                                                        <Button
                                                            isIconOnly
                                                            color={
                                                                !message
                                                                    ? "default"
                                                                    : "primary"
                                                            }
                                                            isDisabled={
                                                                !message
                                                            }
                                                            radius="lg"
                                                            size="sm"
                                                            variant={
                                                                !message
                                                                    ? "flat"
                                                                    : "solid"
                                                            }
                                                            onPress={async () => {
                                                                if (!message) {
                                                                    return;
                                                                }
                                                                setMessages([
                                                                    {
                                                                        role: "user",
                                                                        content:
                                                                            message,
                                                                    },
                                                                ]);
                                                                const response =
                                                                    await fetch(
                                                                        "/api/chats",
                                                                        {
                                                                            method: "POST",
                                                                            body: JSON.stringify(
                                                                                {
                                                                                    message,
                                                                                    tutorId:
                                                                                        selectedTutor,
                                                                                },
                                                                            ),
                                                                        },
                                                                    );
                                                                const reader =
                                                                    response.body.getReader();
                                                                const decoder =
                                                                    new TextDecoder();
                                                                let result = "";

                                                                // Read from the stream
                                                                try {
                                                                    while (
                                                                        true
                                                                    ) {
                                                                        const {
                                                                            done,
                                                                            value,
                                                                        } =
                                                                            await reader.read();

                                                                        if (
                                                                            done
                                                                        )
                                                                            break;

                                                                        // Decode the chunk
                                                                        const chunk =
                                                                            decoder.decode(
                                                                                value,
                                                                                {
                                                                                    stream: true,
                                                                                },
                                                                            );

                                                                        result +=
                                                                            chunk;

                                                                        // Update UI with the partial response
                                                                        setPartialResponse(
                                                                            result,
                                                                        );
                                                                    }
                                                                } finally {
                                                                    reader.releaseLock();
                                                                }
                                                                // const data =
                                                                //     await response.json();

                                                                // console.log(
                                                                //     data,
                                                                // );
                                                                // setMessage("");
                                                                // chatContainerRef.current?.scrollTo(
                                                                //     {
                                                                //         top: chatContainerRef
                                                                //             .current
                                                                //             .scrollHeight,
                                                                //         behavior:
                                                                //             "smooth",
                                                                //     },
                                                                // );
                                                            }}
                                                        >
                                                            <Icon
                                                                className={cn(
                                                                    "[&>path]:stroke-[2px]",
                                                                    !message
                                                                        ? "text-default-600"
                                                                        : "text-primary-foreground",
                                                                )}
                                                                icon="solar:arrow-up-linear"
                                                                width={20}
                                                            />
                                                        </Button>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        }
                                        minRows={3}
                                        radius="lg"
                                        value={message}
                                        onValueChange={setMessage}
                                    />
                                </Form>
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
                    </div>
                )}
            </div>
        </div>
    );
}
