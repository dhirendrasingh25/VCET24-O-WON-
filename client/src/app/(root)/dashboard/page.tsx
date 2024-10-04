"use client";
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Dashboard() {
    const { data: session } = useSession();

    if(session) {
        return (
            <>
                Welcome {session.user?.name}
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }

    return (
        <>
            <p>Please sign in</p>
            <button onClick={() => signIn('google')}>Sign in</button>
        </>
    )
}