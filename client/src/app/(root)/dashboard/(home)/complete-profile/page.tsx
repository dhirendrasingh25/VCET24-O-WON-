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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Investment = {
    investType: string;
    amount: number;
};

type FormData = {
    age: number;
    occupation: string;
    ailments: number;
    dependents: number;
    dependantDescription: string;
    goal: string;
    mandatoryExpenses: number;
    currentInvestments: Investment[];
    duration: string;
    loans: number;
    emi: number;
};

export default function Component() {
    const [isLoading, setIsLoading] = useState(true);
    const { data: session, status } = useSession();
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        age: 18,
        occupation: "",
        ailments: 0,
        dependents: 0,
        dependantDescription: "",
        goal: "",
        mandatoryExpenses: 0,
        currentInvestments: [],
        duration: "",
        loans: 0,
        emi: 0,
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

    const handleInvestmentChange = (
        index: number,
        field: keyof Investment,
        value: string,
    ) => {
        setFormData((prev) => {
            const newInvestments = [...prev.currentInvestments];
            if (field === "amount") {
                newInvestments[index] = {
                    ...newInvestments[index],
                    [field]: parseFloat(value) || 0,
                };
            } else {
                newInvestments[index] = {
                    ...newInvestments[index],
                    [field]: value,
                };
            }
            return { ...prev, currentInvestments: newInvestments };
        });
    };

    const addInvestment = () => {
        setFormData((prev) => ({
            ...prev,
            currentInvestments: [
                ...prev.currentInvestments,
                { investType: "", amount: 0 },
            ],
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
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/complete`,
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
                <div className="animate-spin h-5 w-5 border-4 border-t-transparent border-b-transparent border-[#2AABEE] rounded-full"></div>
                <span className="ml-4 text-lg">Loading</span>
            </section>
        );
    }

    return (
        <Dialog open={true}>
            <DialogTitle>Complete your profile</DialogTitle>
            <DialogContent
                className="max-w-4xl max-h-[90vh] mx-4 sm:mx-0"
                blur={true}
                closeButton={false}
            >
                <ScrollArea className="max-h-[80vh] px-2">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 p-4">
                                <div>
                                    <Label htmlFor="age">Age</Label>
                                    <Input
                                        id="age"
                                        name="age"
                                        type="text"
                                        value={formData.age}
                                        onChange={handleNumberInputChange}
                                        min={18}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="occupation">
                                        Occupation
                                    </Label>
                                    <Input
                                        id="occupation"
                                        name="occupation"
                                        type="text"
                                        value={formData.occupation}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="ailments">
                                        Annual Health Expenses (INR)
                                    </Label>
                                    <Input
                                        id="ailments"
                                        name="ailments"
                                        type="text"
                                        value={formData.ailments}
                                        onChange={handleNumberInputChange}
                                        min={0}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="dependents">
                                        Number of Dependents
                                    </Label>
                                    <Input
                                        id="dependents"
                                        name="dependents"
                                        type="text"
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
                                        placeholder="e.g., 2 children, 1 elderly parent"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Financial Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 p-4">
                                <div>
                                    <Label htmlFor="mandatoryExpenses">
                                        Monthly Mandatory Expenses (INR)
                                    </Label>
                                    <Input
                                        id="mandatoryExpenses"
                                        name="mandatoryExpenses"
                                        type="text"
                                        value={formData.mandatoryExpenses}
                                        onChange={handleNumberInputChange}
                                        min={0}
                                        required
                                    />
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
                                                    placeholder="Investment type"
                                                    value={
                                                        investment.investType
                                                    }
                                                    onChange={(e) =>
                                                        handleInvestmentChange(
                                                            index,
                                                            "investType",
                                                            e.target.value,
                                                        )
                                                    }
                                                    required
                                                />
                                                <Input
                                                    type="text"
                                                    placeholder="Amount (INR)"
                                                    value={investment.amount}
                                                    onChange={(e) =>
                                                        handleInvestmentChange(
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
                                                    onClick={() =>
                                                        removeInvestment(index)
                                                    }
                                                    className="bg-[#2AABEE] hover:bg-[#2AABEE]/90"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ),
                                    )}
                                    <Button
                                        type="button"
                                        onClick={addInvestment}
                                        className="mt-2 bg-[#2AABEE] hover:bg-[#2AABEE]/90 ml-2"
                                    >
                                        Add Investment
                                    </Button>
                                </div>
                                <div>
                                    <Label htmlFor="loans">
                                        Total Outstanding Loans (INR)
                                    </Label>
                                    <Input
                                        id="loans"
                                        name="loans"
                                        type="text"
                                        value={formData.loans}
                                        onChange={handleNumberInputChange}
                                        min={0}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="emi">
                                        Total Monthly EMI (INR)
                                    </Label>
                                    <Input
                                        id="emi"
                                        name="emi"
                                        type="text"
                                        value={formData.emi}
                                        onChange={handleNumberInputChange}
                                        min={0}
                                        required
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Financial Goals</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 p-4">
                                <div>
                                    <Label htmlFor="goal">Financial Goal</Label>
                                    <Input
                                        id="goal"
                                        name="goal"
                                        value={formData.goal}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Retirement savings, Child's education"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="duration">
                                        Investment Duration
                                    </Label>
                                    <Select
                                        onValueChange={handleSelectChange}
                                        value={formData.duration}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="short">
                                                Short term (0-3 years)
                                            </SelectItem>
                                            <SelectItem value="medium">
                                                Medium term (3-7 years)
                                            </SelectItem>
                                            <SelectItem value="long">
                                                Long term (7+ years)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Button
                            type="submit"
                            className="w-full bg-[#2AABEE] hover:bg-[#2AABEE]/90"
                        >
                            Save Profile
                        </Button>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
