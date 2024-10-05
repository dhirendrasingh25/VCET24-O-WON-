"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const quizData = {
  quiz: [
    {
      question: "Do you currently track your monthly income and expenses?",
      type: "multiple_choice",
      options: [
        { text: "Yes, regularly", points: 3 },
        { text: "Sometimes", points: 2 },
        { text: "No, not at all", points: 1 }
      ],
    },
    {
      question: "How do you typically save money?",
      type: "multiple_choice",
      options: [
        { text: "I have a dedicated savings account", points: 3 },
        { text: "I save cash or set it aside informally", points: 2 },
        { text: "I don't save regularly", points: 1 }
      ],
    },
    {
      question: "What do you do when you have unexpected expenses?",
      type: "multiple_choice",
      options: [
        { text: "Use savings or an emergency fund", points: 3 },
        { text: "Use a credit card or take out a loan", points: 2 },
        { text: "I struggle to cover them", points: 1 }
      ],
    },
    {
      question: "Do you have a monthly budget plan?",
      type: "multiple_choice",
      options: [
        { text: "Yes", points: 3 },
        { text: "No", points: 1 },
        { text: "I'm planning to start one", points: 2 }
      ],
    },
    {
      question: "How do you manage debt, if you have any?",
      type: "multiple_choice",
      options: [
        { text: "I make regular payments and keep track", points: 3 },
        { text: "I pay when I can but it's hard to manage", points: 2 },
        { text: "I don't have any debt", points: 3 }
      ],
    },
    {
      question: "What is your primary financial goal right now?",
      type: "multiple_choice",
      options: [
        { text: "Building savings", points: 3 },
        { text: "Paying off debt", points: 2 },
        { text: "Managing daily expenses", points: 1 },
        { text: "Investing for the future", points: 3 }
      ],
    },
  ],
};

interface QuizResponse {
  question: string;
  answer: string;
  points: number;
}

export default function FinancialQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const handleAnswer = () => {
    if (selectedAnswer !== null) {
      const currentQuizQuestion = quizData.quiz[currentQuestion];
      const selectedOption = currentQuizQuestion.options.find(option => option.text === selectedAnswer);
      const points = selectedOption ? selectedOption.points : 0;

      const newResponse: QuizResponse = {
        question: currentQuizQuestion.question,
        answer: selectedAnswer,
        points: points,
      };
      
      const newResponses = [...responses, newResponse];
      setResponses(newResponses);

      if (currentQuestion < quizData.quiz.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setQuizCompleted(true);
        const score = newResponses.reduce((sum, response) => sum + response.points, 0);
        setTotalScore(score);
        submitQuiz(JSON.stringify({ responses: newResponses }, null, 2));
      }
    }
  };



  const submitQuiz = async (output: string) => {
    console.log(output);
    try {
      // Assuming getHomeQuizResponse is defined elsewhere
      // const res = await getHomeQuizResponse(output);
      // console.log("User data fetched:", res);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }
  };

  const getFinancialHealthStatus = (score: number) => {
    const maxScore = quizData.quiz.length * 3;
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Fair";
    return "Needs Improvement";
  }

  const chartData = [
    { name: 'Your Score', score: totalScore },
    { name: 'Average Score', score: quizData.quiz.length * 2 }, // Assuming average is 2 points per question
    { name: 'Max Score', score: quizData.quiz.length * 3 },
  ];

  if (quizCompleted) {
    return (
      <div className="flex justify-center items-center pt-20">
        <Card className="w-full max-w-[95%] sm:max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl text-center">
              Financial Health Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Your Financial Health: {getFinancialHealthStatus(totalScore)}</h3>
              <p className="text-sm sm:text-base mb-4">
                Based on your responses, your financial health score is {totalScore} out of {quizData.quiz.length * 3}.
              </p>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert">
              <p className="font-bold">Take the Next Step in Your Financial Journey!</p>
              <p>Our platform offers personalized tools and advice to help you improve your financial health. Start your journey to financial freedom today!</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">

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
            Lets have a Financial Health Quiz ❤️
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
                  value={option.text}
                  id={`option-${index}`}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-grow text-sm sm:text-base cursor-pointer"
                >
                  {option.text}
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