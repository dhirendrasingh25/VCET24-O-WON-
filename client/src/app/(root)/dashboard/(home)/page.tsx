"use client";

import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

import { rupeeSymbol } from "@/lib/utils";
import { ITransaction, MarketNews, Tips } from "@/types";
import DashboardTable from "@/components/dashboard/table";
import Report from "@/components/dashboard/report";
import PlaidLink from "@/components/core/plaid-link";

import PlaceholderImage from "@/public/placeholder.png";
import { User } from "next-auth";

type IDailyTips = {
    tips: Tips;
    news: MarketNews;
};

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    // transactions
    const [weekly, setWeekly] = useState<ITransaction[]>([]);
    const [monthly, setMonthly] = useState<ITransaction[]>([]);
    const [yearly, setYearly] = useState<ITransaction[]>([]);

    const [weeklyExpense, setWeeklyExpense] = useState<number>(0);
    const [monthlyExpense, setMonthlyExpense] = useState<number>(0);
    const [tipsAndNews, setTipsAndNews] = useState<IDailyTips>({
        tips: { name: "", desc: "" },
        news: { category: "", image: "", headline: "", url: "" },
    });
    const router = useRouter();

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

    useEffect(() => {
        if (!session) return;
        async function checkProfile() {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check`,
                    {
                        params: {
                            email_id: session?.user?.email,
                            image: session?.user?.image,
                            name: session?.user?.name,
                        },
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );

                const data = response.data;

                if (data.user.complete_profile === false) {
                    router.push("/dashboard/complete-profile");
                }
            } catch (error) {
                console.log(`Error checking profile: ${error}`);
            }
        }
        checkProfile();
    }, [router, session]);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        } else if (status === "authenticated") {
            setIsLoading(false);
        }
    }, [status, router]);

    useEffect(() => {
        if (!session) return;

        async function callApiCalls() {
            const urls = [
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/tips-news`,
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getall-transactions-summary?email_id=${session?.user?.email}`,
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/expense/weekly/${session?.user?.email}`,
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/expense/monthly/${session?.user?.email}`,
            ];

            try {
                const [
                    tipsNewsResponse,
                    transactionsResponse,
                    weeklyExpenseResponse,
                    monthlyExpenseResponse,
                ] = await Promise.all(urls.map((url) => axios.get(url)));

                setTipsAndNews({
                    tips: tipsNewsResponse.data.investmentTips,
                    news: tipsNewsResponse.data.marketNews,
                });

                setWeeklyExpense(weeklyExpenseResponse.data.weeklyExpenses);
                setMonthlyExpense(monthlyExpenseResponse.data.monthlyExpenses);

                setWeekly(transactionsResponse.data.summary.weekly);
                setMonthly(transactionsResponse.data.summary.monthly);
                setYearly(transactionsResponse.data.summary.yearly);
            } catch (error) {
                console.log(error);
                setTipsAndNews({
                    tips: { name: "", desc: "" },
                    news: { category: "", image: "", headline: "", url: "" },
                });
                setWeeklyExpense(0);
                setMonthlyExpense(0);
                setWeekly([]);
                setMonthly([]);
                setYearly([]);
            }
        }

        callApiCalls();
    }, [session]);

    if (isLoading) {
        return (
            <section className="flex justify-center items-center h-screen">
                <div className="animate-spin h-5 w-5 border-4 border-t-transparent border-b-transparent border-blue-500 rounded-full"></div>
                <span className="ml-4 text-lg">Loading</span>
            </section>
        );
    }

    if (!session || !session.user) {
        return null;
    }

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                    <Card className="sm:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle>Connect Your Bank</CardTitle>
                            <CardDescription className="text-balance max-w-lg leading-relaxed">
                                Seamlessly connect your bank account for quick
                                and easy transaction management
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            {/* <Button className="bg-custom-blue hover:bg-blue-600 transition-all">
                                Connect Bank Account
                            </Button> */}
                            <PlaidLink user={session.user as User} />
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>This Week</CardDescription>
                            <CardTitle className="text-4xl">
                                {rupeeSymbol}
                                {weeklyExpense.toLocaleString()}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>This Month</CardDescription>
                            <CardTitle className="text-4xl">
                                {rupeeSymbol}
                                {monthlyExpense.toLocaleString()}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <div className="flex md:flex-row gap-4 flex-col">
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle>Tip of the Day</CardTitle>
                            <CardDescription>
                                {tipsAndNews.tips.name}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="font-medium">
                            <p>{tipsAndNews.tips.desc}</p>
                        </CardContent>
                    </Card>

                    <Card className="flex-1">
                        <CardContent className="p-4 h-full">
                            <div className="flex flex-col h-full">
                                <CardTitle className="text-lg capitalize mb-2">
                                    {tipsAndNews.news.category}
                                </CardTitle>
                                <div className="flex flex-1 gap-4">
                                    <div className="w-1/3 relative">
                                        <Image
                                            src={
                                                tipsAndNews.news.image ||
                                                PlaceholderImage
                                            }
                                            alt={tipsAndNews.news.headline}
                                            width={100}
                                            height={50}
                                            className="rounded object-fill h-full w-full"
                                        />
                                    </div>
                                    <div className="w-2/3 flex flex-col justify-between">
                                        <CardDescription className="text-base">
                                            {tipsAndNews.news.headline}
                                        </CardDescription>
                                        <a
                                            href={tipsAndNews.news.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline mt-2"
                                        >
                                            Read More
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-4">
                    <DashboardTable
                        weekly={weekly}
                        monthly={monthly}
                        yearly={yearly}
                        session={session}
                    />

                    <Report session={session} />
                </div>
            </div>
        </main>
    );
}
