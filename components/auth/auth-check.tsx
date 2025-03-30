"use client";

import { useSession } from "next-auth/react";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();

    console.log(session, status);

    if (status === 'loading') {
        return <>Loading...</>
    }

    if (status === 'authenticated') {
        return <>{children}</>
    } else {
        return <>
            <div className="flex items-center justify-center h-screen">
                <div className="bg-gray-800 text-white p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Not signed in</h2>
                    <p>Please sign in first to see this content.</p>
                </div>
            </div>
        </>
    }
}