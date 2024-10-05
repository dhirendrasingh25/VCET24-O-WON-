"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const courses = [
    {
        id: 1,
        title: "Mastering Personal Finance in India",
        author: "Rajesh Sharma",
        price: "₹4,999",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        badge: "Bestseller",
    },
    {
        id: 2,
        title: "Indian Stock Market Fundamentals",
        author: "Priya Patel",
        price: "₹3,499",
        image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        badge: "New",
    },
    {
        id: 3,
        title: "Tax Planning for Indian Professionals",
        author: "Amit Gupta",
        price: "₹2,999",
        image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        badge: "Popular",
    },
    {
        id: 4,
        title: "Mutual Funds Mastery: Indian Edition",
        author: "Sneha Reddy",
        price: "₹3,799",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        badge: "Advanced",
    },
];

const FinanceCourses = () => {
    return (
        <section className="py-12 bg-gradient-to-r ">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
                    Top Finance Courses in India
                </h2>
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {courses.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full flex flex-col">
                                <CardHeader className="p-0 relative">
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-48 object-cover rounded-t-lg"
                                    />
                                    <Badge className="absolute top-2 right-2 bg-black">
                                        {course.badge}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="flex-grow p-4">
                                    <CardTitle className="text-lg font-semibold mb-2">
                                        {course.title}
                                    </CardTitle>
                                    <div className="flex items-center mb-2">
                                        <Avatar className="h-6 w-6 mr-2">
                                            <AvatarImage
                                                src={`https://api.dicebear.com/6.x/initials/svg?seed=${course.author}`}
                                            />
                                            <AvatarFallback>
                                                {course.author[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-gray-600">
                                            {course.author}
                                        </span>
                                    </div>
                                    <p className="text-xl font-bold text-black">
                                        {course.price}
                                    </p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <Link href="#quiz">
                                        <Button className="w-full bg-black  text-white">
                                            Enroll Now
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
            <motion.div
                className="mt-12 bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">
                    Why Choose Our Courses?
                </h3>
                <motion.ul className="space-y-2">
                    {[
                        "Expert Indian instructors with years of experience",
                        "Tailored content for the Indian financial landscape",
                        "Practical examples and case studies from Indian markets",
                        "Flexible learning with lifetime access",
                    ].map((item, index) => (
                        <motion.li
                            key={index}
                            className="flex items-center text-gray-700"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1 + 0.7,
                            }}
                        >
                            <svg
                                className="h-5 w-5 mr-2 text-green-500"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M5 13l4 4L19 7"></path>
                            </svg>
                            {item}
                        </motion.li>
                    ))}
                </motion.ul>
            </motion.div>
        </section>
    );
};

export default FinanceCourses;
