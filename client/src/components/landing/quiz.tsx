"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getHomeQuizResponse } from "@/lib/fetchers";

const quizData = {
    quiz: [
        {
            question:
                "Do you currently track your monthly income and expenses?",
            type: "multiple_choice",
            options: ["Yes, regularly", "Sometimes", "No, not at all"],
        },
        {
            question: "How do you typically save money?",
            type: "multiple_choice",
            options: [
                "I have a dedicated savings account",
                "I save cash or set it aside informally",
                "I don't save regularly",
            ],
        },
        {
            question: "What do you do when you have unexpected expenses?",
            type: "multiple_choice",
            options: [
                "Use savings or an emergency fund",
                "Use a credit card or take out a loan",
                "I struggle to cover them",
            ],
        },
        {
            question: "Do you have a monthly budget plan?",
            type: "multiple_choice",
            options: ["Yes", "No", "I’m planning to start one"],
        },
        {
            question: "How do you manage debt, if you have any?",
            type: "multiple_choice",
            options: [
                "I make regular payments and keep track",
                "I pay when I can but it’s hard to manage",
                "I don’t have any debt",
            ],
        },
        {
            question: "What is your primary financial goal right now?",
            type: "multiple_choice",
            options: [
                "Building savings",
                "Paying off debt",
                "Managing daily expenses",
                "Investing for the future",
            ],
        },
    ],
};

interface QuizResponse {
    question: string;
    answer: string;
}

export default function FinancialQuiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [responses, setResponses] = useState<QuizResponse[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [jsonOutput, setJsonOutput] = useState<string>("");

    const handleAnswer = () => {
        if (selectedAnswer !== null) {
            const newResponse: QuizResponse = {
                question: quizData.quiz[currentQuestion].question,
                answer: selectedAnswer,
            };
            setResponses([...responses, newResponse]);

            if (currentQuestion < quizData.quiz.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
            } else {
                setQuizCompleted(true);
                const output = JSON.stringify(
                    { responses: [...responses, newResponse] },
                    null,
                    2,
                );
                setJsonOutput(output);
                submitQuiz(output);
            }
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setResponses([]);
        setQuizCompleted(false);
        setJsonOutput("");
    };
    const submitQuiz = async (output: string) => {
        console.log(output);
        try {
            const res = await getHomeQuizResponse(output);
            console.log("User data fetched:", res);
        } catch (error) {
            console.error("Failed to submit quiz:", error);
        }
    };

    if (quizCompleted) {
        return (
            <div className="flex justify-center items-center pt-20">
                <Card className="w-full max-w-[95%] sm:max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-xl sm:text-2xl text-center">
                            Quiz Completed!
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-sm sm:text-base">
                            Thank you for completing the financial quiz. Here
                            are your responses:
                        </p>
                        <ScrollArea className="h-[200px] sm:h-[300px] w-full rounded-md border p-2 sm:p-4">
                            <pre className="text-xs sm:text-sm">
                                {jsonOutput}
                            </pre>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button
                            onClick={resetQuiz}
                            className="w-full sm:w-auto"
                        >
                            Take Quiz Again
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    const currentQuizQuestion = quizData.quiz[currentQuestion];

    return (
        <div className="flex justify-center items-center pt-20">
            <Card className="w-full max-w-[95%] sm:max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl text-center">
                        Question {currentQuestion + 1} of {quizData.quiz.length}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-sm sm:text-base">
                        {currentQuizQuestion.question}
                    </p>
                    <RadioGroup
                        onValueChange={(value) => setSelectedAnswer(value)}
                        className="space-y-2"
                    >
                        {currentQuizQuestion.options.map((option, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2 rounded-lg border p-2 sm:p-3 hover:bg-accent"
                            >
                                <RadioGroupItem
                                    value={option}
                                    id={`option-${index}`}
                                />
                                <Label
                                    htmlFor={`option-${index}`}
                                    className="flex-grow text-sm sm:text-base cursor-pointer"
                                >
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button
                        onClick={handleAnswer}
                        disabled={selectedAnswer === null}
                        className="w-full sm:w-auto"
                    >
                        {currentQuestion === quizData.quiz.length - 1
                            ? "Finish"
                            : "Next"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
