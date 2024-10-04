"use client";
import React from "react";
import { FaInternetExplorer } from "react-icons/fa6";
import { Button } from "../ui/button";
import { MdOutlineInstallMobile } from "react-icons/md";
import { signIn } from "next-auth/react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function joinUsButton() {
    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <button className="p-[3px] relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                        <div className="px-8 py-2 text-lg  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                            Join Us Now !
                        </div>
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Continue with your feasibility
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            <div className="h-full my-3 mb-8 w-full flex sm:flex-row flex-col space-y-3 sm:space-y-1 space-x-0 sm:space-x-3">
                                <Button
                                    className="p-6 font-semibold "
                                    onClick={() =>
                                        signIn("google", {
                                            callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
                                        })
                                    }
                                >
                                    <FaInternetExplorer className="text-3xl mx-3" />
                                    Continue with Web
                                </Button>

                                <Button className="p-6 font-semibold ">
                                    <MdOutlineInstallMobile className="text-3xl mx-3" />{" "}
                                    Download App
                                </Button>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
