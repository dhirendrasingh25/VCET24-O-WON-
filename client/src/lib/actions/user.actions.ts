import axios from "axios";
import { plaidClient } from "@/lib/plaid";
import {
    CountryCode,
    ProcessorTokenCreateRequest,
    ProcessorTokenCreateRequestProcessorEnum,
    Products,
} from "plaid";
import { parseStringify } from "../utils";
import {
    CreateBankAccountProps,
    CreateLinkTokenProps,
    ExchangePublicTokenProps,
} from "@/types";
import { addFundingSource } from "./dwolla.action";
export const createLinkToken = async ({ user }: CreateLinkTokenProps) => {
    try {
        const tokenParams = {
            user: {
                client_user_id: user.id,
            },
            client_name: user.name || "Test User",
            products: ["auth"] as Products[],
            language: "en",
            country_codes: ["US"] as CountryCode[],
        };

        const response = await plaidClient.linkTokenCreate(tokenParams);

        console.log(response);
        return parseStringify({ linkToken: response.data.link_token });
    } catch (error) {
        console.log(error);
    }
};

export const createBankAccount = async ({
    userId,
    bankId,
    accountId,
    accessToken,
    fundingSourceUrl,
    shareableId,
}: CreateBankAccountProps) => {
    try {
        const bankAccount = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/create-bank-account`,
            {
                userId,
                bankId,
                accountId,
                accessToken,
                fundingSourceUrl,
                shareableId,
            },
        );
        const data = await bankAccount.data;

        return parseStringify(data);
    } catch (error) {
        console.log(error);
    }
};

export const exchangePublicToken = async ({
    publicToken,
    user,
}: ExchangePublicTokenProps) => {
    try {
        // Exchange public token for access token and item ID
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;

        // Get account information from Plaid using the access token
        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });

        const accountData = accountsResponse.data.accounts[0];

        // Create a processor token for Dwolla using the access token and account ID
        const request: ProcessorTokenCreateRequest = {
            access_token: accessToken,
            account_id: accountData.account_id,
            processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
        };

        const processorTokenResponse =
            await plaidClient.processorTokenCreate(request);
        const processorToken = processorTokenResponse.data.processor_token;

        
        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: user.dwollaCustomerId,
            processorToken,
            bankName: accountData.name,
        });

        // If the funding source URL is not created, throw an error
        if (!fundingSourceUrl) throw Error;

        // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
        await createBankAccount({
            userId: user.$id,
            bankId: itemId,
            accountId: accountData.account_id,
            accessToken,
            fundingSourceUrl,
            shareableId: encryptId(accountData.account_id),
        });

        // Revalidate the path to reflect the changes
        revalidatePath("/");

        // Return a success message
        return parseStringify({
            publicTokenExchange: "complete",
        });
    } catch (error) {
        console.error(
            "An error occurred while creating exchanging token:",
            error,
        );
    }
};
