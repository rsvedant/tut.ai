import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import client from "@/lib/db";
import { authOptions } from "@/lib/utils/auth-options";

const api = createOpenAI({
    baseURL: "https://api.studio.nebius.com/v1/",
    apiKey: process.env.NEBIUS_API_KEY,
});

export const GET = async (
    _req: NextRequest,
    { params }: { params: Promise<{ conversation: string }> },
) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
};

export const POST = async (
    req: NextRequest,
    { params }: { params: Promise<{ conversation: string }> },
) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { conversation } = await params;
    const body = await req.json();
    const { message } = body;

    if (!conversation) {
        return NextResponse.json(
            { error: "Conversation ID is required" },
            { status: 400 },
        );
    }
    if (!message) {
        return NextResponse.json(
            { error: "Message cannot be empty" },
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
        model: api.chat("deepseek-ai/DeepSeek-R1-Distill-Llama-70B"),
        messages: [{ role: "user", content: message }, ...chat.messages],
    });

    return result.toDataStreamResponse();
};
