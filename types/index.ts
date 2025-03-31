import { ObjectId } from "mongodb";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};
export interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

export interface TutorModel {
    name: string;
    description: string;
    systemPrompt: string;
    id: string;
    subject: string;
}

export interface UncreatedChat {
    messages: Message[];
    id: string;
    owner: string | undefined;
    tutorId: TutorModel["id"];
    name: string | null;
}

export interface Chat extends UncreatedChat {
    _id: ObjectId;
    unread: boolean;
}
