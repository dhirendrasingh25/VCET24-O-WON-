'use client'

import React, { useEffect, useState, useRef } from 'react'
import { io, Socket } from "socket.io-client"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Message {
  sender: string;
  message: string;
  timestamp: Date;
}

export default function Page() {
  const { data: session, status } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Function to fetch messages from the backend
  const fetchMessages = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/getChats`);
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
  };

  // Initialize the socket connection
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
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [status, session]);

  // Fetch existing messages from the backend when the component mounts
  useEffect(() => {
    fetchMessages(); // Fetch existing chat messages
  }, []);

  // Auto-scroll to the bottom of the chat when messages are updated
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  // Handle form submission for sending a new message
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && session?.user?.name && socket) {
      const newMessage: Message = {
        sender: session.user.name,
        message: message.trim(),
        timestamp: new Date(),
      };
      socket.emit("message", newMessage);
      setMessage("");
    }
  };

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
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="h-full flex flex-col">
          <CardHeader className='border-b'>
            <CardTitle>Lets have Bachat Together ❤️</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <ScrollArea className="h-[calc(100vh-300px)]" ref={scrollAreaRef}>
              {messages.map((msg, i) => (
                <div key={i} className={`p-2 rounded-lg mb-2 ${msg.sender === session?.user?.name ? 'bg-blue-100 ml-auto' : 'bg-gray-100'} max-w-[70%]`}>
                  <p className="font-semibold">{msg.sender}</p>
                  <p>{msg.message}</p>
                  <p className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSubmit} className="w-full flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow"
              />
              <Button type="submit">Send</Button>
            </form>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
