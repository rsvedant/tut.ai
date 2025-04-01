"use client";

import type React from "react";

import { useChat, type Message } from "@ai-sdk/react";
import { useParams } from "next/navigation";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

interface ChatContextType {
    messages: Message[];
    input: string;
    setInput: (input: string) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    error: Error | null;
    chatId: string | null;
    setChatId: (id: string) => void;
    clearMessages: () => void;
    tutorId: string | null;
    setTutorId: (id: string) => void;
}

// Create the context with a default value
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Props for the ChatProvider component
interface ChatProviderProps {
    children: ReactNode;
}

// Create the provider component
export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const { chatId: chatIdFromURI }: { chatId: string } = useParams();
    const [chatId, setChatId] = useState<string | null>(chatIdFromURI);
    const [initialMessages, setInitialMessages] = useState<Message[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [tutorId, setTutorId] = useState<string | null>(null);

    // Fetch messages when chatId changes
    useEffect(() => {
        if (!chatId) {
            setInitialMessages([]);

            setTutorId(null);

            return;
        }

        const fetchMessages = async () => {
            try {
                setIsFetching(true);
                setError(null);

                const response = await fetch(`/api/chats/${chatId}`);

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch messages: ${response.statusText}`,
                    );
                }

                const data = await response.json();

                // Convert the messages to the format expected by useChat
                setInitialMessages(data.messages || []);
                setTutorId(data.tutorId || null);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error("Failed to fetch messages"),
                );
                console.error("Error fetching messages:", err);
            } finally {
                setIsFetching(false);
            }
        };

        fetchMessages();
    }, [chatId]);

    // Use the useChat hook from Vercel AI SDK
    const {
        messages,
        input,
        setInput,
        handleSubmit,
        isLoading: isChatLoading,
        error: chatError,
        reload,
        setMessages,
    } = useChat({
        api: chatId ? `/api/chats/${chatId}` : undefined,
        initialMessages,
        // This ensures the chat is reset when initialMessages changes
        id: chatId || "default",
    });

    // Update messages when initialMessages change (after fetching)
    useEffect(() => {
        if (initialMessages.length > 0) {
            setMessages(initialMessages);
        }
    }, [initialMessages, setMessages]);

    // Function to clear all messages
    const clearMessages = useCallback(() => {
        setMessages([]);
    }, [setMessages]);

    const isLoading = isFetching || isChatLoading;
    const combinedError = error || chatError;

    const value: ChatContextType = {
        messages,
        input,
        setInput,
        handleSubmit,
        isLoading,
        error: combinedError || null,
        chatId,
        setChatId,
        clearMessages,
        tutorId,
        setTutorId,
    };

    return (
        <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
    );
};

// Custom hook to use the chat context
export const useChatContext = (): ChatContextType => {
    const context = useContext(ChatContext);

    if (context === undefined) {
        throw new Error("useChatContext must be used within a ChatProvider");
    }

    return context;
};
