import axios from "axios";
import { plaidClient } from "@/lib/plaid";
import {
    CountryCode,
    ProcessorTokenCreateRequest,
    ProcessorTokenCreateRequestProcessorEnum,
    Products,
} from "plaid";
import { encryptId, parseStringify } from "../utils";
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
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;

        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });

        const accountData = accountsResponse.data.accounts[0];

        const request: ProcessorTokenCreateRequest = {
            access_token: accessToken,
            account_id: accountData.account_id,
            processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
        };

        const processorTokenResponse =
            await plaidClient.processorTokenCreate(request);
        const processorToken = processorTokenResponse.data.processor_token;

        const existingUser = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/complete/get-user`,
            {
                params: {
                    userId: user.id,
                },
            },
        );

        if (!existingUser) throw Error;

        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: existingUser.data.dwollaCustomerId,
            processorToken,
            bankName: accountData.name,
        });

        if (!fundingSourceUrl) throw Error;

        await createBankAccount({
            userId: user.id,
            bankId: itemId,
            accountId: accountData.account_id,
            accessToken,
            fundingSourceUrl,
            shareableId: encryptId(accountData.account_id),
        });

        // Revalidate the path to reflect the changes
        // revalidatePath("/");

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
