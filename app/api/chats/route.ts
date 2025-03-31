import { randomUUID } from "crypto";

import { getServerSession, Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

import client from "@/lib/db";
import { authOptions } from "@/lib/utils/auth-options";
import { models } from "@/lib/utils/tutors";
import { Message, TutorModel, UncreatedChat } from "@/types";

const createChat = async ({
    message,
    session,
    tutorId,
}: {
    message: string;
    session: Session;
    tutorId: TutorModel["id"];
}) => {
    const tutor = models.find((m) => m.id === tutorId);

    if (!tutor) {
        throw new Error("Tutor not found");
    }
    const { systemPrompt } = tutor;

    if (!systemPrompt) {
        throw new Error("System message is required");
    }
    const systemMessage: Message = {
        role: "system",
        content: systemPrompt,
    };

    const messages: Message[] = [
        systemMessage,
        {
            role: "user",
            content: message,
        },
    ];

    const ai = new OpenAI({
        baseURL: "https://api.studio.nebius.com/v1/",
        apiKey: process.env.NEBIUS_API_KEY,
    });

    const completion = await ai.chat.completions.create({
        model: "meta-llama/Meta-Llama-3.1-405B-Instruct",
        max_tokens: 100,
        temperature: 0.6,
        top_p: 0.95,
        messages: [
            {
                role: "system",
                content: `You must only respond with a name for the chat. Do not add any other text. The chat is about ${message}.`,
            },
            {
                role: "user",
                content: message,
            },
        ],
    });
    const chatName = completion.choices[0].message.content;

    if (!chatName) {
        throw new Error("Chat name is required");
    } else if (!session.user?.email) {
        throw new Error("User email is required");
    }

    const chat: UncreatedChat = {
        messages,
        id: randomUUID(),
        owner: session.user?.email,
        tutorId,
        name: chatName,
    };

    const db = client.db("chats");
    const collection = db.collection("chats");

    await collection.insertOne(chat as any);

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

    return NextResponse.json(
        {
            message: "Chat created",
            chatId: chat.id,
        },
        {
            status: 200,
        },
    );
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
