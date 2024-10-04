"use client";

import { useEffect } from "react";

import { signIn } from "next-auth/react";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import Quiz from "@/components/landing/quiz";
import Home from "@/components/landing/home";
import Testimonial from "@/components/landing/testimonials";
import AboutUs from "@/components/landing/about-us";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

const words = [
    {
        text: "Nivesh",
    },
    {
        text: "karo,",
    },
    {
        text: "sapne",
    },
    {
        text: "sajao!",
        className: "text-blue-500  dark:text-blue-500",
    },
];

export default function Page() {
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
        <div className="h-full bg-zinc-50 overflow-hidden">
            <Navbar />
            <main className="h-full">
                <div id="home" className="h-screen">
                    <Home />
                </div>
                
                <div id="quiz" className="h-screen">
                    <div className=" sm:m-10 m-6 border-dotted border-4 rounded-lg">
                        <div className="flex items-center justify-center">
                            <TypewriterEffectSmooth words={words} />
                        </div>
                        <Quiz />
                        <div className="flex items-center justify-center py-6">
                            <Button
                                onClick={() =>
                                    signIn("google", {
                                        callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
                                    })
                                }
                            >
                                Join Us Today !
                            </Button>
                        </div>
                    </div>
                </div>
                <div id="testimonial" className="h-full">
                    <Testimonial />
                </div>
                <div id="about-us" className="h-full">
                    <AboutUs />
                </div>
            </main>
            <Footer />
        </div>
    );
}
