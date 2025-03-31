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

                                                                // Add user message to UI
                                                                setMessages([
                                                                    ...messages,
                                                                    {
                                                                        role: "user",
                                                                        content:
                                                                            message,
                                                                    },
                                                                ]);

                                                                // Store the original message before clearing input
                                                                const userMessage =
                                                                    message;

                                                                // Clear input if needed
                                                                setMessage("");

                                                                // Make the API request
                                                                const response =
                                                                    await fetch(
                                                                        "/api/chats",
                                                                        {
                                                                            method: "POST",
                                                                            body: JSON.stringify(
                                                                                {
                                                                                    message:
                                                                                        userMessage,
                                                                                    tutorId:
                                                                                        selectedTutor,
                                                                                },
                                                                            ),
                                                                        },
                                                                    );

                                                                const reader =
                                                                    response.body!.getReader();
                                                                const decoder =
                                                                    new TextDecoder();
                                                                let completeResponse =
                                                                    "";

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

                                                                        // Process the chunk - AI SDK uses a specific format
                                                                        const lines =
                                                                            chunk
                                                                                .split(
                                                                                    "\n",
                                                                                )
                                                                                .filter(
                                                                                    (
                                                                                        line,
                                                                                    ) =>
                                                                                        line.trim() !==
                                                                                        "",
                                                                                );

                                                                        for (const line of lines) {
                                                                            // AI SDK data stream format: "data: {json}"
                                                                            if (
                                                                                line.startsWith(
                                                                                    "data: ",
                                                                                )
                                                                            ) {
                                                                                try {
                                                                                    // Try to parse as JSON (AI SDK format)
                                                                                    const jsonStr =
                                                                                        line.slice(
                                                                                            5,
                                                                                        ); // Remove "data: " prefix

                                                                                    // Skip [DONE] message
                                                                                    if (
                                                                                        jsonStr.trim() ===
                                                                                        "[DONE]"
                                                                                    )
                                                                                        continue;

                                                                                    const data =
                                                                                        JSON.parse(
                                                                                            jsonStr,
                                                                                        );

                                                                                    // Extract the text content
                                                                                    if (
                                                                                        data.type ===
                                                                                        "text" &&
                                                                                        data.text
                                                                                    ) {
                                                                                        completeResponse +=
                                                                                            data.text;
                                                                                        setPartialResponse(
                                                                                            completeResponse,
                                                                                        );
                                                                                    } else if (
                                                                                        data.type ===
                                                                                        "text-delta" &&
                                                                                        data.delta
                                                                                    ) {
                                                                                        completeResponse +=
                                                                                            data.delta;
                                                                                        setPartialResponse(
                                                                                            completeResponse,
                                                                                        );
                                                                                    }
                                                                                } catch (e) {
                                                                                    // If not valid JSON, just add the content after "data: "
                                                                                    const textContent =
                                                                                        line.slice(
                                                                                            5,
                                                                                        );

                                                                                    completeResponse +=
                                                                                        textContent;
                                                                                    setPartialResponse(
                                                                                        completeResponse,
                                                                                    );
                                                                                }
                                                                            } else {
                                                                                // Handle plain text format (not AI SDK format)
                                                                                // Remove any numeric prefix like "0:" if present
                                                                                const cleanedLine =
                                                                                    line.replace(
                                                                                        /^\d+:/,
                                                                                        "",
                                                                                    );

                                                                                completeResponse +=
                                                                                    cleanedLine;
                                                                                setPartialResponse(
                                                                                    completeResponse,
                                                                                );
                                                                            }
                                                                        }
                                                                    }

                                                                    // After streaming is complete, update messages with the full conversation
                                                                    setMessages(
                                                                        [
                                                                            ...messages,
                                                                            {
                                                                                role: "user",
                                                                                content:
                                                                                    userMessage,
                                                                            },
                                                                            {
                                                                                role: "assistant",
                                                                                content:
                                                                                    completeResponse,
                                                                            },
                                                                        ],
                                                                    );
                                                                    setPartialResponse("")

                                                                    // Scroll to bottom if needed
                                                                    if (
                                                                        chatContainerRef.current
                                                                    ) {
                                                                        chatContainerRef.current.scrollTo(
                                                                            {
                                                                                top: chatContainerRef
                                                                                    .current
                                                                                    .scrollHeight,
                                                                                behavior:
                                                                                    "smooth",
                                                                            },
                                                                        );
                                                                    }
                                                                } finally {
                                                                    reader.releaseLock();
                                                                }
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
