"use client";

import { useEffect } from "react";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import Quiz from "@/components/landing/quiz";
import Home from "@/components/landing/home";
import Testimonial from "@/components/landing/testimonials";
import AboutUs from "@/components/landing/about-us";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import JoinUsButton from "@/components/landing/joinUsbutton";
import Market from "@/components/landing/market";
import FinanceCourses from "@/components/landing/cources";

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
                <div id="market" className="h-full">
                    <Market />
                </div>
                <div id="quiz" className="h-full">
                    <div className=" sm:m-10 m-6 border-dotted border-4 rounded-2xl bg-zinc-100">
                        <div className="flex items-center justify-center">
                            <TypewriterEffect
                                words={words}
                                className="max-md:text-xl mt-3"
                            />
                        </div>
                        <Quiz />
                        <div className="flex justify-center items-center p-10">
                            <JoinUsButton />
                        </div>
                    </div>
                </div>
                <div id="about-us" className="h-full">
                    <AboutUs />
                </div>
                <div id="courses" className="h-full">
                    <FinanceCourses />
                </div>
                <div id="testimonial" className="h-full">
                    <Testimonial />
                </div>
            </main>
            <Footer />
        </div>
    );
}
