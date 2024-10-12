import axios from "axios";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { extractCustomerIdFromUrl } from "@/lib/utils";
import { createDwollaCustomer } from "@/lib/actions/dwolla.actions";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    // pages: {
    //     signIn: "/auth/signin",
    // },
    callbacks: {
        async signIn({ user }) {
            try {
                const existingUser = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check`,
                    {
                        params: {
                            email_id: user.email,
                            image: user.image,
                            name: user.name,
                        },
                    },
                );

                let dwollaCustomerUrl, dwollaCustomerId;

                if (existingUser.data.existing_user === false) {
                    const nameParts = user.name?.split(" ") || [];
                    const firstName = nameParts[0];
                    const lastName = nameParts.length > 1 ? nameParts[1] : "";

                    dwollaCustomerUrl = await createDwollaCustomer({
                        ...existingUser.data,
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
                        dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

                        await axios.post(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/update-dwolla-customer-id`,
                            {
                                email_id: user.email,
                                dwollaCustomerId,
                                dwollaCustomerUrl,
                            },
                        );
                    }
                }

                return true;
            } catch (error) {
                console.log(`Error posting user data: ${error}`);
                return false;
            }
        },
    },
};
