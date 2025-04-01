import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import client from "@/lib/db";
import { authOptions } from "@/lib/utils/auth-options";

const api = createOpenAI({
    baseURL: "https://api.studio.nebius.com/v1/",
    apiKey: process.env.NEBIUS_API_KEY,
    compatibility: "compatible",
});

export const GET = async (
    _req: NextRequest,
    { params }: { params: Promise<{ conversation: string }> }, // fix type by explicitly specifying params as a Promise
) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }
        const { conversation } = await params;

        if (!conversation) {
            return NextResponse.json(
                { error: "Conversation ID is required" },
                { status: 400 },
            );
        }

        const db = client.db("chats");
        const collection = db.collection("chats");
        const chat = await collection.findOne({ id: conversation });

        if (!chat) {
            return NextResponse.json(
                { error: "Conversation not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            ...chat,
        });
    } catch (error) {
        console.error("Error fetching chat:", error);

        return NextResponse.json(
            { error: "Failed to fetch conversation" },
            { status: 500 },
        );
    }
};

export const POST = async (
    req: NextRequest,
    { params }: { params: Promise<{ conversation: string }> }, // fix type by explicitly specifying params as a Promise
) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const { conversation } = await params;
        const body = await req.json();
        const { messages } = body;

        if (!conversation) {
            return NextResponse.json(
                { error: "Conversation ID is required" },
                { status: 400 },
            );
        }

        if (!messages || messages.length === 0) {
            return NextResponse.json(
                { error: "Messages cannot be empty" },
                { status: 400 },
            );
        }

        const chat = await client
            .db("chats")
            .collection("chats")
            .findOne({ id: conversation, owner: session.user?.email });

        if (!chat) {
            return NextResponse.json(
                { error: "Conversation not found" },
                { status: 404 },
            );
        }

        const result = streamText({
            model: api("deepseek-ai/DeepSeek-R1-Distill-Llama-70B"),
            messages: [...messages, ...chat.messages],
        });

        result.text.then(async (text) => {
            await client
                .db("chats")
                .collection("chats")
                .updateOne(
                    { id: conversation, owner: session.user?.email },
                    {
                        $push: {
                            messages: {
                                role: "assistant",
                                content: text,
                            } as any,
                        },
                    },
                );
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error("Error in chat API:", error);

        return NextResponse.json(
            { error: "Failed to process chat request" },
            { status: 500 },
        );
    }
};
