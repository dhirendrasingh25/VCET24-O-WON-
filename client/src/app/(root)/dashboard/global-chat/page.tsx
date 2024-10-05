"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { signIn } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Message {
    sender: string;
    message: string;
    timestamp: Date;
    avatar: string;
}

export default function Page() {
    const { data: session, status } = useSession();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isConnected, setIsConnected] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop =
                scrollAreaRef.current.scrollHeight;
        }
    }, []);

    const fetchMessages = useCallback(async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/getChats`,
            );
            const data = await res.json();
            if (data.success) {
                setMessages(data.chats);
                scrollToBottom();
            } else {
                console.error("Failed to load messages");
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }, [scrollToBottom]);

    useEffect(() => {
        if (status === "authenticated" && session?.user?.name) {
            const newSocket = io(SOCKET_URL);
            setSocket(newSocket);

            newSocket.on("connect", () => {
                console.log("Connected", newSocket.id);
                setIsConnected(true);
            });

            newSocket.on("recieve-message", (data: Message) => {
                setMessages((prevMessages) => [...prevMessages, data]);
                scrollToBottom();
            });

            return () => {
                newSocket.disconnect();
            };
        }
    }, [status, session, scrollToBottom]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && session?.user?.name && socket) {
            const newMessage: Message = {
                sender: session.user.name,
                message: message.trim(),
                timestamp: new Date(),
                avatar:
                    session.user.image || "/placeholder.svg?height=40&width=40",
            };
            socket.emit("message", newMessage);
            setMessage("");
            scrollToBottom();
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Loading...</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="w-full h-12" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Access Denied</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Please sign in to access the chat.</p>
                        <Button
                            onClick={() =>
                                signIn("google", {
                                    callbackUrl: "/dashboard/global-chat",
                                })
                            }
                        >
                            Sign In
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Community Forum
                    </h1>
                </div>
            </header>
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="h-full flex flex-col">
                    <CardHeader className="border-b">
                        <CardTitle>
                            Let&apos;s have Bachat Together ❤️
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow p-0">
                        <ScrollArea
                            className="h-[calc(100vh-300px)] p-4"
                            ref={scrollAreaRef}
                        >
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex items-start mb-4",
                                        msg.sender === session?.user?.name
                                            ? "justify-end"
                                            : "justify-start",
                                    )}
                                >
                                    {msg.sender !== session?.user?.name && (
                                        <Image
                                            height={40}
                                            width={40}
                                            src={msg.avatar}
                                            alt={msg.sender}
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                    )}
                                    <div
                                        className={cn(
                                            "p-3 rounded-lg max-w-[70%]",
                                            msg.sender === session?.user?.name
                                                ? "bg-green-500 text-white"
                                                : "bg-white",
                                        )}
                                    >
                                        {msg.sender !== session?.user?.name && (
                                            <p className="font-semibold text-sm mb-1">
                                                {msg.sender}
                                            </p>
                                        )}
                                        <p className="text-sm">{msg.message}</p>
                                        <p className="text-xs text-right mt-1 opacity-70">
                                            {new Date(
                                                msg.timestamp,
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    {msg.sender === session?.user?.name && (
                                        <Image
                                            height={40}
                                            width={40}
                                            src={msg.avatar}
                                            alt={msg.sender}
                                            className="w-10 h-10 rounded-full ml-3"
                                        />
                                    )}
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>
                    <CardFooter>
                        <form
                            onSubmit={handleSubmit}
                            className="w-full flex space-x-2 items-center"
                        >
                            <Input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-grow"
                            />
                            <Button type="submit" size="icon">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}