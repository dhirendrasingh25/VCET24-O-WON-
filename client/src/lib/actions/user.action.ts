"use server";

import { User } from "next-auth";
import { plaidClient } from '@/lib/plaid'
import { CountryCode, Products } from "plaid";

export const createLinkToken = async (user: User) => {
    try {
        const tokenParams = {
            user: {
                client_user_id: user.id,
            },
            client_name: user?.name || "Plaid Test App",
            products: ["auth"] as Products[],
            language: "en",
            country_codes: ["IN", "US", "GB"] as CountryCode[],
        }

        const response = await plaidClient.linkTokenCreate(tokenParams);

        return parseStringify({ linkToken: response.data.link_token })
    } catch (error) {
        console.log(error);
    }
}