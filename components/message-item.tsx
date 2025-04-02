"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import 'highlight.js/styles/github-dark.css';
import { Bot, ChevronDown, ChevronRight, Edit, RotateCcw, User } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface MessageItemProps {
    message: ChatMessage;
    onEdit: (messageId: string, content: string) => void;
    onRerun: () => void;
    isLastUserMessage: boolean;
    isStreaming?: boolean;
}

export function MessageItem({
    message,
    onEdit,
    onRerun,
    isLastUserMessage,
    isStreaming = false,
}: MessageItemProps) {
    const [showActions, setShowActions] = useState(false);
    const [cursorVisible, setCursorVisible] = useState(true);
    const [showThinking, setShowThinking] = useState(false);
    const [processedContent, setProcessedContent] = useState<React.ReactNode[]>([]);
    const [processedThinking, setProcessedThinking] = useState<React.ReactNode[]>([]);

    // Blinking cursor effect for streaming messages
    useEffect(() => {
        if (!isStreaming) return;

        const interval = setInterval(() => {
            setCursorVisible((prev) => !prev);
        }, 500);

        return () => clearInterval(interval);
    }, [isStreaming]);

    // Process content to render LaTeX
    useEffect(() => {
        if (message.content) {
            setProcessedContent(renderContentWithLaTeX(message.content));
        }
        if (message.thinking) {
            setProcessedThinking(renderContentWithLaTeX(message.thinking));
        }
    }, [message.content, message.thinking]);

    const renderContentWithLaTeX = (content: string) => {
        if (!content) return [];
        // Use 'g' flag only (without 's' flag) for compatibility with older TypeScript targets
        const blockRegex = /\\\[(.*?)\\\]/g;
        const inlineRegex = /\\\((.*?)\\\)/g;
        
        let lastIndex = 0;
        const parts: React.ReactNode[] = [];
        let match;
        let contentCopy = content;
        
        // Replace block math
        while ((match = blockRegex.exec(contentCopy)) !== null) {
            // Add text before the match
            if (match.index > lastIndex) {
                parts.push(
                    <ReactMarkdown
                        key={`text-${lastIndex}`}
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                            pre: ({ node, ...props }) => (
                                <pre className="p-2 rounded bg-muted/80 overflow-auto" {...props} />
                            ),
                            code: ({ node, className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(className || '');
                                return match ? (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                ) : (
                                    <code className="bg-muted/50 px-1 py-0.5 rounded text-sm" {...props}>
                                        {children}
                                    </code>
                                );
                            },
                            a: ({ node, ...props }) => (
                                <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                            ),
                        }}
                    >
                        {contentCopy.slice(lastIndex, match.index)}
                    </ReactMarkdown>
                );
            }
            
            // Add the LaTeX block
            try {
                parts.push(
                    <BlockMath key={`math-${match.index}`} math={match[1]} />
                );
            } catch (error) {
                parts.push(<div key={`math-error-${match.index}`} className="text-red-500">{match[0]}</div>);
            }
            
            lastIndex = match.index + match[0].length;
        }
        
        // Add remaining text
        if (lastIndex < contentCopy.length) {
            let remainingContent = contentCopy.slice(lastIndex);
            
            // Handle inline math in the remaining content
            lastIndex = 0;
            const inlineParts: React.ReactNode[] = [];
            
            while ((match = inlineRegex.exec(remainingContent)) !== null) {
                // Add text before the match
                if (match.index > lastIndex) {
                    inlineParts.push(
                        <ReactMarkdown
                            key={`inline-text-${lastIndex}`}
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                                pre: ({ node, ...props }) => (
                                    <pre className="p-2 rounded bg-muted/80 overflow-auto" {...props} />
                                ),
                                code: ({ node, className, children, ...props }) => {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return match ? (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    ) : (
                                        <code className="bg-muted/50 px-1 py-0.5 rounded text-sm" {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                                a: ({ node, ...props }) => (
                                    <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                                ),
                            }}
                        >
                            {remainingContent.slice(lastIndex, match.index)}
                        </ReactMarkdown>
                    );
                }
                
                // Add the inline LaTeX
                try {
                    inlineParts.push(
                        <InlineMath key={`inline-math-${match.index}`} math={match[1]} />
                    );
                } catch (error) {
                    inlineParts.push(<span key={`inline-math-error-${match.index}`} className="text-red-500">{match[0]}</span>);
                }
                
                lastIndex = match.index + match[0].length;
            }
            
            // Add any remaining text after the last inline math
            if (lastIndex < remainingContent.length) {
                inlineParts.push(
                    <ReactMarkdown
                        key={`inline-text-final`}
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                            pre: ({ node, ...props }) => (
                                <pre className="p-2 rounded bg-muted/80 overflow-auto" {...props} />
                            ),
                            code: ({ node, className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(className || '');
                                return match ? (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                ) : (
                                    <code className="bg-muted/50 px-1 py-0.5 rounded text-sm" {...props}>
                                        {children}
                                    </code>
                                );
                            },
                            a: ({ node, ...props }) => (
                                <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                            ),
                        }}
                    >
                        {remainingContent.slice(lastIndex)}
                    </ReactMarkdown>
                );
            }
            
            // If there were inline parts, add them; otherwise add the whole remaining content
            if (inlineParts.length > 0) {
                parts.push(...inlineParts);
            } else {
                parts.push(
                    <ReactMarkdown
                        key={`text-final`}
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                            pre: ({ node, ...props }) => (
                                <pre className="p-2 rounded bg-muted/80 overflow-auto" {...props} />
                            ),
                            code: ({ node, className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(className || '');
                                return match ? (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                ) : (
                                    <code className="bg-muted/50 px-1 py-0.5 rounded text-sm" {...props}>
                                        {children}
                                    </code>
                                );
                            },
                            a: ({ node, ...props }) => (
                                <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                            ),
                        }}
                    >
                        {remainingContent}
                    </ReactMarkdown>
                );
            }
        }
        
        return parts;
    };

    const isUser = message.role === "user";
    const hasThinking = !!message.thinking && message.thinking.trim().length > 0;

    return (
        <div
            className="group relative"
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="flex items-start gap-3">
                <div
                    className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        isUser ? "bg-primary/10" : "bg-primary",
                    )}
                >
                    {isUser ? (
                        <User className="h-4 w-4" />
                    ) : (
                        <Bot className="h-4 w-4 text-primary-foreground" />
                    )}
                </div>

                <div className="flex-1">
                    <div className="font-medium mb-1">
                        {isUser ? "You" : "Tutor"}
                    </div>

                    <Card
                        className={cn(
                            "p-4",
                            isUser ? "bg-muted" : "bg-background",
                        )}
                    >
                        {hasThinking && !isUser && (
                            <div className="mb-3">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="mb-2 w-full flex justify-between items-center text-xs" 
                                    onClick={() => setShowThinking(!showThinking)}
                                >
                                    <span className="flex items-center">
                                        {showThinking ? <ChevronDown className="h-3 w-3 mr-1" /> : <ChevronRight className="h-3 w-3 mr-1" />}
                                        Thinking...
                                    </span>
                                    <span className="text-muted-foreground">See reasoning</span>
                                </Button>
                                
                                {showThinking && (
                                    <Card className="p-3 bg-muted/40 text-sm text-muted-foreground mb-3 whitespace-pre-wrap">
                                        <div className="prose prose-sm max-w-none dark:prose-invert">
                                            {processedThinking}
                                        </div>
                                    </Card>
                                )}
                            </div>
                        )}

                        <div className={cn(
                            "prose prose-sm max-w-none",
                            isUser ? "prose-neutral" : "prose-primary",
                            "dark:prose-invert"
                        )}>
                            {processedContent}
                            {isStreaming && cursorVisible && (
                                <span className="animate-pulse">▋</span>
                            )}
                        </div>
                    </Card>

                    <div className="text-xs text-muted-foreground mt-1">
                        {isStreaming
                            ? "Typing..."
                            : new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                </div>
            </div>

            {isUser && !isStreaming && (showActions || isLastUserMessage) && (
                <div className="absolute -left-12 top-8 flex flex-col gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(message._id, message.content)}
                        title="Edit message"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={onRerun}
                        title="Rerun message"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
