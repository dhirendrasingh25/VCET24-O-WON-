import React from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

const testimonialsD = [
    {
        quote: "Budget Pro helped me plan my finances effectively without any hassle. I was able to save more than I expected, and their guidance was incredibly insightful. Highly recommended!",
        name: "Rahul Sharma",
        title: "Small Business Owner, Delhi",
    },
    {
        quote: "As a freelancer, managing my income was always a challenge. Budget Pro's user-friendly tools made it easy for me to track my expenses and save more efficiently. A game changer for me!",
        name: "Neha Iyer",
        title: "Freelance Graphic Designer, Bengaluru",
    },
    {
        quote: "I never thought budgeting could be this easy! Budget Pro’s platform is intuitive and provides all the right tools to keep my finances on track. It's perfect for anyone looking to manage their money better.",
        name: "Anil Mehta",
        title: "IT Professional, Mumbai",
    },
    {
        quote: "Thanks to Budget Pro, I was able to plan my expenses and save enough for my dream vacation. Their expert tips and personalized approach made all the difference.",
        name: "Pooja Patel",
        title: "Marketing Executive, Ahmedabad",
    },
    {
        quote: "I always struggled with my monthly budget, but Budget Pro helped me take control of my finances. Their service is reliable, efficient, and perfect for people with busy lifestyles.",
        name: "Ravi Prakash",
        title: "Chartered Accountant, Chennai",
    },
];

const Testimonials = () => {
    return (
        <>
            <div>
                <h2 className="max-w-7xl text-center pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
                   Kind words from our users
                </h2>
            </div>
            <div className="h-[30rem] rounded-md flex flex-col antialiased  dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
                <InfiniteMovingCards
                    items={testimonialsD}
                    direction="right"
                    speed="slow"
                />
            </div>
        </>
    );
};

export default Testimonials;
