import { randomUUID } from "crypto";

import { NextRequest, NextResponse } from "next/server";

const createChat = async ({
    messages,
}: {
    messages: {
        role: "user" | "assistant" | "system";
        content: string;
    }[];
}) => {
    const chat = {
        messages,
        id: randomUUID(),
    };
    // const client = await clientPromise;
    // const db = client.db("chats");
    // const collection = db.collection("chats");
    // const result = await collection.insertOne(chat);

    // return result;
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    const { messages } = await req.json();

    await createChat({ messages });

    return NextResponse.json({ message: "Chat created" });
};
