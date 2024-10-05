"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { rupeeSymbol } from "@/lib/utils";

type Investment = {
    investType: string;
    amount: number;
};

type UserData = {
    profile: {
        dob: string;
        occupation: string;
        ailments: number;
        monthlyIncome: number;
        dependents: number;
        dependantDescription: string;
        goal: string;
        mandatoryExpenses: number;
        currentInvestments: Investment[];
        duration: string;
        loans: number;
        emi: number;
    };
};

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState<UserData | null>(null);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    useEffect(() => {
        if (!session) return;

        async function fetchProfileData() {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/complete/get-user`,
                    {
                        params: { email_id: session?.user?.email },
                    },
                );
                setProfileData(response.data.user);
            } catch (error) {
                console.error("Failed to fetch profile data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProfileData();
    }, [session]);

    if (status === "loading" || isLoading) {
        return (
            <section className="flex justify-center items-center h-screen">
                <div className="animate-spin h-5 w-5 border-4 border-t-transparent border-b-transparent border-blue-500 rounded-full"></div>
                <span className="ml-4 text-lg">Loading</span>
            </section>
        );
    }

    if (!session) {
        return <div>You are not logged in.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                {/* Left Column: User Info and Basic Details */}
                <Card className="w-full shadow-lg bg-white rounded-lg p-6">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800">
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 mt-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={session.user?.name || ""}
                                readOnly
                                className="bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={session.user?.email || ""}
                                readOnly
                                className="bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        {profileData && (
                            <>
                                <div>
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input
                                        id="dob"
                                        name="dob"
                                        type="date"
                                        value={profileData.profile.dob}
                                        readOnly
                                        className="bg-gray-100 cursor-not-allowed"
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
                                        value={profileData.profile.occupation}
                                        readOnly
                                        className="bg-gray-100 cursor-not-allowed"
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card className="w-full shadow-lg bg-white rounded-lg p-6">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800">
                            Financial Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 mt-4">
                        {profileData ? (
                            <>
                                {/* Income and Dependents */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="income">
                                            Monthly Income
                                        </Label>
                                        <Input
                                            id="income"
                                            name="income"
                                            type="number"
                                            value={
                                                profileData.profile
                                                    .monthlyIncome
                                            }
                                            readOnly
                                            className="bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="dependents">
                                            Dependents
                                        </Label>
                                        <Input
                                            id="dependents"
                                            name="dependents"
                                            type="number"
                                            value={
                                                profileData.profile.dependents
                                            }
                                            readOnly
                                            className="bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {/* Loans and EMI */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="loans">
                                            Total Loans
                                        </Label>
                                        <Input
                                            id="loans"
                                            name="loans"
                                            type="number"
                                            value={profileData.profile.loans}
                                            readOnly
                                            className="bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="emi">Monthly EMI</Label>
                                        <Input
                                            id="emi"
                                            name="emi"
                                            type="number"
                                            value={profileData.profile.emi}
                                            readOnly
                                            className="bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label>Investments</Label>
                                    <ul className="text-sm text-gray-600 flex flex-col gap-2">
                                        {profileData.profile.currentInvestments.map(
                                            (investment, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Input
                                                        id="investment-type"
                                                        name="investment-type"
                                                        type="text"
                                                        value={
                                                            investment.investType
                                                        }
                                                        readOnly
                                                        className="bg-gray-100 cursor-not-allowed"
                                                    />
                                                    {` : `}
                                                    <Input
                                                        id="current-investment-value"
                                                        name="current-investment-value"
                                                        type="text"
                                                        value={`${rupeeSymbol} ${investment.amount.toLocaleString()}`}
                                                        readOnly
                                                        className="bg-gray-100 cursor-not-allowed"
                                                    />
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500">
                                No profile data available.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
