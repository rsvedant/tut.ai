import { randomUUID } from "crypto";

import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getServerSession, Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import client from "@/lib/db";
import { authOptions } from "@/lib/utils/auth-options";
import { models, TutorModel } from "@/lib/utils/tutors";

interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

const createChat = async ({
    message,
    session,
    tutorId,
}: {
    message: string;
    session: Session;
    tutorId: TutorModel["id"];
}) => {
    const systemMessage = {
        role: "system",
        content: models.find((m) => m.id === tutorId)?.systemPrompt,
    } as Message;

    const messages = [
        systemMessage,
        {
            role: "user",
            content: message,
        },
    ];

    const chat = {
        messages,
        id: randomUUID(),
        owner: session.user?.email,
        tutorId,
    };
    const db = client.db("chats");
    const collection = db.collection("chats");

    await collection.insertOne(chat);

    return chat;
};

export const POST = async (req: NextRequest): Promise<Response> => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            {
                error: "Unauthorized",
            },
            { status: 401 },
        );
    }
    const { message, tutorId } = await req.json();
    const chat = await createChat({ message, session, tutorId });

    const db = client.db("chats");
    const collection = db.collection("chats");

    const customOpenAI = createOpenAI({
        baseURL: "https://api.studio.nebius.com/v1/",
        apiKey: process.env.OPENAI_API_KEY,
        compatibility: "compatible",
    });

    try {
        const result = streamText({
            model: customOpenAI("deepseek-ai/DeepSeek-R1-Distill-Llama-70B"),
            messages: chat.messages as Message[],
            maxRetries: 3,
        });
        const fullResponsePromise = result.text;

        const streamResponse = result.toDataStreamResponse();

        fullResponsePromise
            .then(async (fullText) => {
                try {
                    await collection.updateOne(
                        {
                            id: chat.id,
                        },
                        {
                            $push: {
                                messages: {
                                    role: "assistant",
                                    content: fullText,
                                } as any,
                            },
                        },
                    );
                } catch (error) {
                    // Log error to server logs without using console
                    const errorMessage =
                        error instanceof Error ? error.message : String(error);

                    process.stderr.write(
                        `Error updating chat with AI response: ${errorMessage}\n`,
                    );
                }
            })
            .catch((error) => {
                // Log error to server logs without using console
                const errorMessage =
                    error instanceof Error ? error.message : String(error);

                process.stderr.write(
                    `Error getting full AI response: ${errorMessage}\n`,
                );
            });

        return streamResponse;
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);

        process.stderr.write(`Error in AI stream: ${errorMessage}\n`);

        return NextResponse.json(
            { error: "Failed to process your request" },
            { status: 500 },
        );
    }
};

export const GET = async (req: NextRequest): Promise<Response> => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            {
                error: "Unauthorized",
            },
            { status: 401 },
        );
    }

    const db = client.db("chats");
    const collection = db.collection("chats");

    const chats = await collection
        .find({
            owner: session.user?.email,
        })
        .toArray();

    return NextResponse.json(chats, {
        status: 200,
    });
};
