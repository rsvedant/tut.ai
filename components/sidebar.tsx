"use client";

import { useQuery } from "@tanstack/react-query";
import {
    ArrowLeft,
    BookOpen,
    MessageSquarePlus,
    PlusCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { useTutor } from "./tutor-provider";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FrontendChat, TutorModel } from "@/types";

// Memoized Tutor Item Component
const TutorItem = React.memo(
    ({
        tutor,
        onSelect,
    }: {
        tutor: TutorModel;
        onSelect: (id: string) => void;
    }) => (
        <SidebarMenuItem key={tutor.id}>
            <SidebarMenuButton
                className="flex items-center gap-3"
                onClick={() => onSelect(tutor.id)}
            >
                <Avatar className="h-8 w-8">
                    <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-medium">{tutor.name}</span>
                    <span className="text-xs text-muted-foreground">
                        {tutor.subject}
                    </span>
                </div>
            </SidebarMenuButton>
        </SidebarMenuItem>
    ),
);

TutorItem.displayName = "TutorItem";

// Memoized Chat Item Component
const ChatItem = React.memo(({ chat }: { chat: FrontendChat }) => (
    <SidebarMenuItem key={chat.id}>
        <SidebarMenuButton className="flex flex-col items-start gap-1">
            <div className="flex w-full justify-between">
                <span className="font-medium">{chat.name}</span>
                <span className="text-xs text-muted-foreground">
                    {new Date(
                        parseInt(chat._id.substring(0, 8), 16) * 1000,
                    ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            </div>
            <div className="flex w-full justify-between">
                {chat.unread && (
                    <Badge
                        className="h-5 w-5 rounded-full p-0 flex items-center justify-center"
                        variant="default"
                    >
                        <span className="sr-only">Unread messages</span>
                    </Badge>
                )}
            </div>
        </SidebarMenuButton>
    </SidebarMenuItem>
));

ChatItem.displayName = "ChatItem";

export function ChatSidebar() {
    const pathname = usePathname();
    const { status, data: session } = useSession();
    const { selectedTutor, setSelectedTutor } = useTutor();
    const [searchQuery, setSearchQuery] = React.useState("");
    const [view, setView] = React.useState<"tutors" | "chats">("tutors");
    const [isAnimating, setIsAnimating] = React.useState(false);
    const router = useRouter();

    // Prefetch the app route for better performance
    React.useEffect(() => {
        router.prefetch("/app");
    }, [router]);

    // Tutors query with proper error handling
    const {
        data: tutors = [],
        isLoading: tutorsLoading,
        error: tutorsError,
    } = useQuery({
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

    // Chats query with proper error handling
    const {
        data: chats = [],
        isLoading: chatsLoading,
        error: chatsError,
    } = useQuery({
        queryKey: ["chats", selectedTutor],
        queryFn: async () => {
            const response = await fetch("/api/chats");

            if (!response.ok) {
                throw new Error("Failed to fetch chats");
            }

            return response.json();
        },
        staleTime: 1 * 60 * 1000, // 1 minute
        retry: 2,
        enabled: !!selectedTutor, // Only fetch when a tutor is selected
    });

    // Filtered chats based on search query and selected tutor
    const filteredChats = React.useMemo(() => {
        if (!selectedTutor) return [];

        return chats
            .filter((chat: FrontendChat) => chat.tutorId === selectedTutor)
            .filter((chat: FrontendChat) =>
                searchQuery
                    ? chat?.name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    : true,
            );
    }, [chats, selectedTutor, searchQuery]);

    // Filter tutors based on search query
    const filteredTutors = React.useMemo(() => {
        return tutors.filter((tutor: TutorModel) =>
            searchQuery
                ? tutor.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                tutor.subject
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                : true,
        );
    }, [tutors, searchQuery]);

    const activeTutor = React.useMemo(
        () => tutors.find((tutor: TutorModel) => tutor.id === selectedTutor),
        [tutors, selectedTutor],
    );

    // Handle tutor selection with animation using useCallback
    const handleTutorSelect = React.useCallback(
        (tutorId: string) => {
            setSelectedTutor(tutorId);
            setIsAnimating(true);
            // Delay the view change to allow for animation
            setTimeout(() => {
                setView("chats");
                setIsAnimating(false);
            }, 50);
        },
        [setSelectedTutor],
    );

    // Handle back to tutors with animation using useCallback
    const handleBackToTutors = React.useCallback(() => {
        setIsAnimating(true);
        // Delay the view change to allow for animation
        setTimeout(() => {
            setView("tutors");
            setIsAnimating(false);
        }, 50);
    }, []);

    // Handle new chat creation
    const handleNewChat = React.useCallback(() => {
        handleTutorSelect(selectedTutor || "");
        if (pathname !== "/app") {
            router.push("/app");
        }
    }, [handleTutorSelect, selectedTutor, pathname, router]);

    // Early return cases
    if (pathname === "/") {
        return null;
    }

    if (status !== "authenticated" || !session || !session.user) {
        return null;
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-4 py-2">
                    <BookOpen className="h-6 w-6" />
                    <h1 className="text-xl font-semibold">Tut.AI</h1>
                </div>
                <div className="px-4 py-2">
                    <SidebarInput
                        className="h-9"
                        placeholder={
                            view === "tutors"
                                ? "Search tutors..."
                                : "Search chats..."
                        }
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <div className="relative overflow-hidden">
                    {/* Tutors View */}
                    <div
                        className={`transition-all duration-300 ${view === "tutors"
                                ? "translate-x-0 opacity-100"
                                : "-translate-x-full absolute opacity-0"
                            } ${isAnimating ? "pointer-events-none" : ""}`}
                    >
                        <SidebarGroup>
                            <SidebarGroupLabel className="flex justify-between items-center">
                                <span>Tutors</span>
                                <Button
                                    className="h-5 w-5"
                                    size="icon"
                                    variant="ghost"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    <span className="sr-only">Add Tutor</span>
                                </Button>
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <ScrollArea className="h-[calc(100vh-200px)]">
                                    {tutorsLoading ? (
                                        <div className="flex justify-center items-center p-4">
                                            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                        </div>
                                    ) : tutorsError ? (
                                        <div className="p-4 text-sm text-center text-red-500">
                                            Failed to load tutors. Please try
                                            again.
                                        </div>
                                    ) : filteredTutors.length === 0 ? (
                                        <div className="p-4 text-sm text-center text-muted-foreground">
                                            No tutors found
                                        </div>
                                    ) : (
                                        <SidebarMenu>
                                            {filteredTutors.map(
                                                (tutor: TutorModel) => (
                                                    <TutorItem
                                                        key={tutor.id}
                                                        tutor={tutor}
                                                        onSelect={
                                                            handleTutorSelect
                                                        }
                                                    />
                                                ),
                                            )}
                                        </SidebarMenu>
                                    )}
                                </ScrollArea>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </div>
                    {/* Chats View */}
                    <div
                        className={`transition-all duration-300 ${view === "chats"
                                ? "translate-x-0 opacity-100"
                                : "translate-x-full absolute opacity-0"
                            } ${isAnimating ? "pointer-events-none" : ""}`}
                    >
                        <SidebarGroup>
                            <SidebarGroupLabel className="flex items-center gap-2">
                                <Button
                                    className="h-5 w-5"
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleBackToTutors}
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    <span className="sr-only">
                                        Back to tutors
                                    </span>
                                </Button>
                                <div className="flex items-center gap-2">
                                    {activeTutor && (
                                        <>
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback>
                                                    {activeTutor.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{activeTutor.name}</span>
                                        </>
                                    )}
                                </div>
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <div className="flex justify-between items-center px-4 py-2">
                                    <span className="text-sm font-medium">
                                        Chats
                                    </span>
                                    <Button
                                        className="h-8 gap-1"
                                        size="sm"
                                        variant="outline"
                                        onClick={handleNewChat}
                                    >
                                        <MessageSquarePlus className="h-4 w-4" />
                                        <span>New Chat</span>
                                    </Button>
                                </div>
                                <ScrollArea className="h-[calc(100vh-250px)]">
                                    {chatsLoading ? (
                                        <div className="flex justify-center items-center p-4">
                                            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                        </div>
                                    ) : chatsError ? (
                                        <div className="p-4 text-sm text-center text-red-500">
                                            Failed to load chats. Please try
                                            again.
                                        </div>
                                    ) : filteredChats.length > 0 ? (
                                        <SidebarMenu>
                                            {filteredChats.map(
                                                (chat: FrontendChat) => (
                                                    <ChatItem
                                                        key={chat.id}
                                                        chat={chat}
                                                    />
                                                ),
                                            )}
                                        </SidebarMenu>
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-muted-foreground">
                                            No chats with this tutor yet. Start
                                            a new conversation!
                                        </div>
                                    )}
                                </ScrollArea>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </div>
                </div>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    alt="User"
                                    src={session.user.image || ""}
                                />
                                <AvatarFallback>
                                    {session.user.name?.at(0)?.toUpperCase() ||
                                        "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-medium">
                                    {session.user.name}
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
