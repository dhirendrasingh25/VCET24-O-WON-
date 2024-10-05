"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function PlaidAuth({ publicToken }: { publicToken: string }) {
    const [account, setAccount] = useState<{
        account: string;
        routing: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                let accessTokenResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/exchange_public_token`,
                    { public_token: publicToken },
                );
                const authResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth`,
                    { access_token: accessTokenResponse.data.accessToken },
                );
                setAccount(authResponse.data.numbers.ach[0]);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(
                    "Failed to fetch account information. Please try again.",
                );
            }
        }
        fetchData();
    }, [publicToken]);

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        account && (
            <Card className="w-full max-w-md mx-auto mt-4">
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-2">Account number: {account.account}</p>
                    <p>Routing number: {account.routing}</p>
                </CardContent>
            </Card>
        )
    );
}

export default function PlaidIntegration() {
    const [linkToken, setLinkToken] = useState<string | null>(null);
    const [publicToken, setPublicToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLinkToken() {
            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/create_link_token`,
                );
                setLinkToken(response.data.link_token);
            } catch (error) {
                console.error("Error fetching link token:", error);
                setError("Failed to initialize Plaid. Please try again later.");
            }
        }
        fetchLinkToken();
    }, []);

    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: (public_token, metadata) => {
            setPublicToken(public_token);
            console.log("success", public_token, metadata);
        },
        onExit: (err, metadata) => {
            if (err) {
                setError("Error connecting to your bank. Please try again.");
            }
        },
    });

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Plaid Integration</CardTitle>
                </CardHeader>
                <CardContent>
                    {publicToken ? (
                        <PlaidAuth publicToken={publicToken} />
                    ) : (
                        <Button onClick={() => open()} disabled={!ready}>
                            Connect a bank account
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
