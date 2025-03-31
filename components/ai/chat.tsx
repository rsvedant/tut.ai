import { Avatar } from "@heroui/avatar";
import { Button, Button as HeroUIButton } from "@heroui/button";
import { Form } from "@heroui/form";
import { cn } from "@heroui/theme";
import { Tooltip } from "@heroui/tooltip";
import { Icon } from "@iconify/react";

import MessageCard from "./ai-message";
import PromptInput from "./prompt-input";

import { TutorModel } from "@/lib/utils/tutors";

export const ChatHeader = ({ tutor }: { tutor: TutorModel }) => (
    <div className="py-3.5 px-5 border-b border-zinc-200/50 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-950 shadow-sm">
        <div className="flex items-center gap-3.5">
            <Avatar
                isBordered
                showFallback
                className="flex-shrink-0"
                color="primary"
                name={tutor?.name}
                size="sm"
            />
            <div>
                <div className="font-medium flex items-center gap-2">
                    {tutor?.name}
                    {/* Commented out online indicator can be conditionally included */}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {tutor?.subject} • Active now
                </div>
            </div>
        </div>
        <ChatActions />
    </div>
);

export const ChatActions = () => (
    <div className="flex items-center gap-1.5">
        <Tooltip content="Search in conversation">
            <HeroUIButton
                isIconOnly
                className="rounded-full"
                size="sm"
                variant="light"
            >
                <Icon className="h-4 w-4" icon="lucide:search" />
            </HeroUIButton>
        </Tooltip>
        <Tooltip content="More options">
            <HeroUIButton
                isIconOnly
                className="rounded-full"
                size="sm"
                variant="light"
            >
                <Icon className="h-4 w-4" icon="lucide:more-vertical" />
            </HeroUIButton>
        </Tooltip>
    </div>
);

const EmptyChatState = () => (
    <div className="flex flex-col items-center justify-center h-full">
        <Icon
            className="h-10 w-10 text-zinc-500 mb-4"
            icon="lucide:message-square"
        />
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Send a message to get started
        </p>
    </div>
);

export const ChatMessages = ({
    chatContainerRef,
    messages = [],
}: {
    chatContainerRef: React.RefObject<HTMLDivElement>;
    messages?: any[];
}) => (
    <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-5 py-6 space-y-8 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 scroll-smooth"
    >
        {messages.length == 0 ? (
            <EmptyChatState />
        ) : (
            messages.map((message, index) => (
                <MessageCard key={index} message={message} />
            ))
        )}
    </div>
);

export const ChatInput = ({
    message,
    setMessage,
    handleSubmit,
}: {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    handleSubmit: () => Promise<void>;
}) => (
    <div className="p-5 border-t border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="flex items-center gap-2">
            <Form className="flex w-full items-start gap-2">
                <PromptInput
                    classNames={{
                        innerWrapper: "relative w-full",
                        input: "pt-1 pb-6 !pr-10 text-medium",
                    }}
                    endContent={
                        <ChatInputActions
                            handleSubmit={handleSubmit}
                            message={message}
                        />
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
);

export const ChatInputActions = ({
    message,
    handleSubmit,
}: {
    message: string;
    handleSubmit: () => Promise<void>;
}) => (
    <div className="absolute right-0 flex h-full flex-col items-end justify-between gap-2">
        <div /> {/* Spacer */}
        <div className="flex items-end gap-2">
            <p className="py-1 text-tiny text-default-400">
                {message.length}/2000
            </p>
            <Tooltip showArrow content="Send message">
                <Button
                    isIconOnly
                    color={!message ? "default" : "primary"}
                    isDisabled={!message}
                    radius="lg"
                    size="sm"
                    variant={!message ? "flat" : "solid"}
                    onPress={handleSubmit}
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
);
