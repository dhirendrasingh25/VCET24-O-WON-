'use client';
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import SessionWrapper from "@/components/core/session-wrapper";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    useEffect(() => {
        window.embeddedChatbotConfig = {
            chatbotId: process.env.NEXT_PUBLIC_CHATBOT_ID as string,
            domain: "www.chatbase.co",
        };

        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.defer = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);
    return (
        <SessionWrapper>
            <main className="flex min-h-screen w-full flex-col bg-white/40">
                <Sidebar />
                <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                    <Header />
                    {children}
                </div>
            </main>
            <Toaster />
        </SessionWrapper>
    );
}
