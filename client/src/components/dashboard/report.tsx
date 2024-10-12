"use client";

import axios from "axios";
import { Session } from "next-auth";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LinearChart from "./linear-chart";
import { toast } from "@/hooks/use-toast";

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
                    const [r1, r2] = await Promise.all([
                        axios.get(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-transactions-weekly?email_id=${session.user.email}`,
                        ),
                        axios.get(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-transactions-monthly?email_id=${session.user.email}`,
                        ),
                    ]);

                    setWeekData(r1.data.data);
                    setMonthData(r2.data.data);
                } catch (error) {
                    console.log(error);
                    toast({
                        title: "Error fetching graph data",
                        description: "Please try again later",
                        variant: "destructive",
                    });
                }
            }
        }

        fetchData();
    }, [session]);

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
                    description="Weekly transactions from your bank."
                />
            </TabsContent>

            <TabsContent value="month">
                <LinearChart
                    data={monthData}
                    title="Transactions"
                    description="Monthly transactions from your bank."
                    tickSize={6}
                />
            </TabsContent>
        </Tabs>
    );
}