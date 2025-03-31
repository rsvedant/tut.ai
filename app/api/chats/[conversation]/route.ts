import { createOpenAI } from "@ai-sdk/openai";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
const api = createOpenAI({
    baseURL: "https://api.studio.nebius.com/v1/",
    apiKey: process.env.NEBIUS_API_KEY,
});

export const POST = async (
    req: NextRequest,
    { params }: { params: { conversation: string } },
) => {
    // Auth Check

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

    const client = new OpenAI({
        baseURL: "https://api.studio.nebius.com/v1/",
        apiKey: process.env.NEBIUS_API_KEY,
    });

    // const completion = await client.chat.completions.create({
    //     model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B",
    //     max_tokens: 8192,
    //     temperature: 0.6,
    //     top_p: 0.95,
    //     messages: [{ role: "user", content: message }],
    //     stream: true,
    // });

    // // Stream back the response
    // const stream = new ReadableStream({
    //     async pull(controller) {
    //         for await (const chunk of completion) {
    //             if (chunk.choices[0].delta.content) {
    //                 controller.enqueue(chunk.choices[0].delta.content);
    //             }
    //         }
    //         controller.close();
    //     },
    // });

    // const streamReader = stream.getReader();
    // const reader = new ReadableStream({
    //     async pull(controller) {
    //         const { done, value } = await streamReader.read();

    //         if (done) {
    //             controller.close();

    //             return;
    //         }
    //         controller.enqueue(value);
    //     },
    // });

    // // Create a flag to track when the stream has been processed
    // let streamProcessed = false;

    // // Modify the reader to detect when stream is complete
    // const trackedReader = new ReadableStream({
    //     async pull(controller) {
    //         const { done, value } = await streamReader.read();

    //         if (done) {
    //             controller.close();
    //             // The stream is complete
    //             streamProcessed = true;

    //             try {
    //                 // Update the conversation in the database
    //                 // await updateConversation(conversation, message);
    //             } catch (error) {
    //                 // Handle error silently
    //             }

    //             return;
    //         }
    //         controller.enqueue(value);
    //     },
    // });
    const completion = await api
        .chat("deepseek-ai/DeepSeek-R1-Distill-Llama-70B")
        .doStream({
            inputFormat: "messages",
            mode: { type: "regular" },
            prompt: [{ role: "user", content: message }],
        });
    // When the completion is done, we can update the conversation in the database

    // Return the stream response
    return completion.stream;
};
