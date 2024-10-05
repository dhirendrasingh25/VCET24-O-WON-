"use client";

import axios from "axios";
import { useState } from "react";
import { Session } from "next-auth";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ITransaction } from "@/types";
import { rupeeSymbol } from "@/lib/utils";
import AddTransaction from "./add-transaction";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TableProps {
    weekly: ITransaction[];
    monthly: ITransaction[];
    yearly: ITransaction[];
    session: Session;
}

export default function DashboardTable({
    weekly = [],
    monthly = [],
    yearly = [],
    session,
}: TableProps) {
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);

    const handleFileOCR = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/ocr/bill`,
                {
                    params: {
                        email_id: session?.user?.email,
                    },
                },
            );

            console.log(response.data);

            toast({
                title: "Transaction added successfully",
                description: "Your transaction has been added successfully",
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const handleFileUpload = async (file: File) => {
        try {
            setIsUploading(true);

            const formData = new FormData();
            formData.append("recipt", file);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/ocr`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            if (response.status >= 200 && response.status < 300) {
                console.log("File uploaded successfully:", response.data);

                toast({
                    title: "File uploaded successfully",
                    description: "Your file has been uploaded successfully",
                });

                // const fileName = response.data.filePath;
                try {
                    await handleFileOCR();
                } catch (error) {
                    throw error;
                }
            } else {
                console.log("File upload failed:", response.data);

                toast({
                    title: "File upload failed",
                    description: "Your file has failed to upload",
                });
            }
        } catch (error) {
            console.error("Error uploading file:", error);

            toast({
                title: "Error uploading file",
                description: "Your file has failed to upload",
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Tabs defaultValue="week" className="lg:col-span-2">
            <div className="flex md:flex-row flex-col md:items-center items-start justify-between gap-2">
                <TabsList>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>

                <section className="flex items-start justify-between gap-2">
                    <AddTransaction session={session} />

                    <Button
                        variant="outline"
                        className="h-auto py-1"
                        onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = ".png, .jpg, .jpeg";
                            input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement)
                                    .files?.[0];
                                if (file) {
                                    handleFileUpload(file); // Call file selection
                                }
                            };
                            input.click();
                        }}
                    >
                        <div className="flex items-center gap-2">
                            {isUploading ? (
                                <section className="flex justify-center items-center relative">
                                    <div className="animate-spin h-5 w-5 border-2 border-t-transparent border-b-transparent border-blue-500 rounded-full"></div>
                                    <span className="ml-4 text-lg">
                                        Loading
                                    </span>
                                </section>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4" />
                                    <span>Upload A Image</span>
                                </>
                            )}
                        </div>
                    </Button>
                </section>
            </div>

            <TabsContent value="week">
                <Card>
                    <CardHeader className="px-7">
                        <CardTitle>Transactions</CardTitle>
                        <CardDescription>
                            Weekly transactions of your bank.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-auto">
                        <ScrollArea className="h-[250px] rounded-md border md:p-4">
                            <Table className="overflow-auto">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="table-cell">
                                            Category
                                        </TableHead>
                                        <TableHead className="table-cell">
                                            Description
                                        </TableHead>
                                        <TableHead className="table-cell">
                                            Date
                                        </TableHead>
                                        <TableHead className="table-cell">
                                            Amount
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="overflow-auto">
                                    {weekly.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="table-cell">
                                                <Badge
                                                    className="text-xs"
                                                    variant="secondary"
                                                >
                                                    {row.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="table-cell">
                                                {row.description}
                                            </TableCell>
                                            <TableCell className="table-cell">
                                                {new Date(
                                                    row.date,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="table-cell">
                                                {rupeeSymbol}
                                                {row.amount.toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="month">
                <Card>
                    <CardHeader className="px-7">
                        <CardTitle>Transactions</CardTitle>
                        <CardDescription>
                            Monthly transactions of your bank.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-auto">
                        <ScrollArea className="h-[250px] rounded-md border md:p-4">
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
                                    {monthly.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="hidden sm:table-cell">
                                                <Badge
                                                    className="text-xs"
                                                    variant="secondary"
                                                >
                                                    {row.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {row.description}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {new Date(
                                                    row.date,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {rupeeSymbol}
                                                {row.amount.toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="year">
                <Card>
                    <CardHeader className="px-7">
                        <CardTitle>Transactions</CardTitle>
                        <CardDescription>
                            Yearly transactions of your bank.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-auto">
                        <ScrollArea className="h-[250px] rounded-md border md:p-4">
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
                                    {yearly.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="hidden sm:table-cell">
                                                <Badge
                                                    className="text-xs"
                                                    variant="secondary"
                                                >
                                                    {row.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {row.description}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {new Date(
                                                    row.date,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {rupeeSymbol}
                                                {row.amount.toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
