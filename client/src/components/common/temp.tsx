"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Temp() {
    const { data: session } = useSession();
    const router = useRouter();

    console.log(session);

    if (session) {
        router.push("/dashboard");

        return null;

        // return (
        //     <>
        //         Welcome {session.user?.name}
        //         <button onClick={() => signOut()}>Sign out</button>
        //     </>
        // )
    }

    return (
        <>
            <p>Please sign in</p>
            <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
                Sign in
            </button>
        </>
    );
}
