"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { File } from "lucide-react";
import { rupeeSymbol } from "@/lib/utils";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
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
                                {rupeeSymbol}1,329
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
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
                        </CardFooter>
                    </Card>
                    <Card x-chunk="dashboard-05-chunk-2">
                        <CardHeader className="pb-2">
                            <CardDescription>This Month</CardDescription>
                            <CardTitle className="text-4xl">
                                {rupeeSymbol}5,329
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-muted-foreground">
                                +10% from last month
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Progress
                                value={12}
                                aria-label="12% increase"
                                color="bg-custom-blue"
                            />
                        </CardFooter>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-3">
                    <Tabs defaultValue="week" className="lg:col-span-2">
                        <div className="flex items-center">
                            <TabsList>
                                <TabsTrigger value="week">Week</TabsTrigger>
                                <TabsTrigger value="month">Month</TabsTrigger>
                                <TabsTrigger value="year">Year</TabsTrigger>
                            </TabsList>
                            <div className="ml-auto flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 gap-1 text-sm"
                                >
                                    <File className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only">
                                        Export
                                    </span>
                                </Button>
                            </div>
                        </div>

                        <TabsContent value="week">
                            <Card>
                                <CardHeader className="px-7">
                                    <CardTitle>Transactions</CardTitle>
                                    <CardDescription>
                                        Recent transactions from your bank.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="hidden sm:table-cell">
                                                    Category
                                                </TableHead>
                                                <TableHead className="hidden sm:table-cell">
                                                    Description
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Date
                                                </TableHead>
                                                <TableHead className="hidden sm:table-cell">
                                                    Amount
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="hidden sm:table-cell">
                                                <Badge
                                                        className="text-xs"
                                                        variant="secondary"
                                                    >
                                                        Fulfilled
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    Sale
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    2023-06-23
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {rupeeSymbol}250.00
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </main>
    );
}
