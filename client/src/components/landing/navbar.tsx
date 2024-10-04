"use client";

import { Button } from "../ui/button";
import bachatProLogo from "../../public/bachat.svg";
import Image from "next/image";

import { signIn } from "next-auth/react";

const Navbar = () => {
    return (
        <div className="px-10 py-4 sticky top-0 flex  flex-row items-center  justify-between">
            <div className="mx-2 sm:mx-4">
                <Image
                    src={bachatProLogo}
                    alt="BachatPro Logo"
                    className="h-full w-full"
                />
            </div>
            <div className="sm:flex flex-row w-full justify-end hidden space-x-6  mr-10">
                {["Home", "Take a Quiz", "Testimonials", "About Us"].map(
                    (item, idx) => (
                        <div key={idx}>{item}</div>
                    ),
                )}
            </div>
            <div>
                <Button
                    onClick={() =>
                        signIn("google", {
                            callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
                        })
                    }
                    className="px-6"
                >
                    Login
                </Button>
            </div>
        </div>
    );
};

export default Navbar;
