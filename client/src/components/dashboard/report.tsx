"use client";

import { Session } from "next-auth";
import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import axios from "axios";

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
                <Card>
                    <CardHeader className="px-7">
                        <CardTitle>Transactions</CardTitle>
                        <CardDescription>
                            Recent transactions from your bank.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            {weekData && weekData.length > 0 ? (
                                <LineChart data={weekData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#8884d8"
                                        strokeWidth={3}
                                    />
                                </LineChart>
                            ) : (
                                <p>No data available for the week.</p>
                            )}
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="month">
                <Card>
                    <CardHeader className="px-7">
                        <CardTitle>Transactions</CardTitle>
                        <CardDescription>
                            Recent transactions from your bank.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={260}>
                            {monthData && monthData.length > 0 ? (
                                <LineChart data={monthData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#82ca9d"
                                        strokeWidth={3}
                                    />
                                </LineChart>
                            ) : (
                                <p>No data available for the month.</p>
                            )}
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
