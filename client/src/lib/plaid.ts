import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, CountryCode, PlaidApi, PlaidEnvironments, Products } from "plaid";

const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            "PLAID-CLIENT-ID": process.env.NEXT_PUBLIC_PLAID_CLIENT_ID,
            "PLAID-SECRET": process.env.NEXT_PUBLIC_PLAID_SECRET,
        },
    },
});

export const plaidClient = new PlaidApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { userId, userName } = req.body; // Assume user ID is passed from frontend

        try {
            const tokenResponse = await plaidClient.linkTokenCreate({
                user: {
                    client_user_id: userId, // This should come from the user session
                },
                client_name: userName || "My App",
                products: ["auth"] as Products[],
                country_codes: ["US"] as CountryCode[],
                language: "en",
            });

            res.status(200).json({ link_token: tokenResponse.data.link_token });
        } catch (error) {
            console.error("Error creating Plaid link token:", error);
            res.status(500).json({ error: "Failed to create link token" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}