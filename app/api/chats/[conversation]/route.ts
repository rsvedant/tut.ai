import { createOpenAI } from "@ai-sdk/openai";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import client from "@/lib/db";
import { authOptions } from "@/lib/utils/auth-options";

const api = createOpenAI({
    baseURL: "https://api.studio.nebius.com/v1/",
    apiKey: process.env.NEBIUS_API_KEY,
});

export const GET = async (
    req: NextRequest,
    { params }: { params: { conversation: string } },
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
    const messages = chat.messages.map((message: any) => ({
        role: message.role,
        content: message.content,
    }));

    const completion = await api
        .chat("deepseek-ai/DeepSeek-R1-Distill-Llama-70B")
        .doStream({
            inputFormat: "messages",
            mode: { type: "regular" },
            prompt: messages,
        });

    return completion.stream;
};

export const POST = async (
    req: NextRequest,
    { params }: { params: { conversation: string } },
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
    if (!conversation) {
        return NextResponse.json(
            { error: "Message cannot be empty" },
            { status: 400 },
        );
    }

    const completion = await api
        .chat("deepseek-ai/DeepSeek-R1-Distill-Llama-70B")
        .doStream({
            inputFormat: "messages",
            mode: { type: "regular" },
            prompt: [{ role: "user", content: message }],
        });

    return completion.stream;
};
