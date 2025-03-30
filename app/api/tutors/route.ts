import { NextRequest, NextResponse } from "next/server";

const models = [
    {
        name: "Maths Tutor",
        description:
            "A tutor that can help you with maths problems and concepts.",
    },
];

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    return NextResponse.json(models, {
        status: 200,
    });
};

// 