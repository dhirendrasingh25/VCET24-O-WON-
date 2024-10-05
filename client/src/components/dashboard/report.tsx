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
                    const response1 = await axios.get(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-transactions-weekly?email_id=${session.user.email}`,
                    );
                    const response2 = await axios.get(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-transactions-monthly?email_id=${session.user.email}`,
                    );
                    setWeekData(response1.data);
                    setMonthData(response2.data);
                } catch (error) {
                    console.log(error);
                }
            }
        }

        fetchData();
    }, [session]);

    const data = [
        { name: "Monday", value: 100 },
        { name: "Tuesday", value: 120 },
        { name: "Wednesday", value: 80 },
        { name: "Thursday", value: 150 },
        { name: "Friday", value: 90 },
        { name: "Saturday", value: 60 },
        { name: "Sunday", value: 200 },
    ];

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
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#8884d8"
                                />
                            </LineChart>
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
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#82ca9d"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
