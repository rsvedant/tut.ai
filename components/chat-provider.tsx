"use client";

import type { Message } from "@/types";
import type React from "react";

import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

interface ChatContextType {
    messages: Message[];
    isLoading: boolean;
    error: Error | null;
    chatId: string | null;
    setChatId: (id: string) => void;
    sendMessage: (content: string) => Promise<void>;
    clearMessages: () => void;
}

// Create the context with a default value
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Props for the ChatProvider component
interface ChatProviderProps {
    children: ReactNode;
}

// Create the provider component
export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [chatId, setChatId] = useState<string | null>(null);

    // Fetch messages when chatId changes
    useEffect(() => {
        if (!chatId) {
            setMessages([]);

            return;
        }

        const fetchMessages = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(`/api/chats/${chatId}`);

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch messages: ${response.statusText}`,
                    );
                }

                const data = await response.json();

                setMessages(data.messages || []);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error("Failed to fetch messages"),
                );
                console.error("Error fetching messages:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, [chatId]);

    // Function to send a message
    const sendMessage = useCallback(
        async (content: string) => {
            if (!chatId) {
                setError(new Error("No chat selected"));

                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                // Add user message to the chat (optimistic update)
                const userMessage: Message = {
                    content,
                    role: "user",
                };

                setMessages((prevMessages) => [...prevMessages, userMessage]);

                // Send message to the API
                const response = await fetch(`/api/chats/${chatId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ message: content }),
                });

                if (!response.ok) {
                    throw new Error(
                        `Failed to send message: ${response.statusText}`,
                    );
                }

                const data = await response.json();

                // Update messages with the complete conversation from the server
                // This ensures we have the correct state including the AI response
                setMessages(data.messages || []);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error("Failed to send message"),
                );
                console.error("Error sending message:", err);
            } finally {
                setIsLoading(false);
            }
        },
        [chatId],
    );

    // Function to clear all messages
    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    const value: ChatContextType = {
        messages,
        isLoading,
        error,
        chatId,
        setChatId,
        sendMessage,
        clearMessages,
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
