"use client";

import { Button } from "../ui/button";
import { PiPiggyBankFill } from "react-icons/pi";
import Link from "next/link";
import { signIn } from "next-auth/react";

const Navbar = () => {
    return (
        <div className="md:px-10 px-2 border-b py-4 flex z-50 flex-row items-center justify-between sticky top-0">
            <div className="mx-md:mx-4 flex flex-row justify-between items-center space-x-2 text-3xl max-md:text-2xl">
                <div className="text-blue-500">
                    <PiPiggyBankFill />
                </div>
                <div className=" bg-gradient-to-r from-indigo-400 via-violet-600 to-cyan-400 bg-clip-text text-transparent font-semibold ">
                    BachatPro
                </div>
            </div>
            <div className="sm:flex flex-row w-full justify-end hidden space-x-6  mr-10">
                {[
                    { value: "Home", link: "#home" },
                    { value: "Market News", link: "#market" },
                    { value: "Take a Quiz", link: "#quiz" },
                    { value: "Testimonials", link: "#testimonials" },
                    { value: "About Us", link: "#about" },
                ].map((item, idx) => (
                    <div key={idx} className="font-semibold">
                        <Link href={item.link}>{item.value}</Link>
                    </div>
                ))}
            </div>
            <div>
                <Button
                    onClick={() =>
                        signIn("google", {
                            callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
                        })
                    }
                    className="px-6 font-medium"
                >
                    Login
                </Button>
            </div>
        </div>
    );
};

export default Navbar;
