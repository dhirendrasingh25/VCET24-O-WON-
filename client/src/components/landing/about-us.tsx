"use client";
import React from "react";

import { AnimatePresence, motion } from "framer-motion";


export default function AboutUs() {
    return (
        <>
            <div>
                <h2 className="max-w-7xl pb-10 text-center pl-4  mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
                    Know About Us !
                </h2>
            </div>
            <WobbleCardDemo />
        </>
    );
}
import { WobbleCard } from "../ui/wobble-card";

export function WobbleCardDemo() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4  mx-4 max-w-7xl sm:m-auto w-full pb-8">
            <WobbleCard
                containerClassName="col-span-1  border-2 lg:col-span-2 h-full bg-zinc-100  min-h-[400px] lg:min-h-[300px]"
                className=""
            >
                <div className="max-w-xs ">
                    <h2 className="text-left text-black text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] ">
                        Who are we ?
                    </h2>
                    <p className="mt-4 text-left text-black  text-base/6 ">
                        We develop an interactive tool for financial advisors to
                        create personalized, adaptive investment plans,
                        considering factors like age, health, lifestyle,
                        emergencies, and market trends.
                    </p>
                </div>
                {/* <Image
          src="/linear.webp"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
        /> */}
            </WobbleCard>
            <WobbleCard containerClassName="col-span-1 bg-zinc-100 min-h-[300px] border-2">
                <h2 className="max-w-80  text-left text-balance text-base md:text-xl  lg:text-3xl font-semibold tracking-[-0.015em] text-black">
                    What do we do?
                </h2>
                <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-black">
                    We are a team focused on integrating behavioral finance and
                    advanced analytics to revolutionize how financial advisors
                    assess and manage client portfolios.
                </p>
            </WobbleCard>
            <WobbleCard containerClassName="col-span-1  border-2 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
                <div className="max-w-sm">
                    <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em]  text-zinc-50">
                        Signup for blazing-fast cutting-edge state of the art
                        BachatPro wrapper today!
                    </h2>
                    <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-white">
                        Our tool helps advisors offer dynamic, real-time
                        investment strategies that adapt to life's changes,
                        ensuring clients are always on the best financial path.
                    </p>
                </div>
                {/* <Image
          src="/linear.webp"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
        /> */}
            </WobbleCard>
        </div>
    );
}

const Card = ({
    title,
    icon,
    children,
}: {
    title: string;
    icon: React.ReactNode;
    children?: React.ReactNode;
}) => {
    const [hovered, setHovered] = React.useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2]  max-w-sm w-full mx-auto p-4 relative h-[30rem] relative"
        >
            <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full w-full absolute inset-0"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-20">
                <div className="text-center group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200 w-full  mx-auto flex items-center justify-center">
                    {icon}
                </div>
                <h2 className="dark:text-white text-xl opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-black mt-4  font-bold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200">
                    {title}
                </h2>
            </div>
        </div>
    );
};

const AceternityIcon = ({ message }: { message: string }) => {
    return (
        <div className="flex flex-col  items-center  gap-2">
            <svg
                width="66"
                height="65"
                viewBox="0 0 66 65"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-500 dark:text-white group-hover/canvas-card:text-white "
            >
                <path
                    d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
                    stroke="currentColor"
                    strokeWidth="15"
                    strokeMiterlimit="3.86874"
                    strokeLinecap="round"
                    style={{ mixBlendMode: "darken" }}
                />
            </svg>
            <div className=" font-semibold text-xl text-blue-500">
                {message}
            </div>
        </div>
    );
};

export const Icon = ({ className, ...rest }: any) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={className}
            {...rest}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m6-6H6"
            />
        </svg>
    );
};
