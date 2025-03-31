"use client";

import { useParams } from "next/navigation";

export default function Chat() {
    const { chatId } = useParams();

    return (
        <div>
            <h1>Chat ID: {chatId}</h1>
        </div>
    );
}
