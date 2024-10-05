"use client";

import React from "react";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, ExternalLink } from "lucide-react";
import { finMarket } from "@/lib/fetchers";
import Image from "next/image";

export default function MarketNews() {
    const [marketData, setMarketData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                const data = await finMarket();
                setMarketData(data);
            } catch (error) {
                console.error("Failed to fetch market data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMarketData();
    }, []);

    const formatDate = (timestamp:number) => {
        return new Date(timestamp * 1000).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">
                Latest Market News
            </h1>
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <Card key={index} className="flex flex-col h-full">
                            <CardHeader>
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-[200px] w-full mb-4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </CardContent>
                            <CardFooter className="mt-auto">
                                <Skeleton className="h-10 w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : marketData && marketData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {marketData?.map((item: any, index) => (
                        <Card key={index} className="flex flex-col h-full ">
                            <CardHeader className="h-[30%]">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg font-semibold mb-2">
                                        {item.headline}
                                    </CardTitle>
                                    <Badge variant="secondary">
                                        {item.category}
                                    </Badge>
                                </div>
                                <CardDescription className="flex items-center text-xs  text-muted-foreground">
                                    <Clock className="mr-1 h-4 w-4" />
                                    {formatDate(item.datetime)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-muted h-[200px] mb-4 rounded-md flex items-center justify-center">
                                    {/* <Newspaper className="h-12 w-12 text-muted-foreground" /> */}
                                    <Image
                                        src={item.image}
                                        alt="Market News"
                                        height={400}
                                        width={400}
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {item.summary}
                                </p>
                            </CardContent>
                            <CardFooter className="mt-auto">
                                <Button className="w-full" asChild>
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Read More{" "}
                                        <ExternalLink className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground">
                    No market news available at the moment.
                </p>
            )}
        </div>
    );
}
