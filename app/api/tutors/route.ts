import { NextRequest, NextResponse } from "next/server";

import { models } from "@/lib/utils/tutors";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    return NextResponse.json(
        models.map((m) => {
            return { id: m.id, name: m.name, description: m.description };
        }),
        {
            status: 200,
        },
    );
};
