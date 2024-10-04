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

const quizData = {
    quiz: [
        {
            question: "What is your current age group?",
            type: "multiple_choice",
            options: ["Under 25", "25-35", "36-45", "46-55", "Above 55"],
        },
        {
            question:
                "Do you have any dependents (e.g., children, elderly parents)?",
            type: "multiple_choice",
            options: ["Yes", "No"],
        },
        {
            question: "What is your primary financial goal?",
            type: "multiple_choice",
            options: [
                "Retirement planning",
                "Child's education",
                "Buying a home",
                "Emergency savings",
                "Wealth accumulation",
            ],
        },
        {
            question: "How would you describe your current health status?",
            type: "multiple_choice",
            options: ["Excellent", "Good", "Fair", "Poor"],
        },
        {
            question:
                "Do you foresee any significant expenses in the next 5 years?",
            type: "multiple_choice",
            options: ["Yes (e.g., medical emergencies, buying a house)", "No"],
        },
        {
            question: "What is your risk tolerance when it comes to investing?",
            type: "multiple_choice",
            options: [
                "Conservative (low risk, stable returns)",
                "Moderate (balanced risk and reward)",
                "Aggressive (high risk, higher potential returns)",
            ],
        },
        {
            question:
                "How long do you plan to keep your investment before you need to access it?",
            type: "multiple_choice",
            options: [
                "Less than 1 year",
                "1-3 years",
                "3-5 years",
                "More than 5 years",
            ],
        },
        {
            question: "Do you have any current investments or savings?",
            type: "multiple_choice",
            options: ["Yes", "No"],
        },
        {
            question:
                "How often would you like to review or adjust your investment plan?",
            type: "multiple_choice",
            options: [
                "Monthly",
                "Quarterly",
                "Annually",
                "Only when necessary",
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
