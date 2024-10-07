import axios from "axios";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { createDwollaCustomer } from "./actions/dwolla.action";
import { extractCustomerIdFromUrl } from "./utils";

import userStore from "@/stores/user-store";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            try {
                // Check if the user already exists in your backend
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check`,
                    {
                        params: {
                            email_id: user.email,
                            image: user.image,
                            name: user.name,
                        },
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );

                const data = await response.data; // if user does not exist, creates a new user
                userStore.setState({ user: data });

                let dwollaCustomerUrl;

                if (!data.existing_user) {
                    const nameParts = user.name?.split(" ") || [];
                    const firstName = nameParts[0] || "";
                    const lastName =
                        nameParts.length > 1
                            ? nameParts.slice(1).join(" ")
                            : "";

                    dwollaCustomerUrl = await createDwollaCustomer({
                        ...data,
                        firstName,
                        lastName,
                        email: user.email,
                        address1: "123 Main St",
                        city: "SomeCity",
                        state: "CA",
                        postalCode: "12345",
                        dateOfBirth: "1990-01-01",
                        ssn: "123-45-6789",
                        type: "personal",
                    });

                    if (dwollaCustomerUrl) {
                        const dwollaCustomerId =
                            extractCustomerIdFromUrl(dwollaCustomerUrl);

                        await axios.post(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/update-dwolla-customer-id`,
                            {
                                email_id: user.email,
                                dwollaCustomerId,
                            },
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            },
                        );
                    }
                }

                return true;
            } catch (error) {
                console.error(`Error processing user data: ${error}`);
                return false;
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.id && session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
};
