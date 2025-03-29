import { NextRequest, NextResponse } from "next/server";

const createChat = ({
    messages,
}: {
    messages: {
        role: "user" | "assistant" | "system";
        content: string;
    }[];
}) => { };

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    const client = await (await import("../../../lib/mongodb")).default;
    const db = client.db("chats");

    return NextResponse.json({ message: "Chat created" });
};
