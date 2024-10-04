"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

type Expense = {
    description: string;
    amount: number;
};

type FormData = {
    age: number;
    ailments: string;
    lifestyle: string;
    dependents: number;
    dependantDescription: string;
    goal: string;
    expenses: Expense[];
    currentInvestments: string[];
    duration: string;
    review: string;
};

export default function Component() {
    const [isLoading, setIsLoading] = useState(true);
    const { data: session, status } = useSession();
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        age: 18,
        ailments: "",
        lifestyle: "",
        dependents: 0,
        dependantDescription: "",
        goal: "",
        expenses: [{ description: "", amount: 0 }],
        currentInvestments: [""],
        duration: "",
        review: "",
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNumberInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({ ...prev, duration: value }));
    };

    const handleExpenseChange = (
        index: number,
        field: "description" | "amount",
        value: string,
    ) => {
        setFormData((prev) => {
            const newExpenses = [...prev.expenses];
            if (field === "amount") {
                newExpenses[index] = {
                    ...newExpenses[index],
                    [field]: parseFloat(value) || 0,
                };
            } else {
                newExpenses[index] = { ...newExpenses[index], [field]: value };
            }
            return { ...prev, expenses: newExpenses };
        });
    };

    const addExpense = () => {
        setFormData((prev) => ({
            ...prev,
            expenses: [...prev.expenses, { description: "", amount: 0 }],
        }));
    };

    const removeExpense = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            expenses: prev.expenses.filter((_, i) => i !== index),
        }));
    };

    const handleInvestmentChange = (index: number, value: string) => {
        setFormData((prev) => {
            const newInvestments = [...prev.currentInvestments];
            newInvestments[index] = value;
            return { ...prev, currentInvestments: newInvestments };
        });
    };

    const addInvestment = () => {
        setFormData((prev) => ({
            ...prev,
            currentInvestments: [...prev.currentInvestments, ""],
        }));
    };

    const removeInvestment = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            currentInvestments: prev.currentInvestments.filter(
                (_, i) => i !== index,
            ),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/received`,
                {
                    email_id: session?.user?.email,
                    formData,
                },
            );

            if (response.status === 200) {
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Failed to submit the form:", error);
        }
    };

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

    return (
        <Dialog open={true}>
            <DialogTitle>Complete your profile</DialogTitle>
            <DialogContent
                className="max-w-3xl max-h-[90vh]"
                blur={true}
                closeButton={false}
            >
                <ScrollArea className="max-h-[70vh] px-2">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleNumberInputChange}
                                min={18}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="ailments">
                                Ailments (For example, Diabetes)
                            </Label>
                            <Input
                                id="ailments"
                                name="ailments"
                                value={formData.ailments}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="lifestyle">
                                Lifestyle (Explain how much money you spend on
                                yourself)
                            </Label>
                            <Input
                                id="lifestyle"
                                name="lifestyle"
                                value={formData.lifestyle}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="dependents">
                                Number of Dependents (People who are dependent
                                on you)
                            </Label>
                            <Input
                                id="dependents"
                                name="dependents"
                                type="number"
                                value={formData.dependents}
                                onChange={handleNumberInputChange}
                                min={0}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="dependantDescription">
                                Dependant Description (Optional)
                            </Label>
                            <Textarea
                                id="dependantDescription"
                                name="dependantDescription"
                                value={formData.dependantDescription}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="goal">Goal</Label>
                            <Input
                                id="goal"
                                name="goal"
                                value={formData.goal}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label>Expenses</Label>
                            {formData.expenses.map((expense, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-2 mt-2"
                                >
                                    <Input
                                        placeholder="Amount"
                                        value={expense.description}
                                        onChange={(e) =>
                                            handleExpenseChange(
                                                index,
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Amount"
                                        value={expense.amount}
                                        onChange={(e) =>
                                            handleExpenseChange(
                                                index,
                                                "amount",
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => removeExpense(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                onClick={addExpense}
                                className="mt-2"
                            >
                                Add Expense
                            </Button>
                        </div>
                        <div>
                            <Label>Current Investments</Label>
                            {formData.currentInvestments.map(
                                (investment, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-2 mt-2"
                                    >
                                        <Input
                                            placeholder="Investment"
                                            value={investment}
                                            onChange={(e) =>
                                                handleInvestmentChange(
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() =>
                                                removeInvestment(index)
                                            }
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ),
                            )}
                            <Button
                                type="button"
                                onClick={addInvestment}
                                className="mt-2"
                            >
                                Add Investment
                            </Button>
                        </div>
                        <div>
                            <Label htmlFor="duration">Duration</Label>
                            <Select
                                onValueChange={handleSelectChange}
                                value={formData.duration}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="short">
                                        Short term
                                    </SelectItem>
                                    <SelectItem value="medium">
                                        Medium term
                                    </SelectItem>
                                    <SelectItem value="long">
                                        Long term
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="review">Review</Label>
                            <Textarea
                                id="review"
                                name="review"
                                value={formData.review}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <Button type="submit">Submit</Button>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
