import { createOpenAI } from "@ai-sdk/openai";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/utils/auth-options";
const api = createOpenAI({
    baseURL: "https://api.studio.nebius.com/v1/",
    apiKey: process.env.NEBIUS_API_KEY,
});

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
