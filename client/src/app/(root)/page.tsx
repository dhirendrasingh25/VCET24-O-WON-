import React from "react";
import Navbar from "@/components/landing-components/navbar";
import Footer from "@/components/landing-components/footer";
import { Button } from "@/components/ui/button";
import Quiz from "@/components/landing-components/quiz";

export default function Page() {
    return (
        <div className="h-full overflow-hidden">
            <Navbar />
            <main className="h-full">
                <div id="home" className="h-screen">
                    Home section for marketting
                </div>
                <div id="quiz" className="h-screen">
                    <Quiz />
                    <div className="flex items-center justify-center py-6">
                        <Button>Join Us Today !</Button>
                    </div>
                </div>
                <div id="testimonial" className="h-screen">
                    testimonial
                </div>
                <div id="about-us" className="h-screen">
                    about us
                </div>
            </main>
            <Footer />
        </div>
    );
}
