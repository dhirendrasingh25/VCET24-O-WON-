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
import { ITransaction } from "@/types";
import { rupeeSymbol } from "@/lib/utils";
import AddTransaction from "./add-transaction";

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
    return (
        <Tabs defaultValue="week" className="lg:col-span-2">
            <div className="flex items-center justify-between">
                <TabsList>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>

                <AddTransaction session={session}/>
            </div>

            <TabsContent value="week">
                <Card>
                    <CardHeader className="px-7">
                        <CardTitle>Transactions</CardTitle>
                        <CardDescription>
                            Weekly transactions of your bank.
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
                                {weekly.map((row, index) => (
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
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
