"use client";

import { Session } from "next-auth";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import LinearChart from "./linear-chart";

interface ReportProps {
    session: Session;
}

export default function Report({ session }: ReportProps) {
    const [weekData, setWeekData] = useState([]);
    const [monthData, setMonthData] = useState([]);

    useEffect(() => {
        if (!session) return;

        async function fetchData() {
            if (session.user && session.user.email) {
                try {
                    const [response1, response2] = await Promise.all([
                        axios.get(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-transactions-weekly?email_id=${session.user.email}`,
                        ),
                        axios.get(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-transactions-monthly?email_id=${session.user.email}`,
                        ),
                    ]);

                    console.log(`response1: ${response1}`);
                    console.log(`response2: ${response2}`);
                    setWeekData(response1.data.data);
                    setMonthData(response2.data.data);
                } catch (error) {
                    console.log(error);
                }
            }
        }

        fetchData();
    }, [session]);

    console.log(weekData);

    return (
        <Tabs defaultValue="week">
            <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>

            <TabsContent value="week">
                <LinearChart
                    data={weekData}
                    title="Transactions"
                    description="Recent transactions from your bank."
                    xAxisKey="week"
                />
            </TabsContent>

            <TabsContent value="month">
                <LinearChart
                    data={monthData}
                    title="Transactions"
                    description="Recent transactions from your bank."
                    xAxisKey="month"
                />
            </TabsContent>
        </Tabs>
    );
}
