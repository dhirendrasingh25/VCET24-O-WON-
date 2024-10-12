"use client";

import { useEffect } from "react";

export default function Chatbot() {
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

    return null;
}
