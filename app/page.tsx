"use client";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Icon } from "@iconify/react";
import React from "react";

const tutors = [
    {
        id: "1",
        name: "Dr. Smith",
        subject: "Mathematics",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        online: true,
    },
    {
        id: "2",
        name: "Prof. Johnson",
        subject: "Physics",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        online: true,
    },
    {
        id: "3",
        name: "Ms. Williams",
        subject: "Chemistry",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026702d",
        online: false,
    },
    {
        id: "4",
        name: "Mr. Davis",
        subject: "Biology",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026701d",
        online: true,
    },
];

const messages = [
    {
        id: "1",
        message: "Hello! How can I help you today?",
        isUser: false,
        timestamp: "2:30 PM",
    },
    {
        id: "2",
        message: "I need help with calculus derivatives",
        isUser: true,
        timestamp: "2:31 PM",
    },
    {
        id: "3",
        message:
            "Of course! Let's start with the basics. What specific aspect of derivatives are you struggling with?",
        isUser: false,
        timestamp: "2:32 PM",
    },
];

import MessageCard from "@/components/ai/message-card";

export default function App() {
    const [selectedTutor, setSelectedTutor] = React.useState("1");
    const [message, setMessage] = React.useState("");

    const currentTutor = tutors.find((t) => t.id === selectedTutor);

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
                    {/* Tutors List */}
                    <Card className="md:col-span-1 h-full">
                        <CardBody className="p-0">
                            <div className="p-4 border-b border-divider">
                                <Input
                                    placeholder="Search tutors..."
                                    size="sm"
                                    startContent={
                                        <Icon
                                            className="text-default-400"
                                            icon="lucide:search"
                                        />
                                    }
                                    variant="bordered"
                                />
                            </div>
                            <div className="space-y-1 p-2">
                                {tutors.map((tutor) => (
                                    <Button
                                        key={tutor.id}
                                        className="w-full justify-start p-2"
                                        color={
                                            selectedTutor === tutor.id
                                                ? "primary"
                                                : "default"
                                        }
                                        variant={
                                            selectedTutor === tutor.id
                                                ? "flat"
                                                : "light"
                                        }
                                        onPress={() =>
                                            setSelectedTutor(tutor.id)
                                        }
                                    >
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                color={
                                                    tutor.online
                                                        ? "success"
                                                        : "default"
                                                }
                                                content=""
                                                placement="bottom-right"
                                                size="sm"
                                            >
                                                <Avatar
                                                    isBordered
                                                    color={
                                                        selectedTutor ===
                                                        tutor.id
                                                            ? "primary"
                                                            : "default"
                                                    }
                                                    name={tutor.name}
                                                    size="sm"
                                                    src={tutor.avatar}
                                                />
                                            </Badge>
                                            <div className="text-left">
                                                <p className="text-sm font-medium">
                                                    {tutor.name}
                                                </p>
                                                <p className="text-xs text-default-500">
                                                    {tutor.subject}
                                                </p>
                                            </div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Chat Area */}
                    <Card className="md:col-span-3 h-full">
                        <CardBody className="p-0">
                            {selectedTutor ? (
                                <>
                                    <div className="p-4 border-b border-divider">
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                color={
                                                    currentTutor?.online
                                                        ? "success"
                                                        : "default"
                                                }
                                                content=""
                                                placement="bottom-right"
                                                size="sm"
                                            >
                                                <Avatar
                                                    isBordered
                                                    color="primary"
                                                    name={currentTutor?.name}
                                                    size="sm"
                                                    src={currentTutor?.avatar}
                                                />
                                            </Badge>
                                            <div>
                                                <p className="font-medium">
                                                    {currentTutor?.name}
                                                </p>
                                                <p className="text-xs text-default-500">
                                                    {currentTutor?.subject}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="flex-1 overflow-y-auto p-4 space-y-4"
                                        style={{ height: "calc(100% - 140px)" }}
                                    >
                                        {messages.map((msg) => (
                                            <MessageCard
                                                key={msg.id}
                                                isUser={msg.isUser}
                                                message={msg.message}
                                                timestamp={msg.timestamp}
                                            />
                                        ))}
                                    </div>
                                    <div className="p-4 border-t border-divider">
                                        <div className="flex items-center gap-2">
                                            <Input
                                                className="flex-1"
                                                endContent={
                                                    <Button
                                                        isIconOnly
                                                        color="primary"
                                                        size="lg"
                                                        variant="flat"
                                                        onPress={() => {
                                                            if (
                                                                message.trim()
                                                            ) {
                                                                setMessage("");
                                                            }
                                                        }}
                                                    >
                                                        <Icon
                                                            className="h-5 w-5"
                                                            icon="lucide:send"
                                                        />
                                                    </Button>
                                                }
                                                placeholder="Type your message..."
                                                size="lg"
                                                type="text"
                                                value={message}
                                                variant="bordered"
                                                onValueChange={setMessage}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-lg font-semibold">
                                    Please select a tutor to start chatting.
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
