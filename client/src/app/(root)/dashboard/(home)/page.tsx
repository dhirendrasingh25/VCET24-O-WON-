"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";

import { rupeeSymbol } from "@/lib/utils";
import { ITransaction, MarketNews, Tips } from "@/types";
import DashboardTable from "@/components/dashboard/table";
import Report from "@/components/dashboard/report";

type IDailyTips = {
    tips: Tips[];
    news: MarketNews[];
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
    const [tips, setTips] = useState<IDailyTips>({ tips: [], news: [] });
    const router = useRouter();

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
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-all-transactions-summary?email_id=${session?.user?.email}`,
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

                console.log(tipsNewsResponse.data);
                setTips({
                    tips: tipsNewsResponse.data.investmentTips.plans,
                    news: tipsNewsResponse.data.marketNews,
                });

                setWeeklyExpense(weeklyExpenseResponse.data.weeklyExpenses);
                setMonthlyExpense(monthlyExpenseResponse.data.monthlyExpenses);

                setWeekly(transactionsResponse.data.summary.weekly);
                setMonthly(transactionsResponse.data.summary.monthly);
                setYearly(transactionsResponse.data.summary.yearly);
            } catch (error) {
                console.log(error);
                setTips({ tips: [], news: [] });
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

    if (!session) {
        return null;
    }

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                    <Card
                        className="sm:col-span-2"
                        x-chunk="dashboard-05-chunk-0"
                    >
                        <CardHeader className="pb-3">
                            <CardTitle>Connect Your Bank</CardTitle>
                            <CardDescription className="text-balance max-w-lg leading-relaxed">
                                Seamlessly connect your bank account for quick
                                and easy transaction management
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button className="bg-custom-blue hover:bg-blue-600 transition-all">
                                Connect Bank Account
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card x-chunk="dashboard-05-chunk-1">
                        <CardHeader className="pb-2">
                            <CardDescription>This Week</CardDescription>
                            <CardTitle className="text-4xl">
                                {rupeeSymbol}
                                {weeklyExpense.toLocaleString()}
                            </CardTitle>
                        </CardHeader>
                        {/* <CardContent>
                            <div className="text-xs text-muted-foreground">
                                +25% from last week
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Progress
                                value={25}
                                aria-label="25% increase"
                                color="bg-custom-blue"
                            />
                        </CardFooter> */}
                    </Card>
                    <Card x-chunk="dashboard-05-chunk-2">
                        <CardHeader className="pb-2">
                            <CardDescription>This Month</CardDescription>
                            <CardTitle className="text-4xl">
                                {rupeeSymbol}
                                {monthlyExpense.toLocaleString()}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>
                
                <div className="flex flex-row gap-4">

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
