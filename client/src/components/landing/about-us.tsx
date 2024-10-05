"use client";
import React from "react";

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
                        SignUp for blazing-fast cutting-edge state of the art
                        BachatPro wrapper today!
                    </h2>
                    <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-white">
                        Our tool helps advisors offer dynamic, real-time
                        investment strategies that adapt to life&apos;s changes,
                        ensuring clients are always on the best financial path.
                    </p>
                </div>
            </WobbleCard>
        </div>
    );
}
