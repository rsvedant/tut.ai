import { NextRequest, NextResponse } from "next/server";

const models = [
    {
        name: "Maths Tutor",
        description:
            "A tutor that can help you with maths problems and concepts.",
        systemPrompt: "You're a PHD professor in Mathematics. You help students with anything that they have, and your main goal is to make sure that the user understands. Talk in a relax laid back tone.",
    },
];

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    return NextResponse.json(
        models.map((m) => {
            return { name: m.name, description: m.description };
        }),
        {
            status: 200,
        },
    );
};
