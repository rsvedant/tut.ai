"use client";

import {
    ArrowLeft,
    BookOpen,
    MessageSquarePlus,
    PlusCircle,
} from "lucide-react";
import * as React from "react";

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
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

// Sample data for tutors and chats
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

export function ChatSidebar() {
    const [selectedTutor, setSelectedTutor] = React.useState<string | null>(
        null,
    );
    const [searchQuery, setSearchQuery] = React.useState("");
    const [view, setView] = React.useState<"tutors" | "chats">("tutors");
    const [isAnimating, setIsAnimating] = React.useState(false);

    // Filter chats based on selected tutor
    const filteredChats = selectedTutor
        ? chats.filter((chat) => chat.tutorId === selectedTutor)
        : [];

    // Get the selected tutor object
    const activeTutor = tutors.find((tutor) => tutor.id === selectedTutor);

    // Handle tutor selection with animation
    const handleTutorSelect = (tutorId: string) => {
        setSelectedTutor(tutorId);
        setIsAnimating(true);

        // Delay the view change to allow for animation
        setTimeout(() => {
            setView("chats");
            setIsAnimating(false);
        }, 300);
    };

    // Handle back to tutors with animation
    const handleBackToTutors = () => {
        setIsAnimating(true);

        // Delay the view change to allow for animation
        setTimeout(() => {
            setView("tutors");
            setIsAnimating(false);
        }, 300);
    };

    // Handle new chat creation
    const handleNewChat = () => {
        console.log("Creating new chat with tutor:", selectedTutor);
        // Implement your new chat creation logic here
    };

    return (
        <SidebarProvider>
            <Sidebar className="border-r">
                <SidebarHeader>
                    <div className="flex items-center gap-2 px-4 py-2">
                        <BookOpen className="h-6 w-6" />
                        <h1 className="text-xl font-semibold">TutorChat</h1>
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
                                        <span className="sr-only">
                                            Add Tutor
                                        </span>
                                    </Button>
                                </SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <ScrollArea className="h-[calc(100vh-200px)]">
                                        <SidebarMenu>
                                            {tutors.map((tutor) => (
                                                <SidebarMenuItem key={tutor.id}>
                                                    <SidebarMenuButton
                                                        className="flex items-center gap-3"
                                                        onClick={() =>
                                                            handleTutorSelect(
                                                                tutor.id,
                                                            )
                                                        }
                                                    >
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage
                                                                alt={tutor.name}
                                                                src={
                                                                    tutor.avatar
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {tutor.name.charAt(
                                                                    0,
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">
                                                                {tutor.name}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {tutor.subject}
                                                            </span>
                                                        </div>
                                                        {tutor.online && (
                                                            <div className="ml-auto h-2 w-2 rounded-full bg-green-500" />
                                                        )}
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
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
                                                    <AvatarImage
                                                        alt={activeTutor.name}
                                                        src={activeTutor.avatar}
                                                    />
                                                    <AvatarFallback>
                                                        {activeTutor.name.charAt(
                                                            0,
                                                        )}
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
                                        <SidebarMenu>
                                            {filteredChats.length > 0 ? (
                                                filteredChats.map((chat) => (
                                                    <SidebarMenuItem
                                                        key={chat.id}
                                                    >
                                                        <SidebarMenuButton className="flex flex-col items-start gap-1">
                                                            <div className="flex w-full justify-between">
                                                                <span className="font-medium">
                                                                    {chat.title}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {
                                                                        chat.timestamp
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="flex w-full justify-between">
                                                                <span className="text-xs text-muted-foreground truncate max-w-[80%]">
                                                                    {
                                                                        chat.lastMessage
                                                                    }
                                                                </span>
                                                                {chat.unread && (
                                                                    <Badge
                                                                        className="h-5 w-5 rounded-full p-0 flex items-center justify-center"
                                                                        variant="default"
                                                                    >
                                                                        <span className="sr-only">
                                                                            Unread
                                                                            messages
                                                                        </span>
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuItem>
                                                ))
                                            ) : (
                                                <div className="px-4 py-3 text-sm text-muted-foreground">
                                                    No chats with this tutor
                                                    yet. Start a new
                                                    conversation!
                                                </div>
                                            )}
                                        </SidebarMenu>
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
                                        src="/placeholder.svg?height=40&width=40"
                                    />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        Your Name
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Student
                                    </span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            {/* This is where your main content would go */}
            <div className="flex-1 p-4">
                <SidebarTrigger className="mb-4 md:hidden" />
                <div className="rounded-lg border p-4">
                    {selectedTutor ? (
                        <div>
                            <h2 className="text-lg font-semibold">
                                {
                                    tutors.find((t) => t.id === selectedTutor)
                                        ?.name
                                }
                            </h2>
                            <p className="text-muted-foreground">
                                {view === "chats"
                                    ? "Select a chat or start a new conversation"
                                    : "Click on a tutor to see your chats"}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-lg font-semibold">
                                Welcome to TutorChat
                            </h2>
                            <p className="text-muted-foreground">
                                Select a tutor to get started
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </SidebarProvider>
    );
}
