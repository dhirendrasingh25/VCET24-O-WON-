import { User } from "next-auth";

export interface ITransaction {
    _id: string;
    category: string;
    description: number;
    date: Date;
    amount: string;
}

export interface Tips {
    name: string;
    desc: string;
}

export interface MarketNews {
    category: string;
    image: string;
    headline: string;
    url: string;
}

export interface Bank {
    $id: string;
    accountId: string;
    bankId: string;
    accessToken: string;
    fundingSourceUrl: string;
    email: string;
    shareableId: string;
}

export interface getAccountsProps {
    email: string;
}

export interface getAccountProps {
    email: string;
}

export interface PlaidLinkProps {
    user: User;
}

export interface CreateLinkTokenProps {
    user: User;
}

export interface CreateBankAccountProps {
    email: string;
    bankId: string;
    accountId: string;
    accessToken: string;
    fundingSourceUrl: string;
    shareableId: string;
}

export interface ExchangePublicTokenProps {
    publicToken: string;
    user: User;
}

export interface CreateFundingSourceOptions {
    customerId: string; // Dwolla Customer ID
    fundingSourceName: string; // Dwolla Funding Source Name
    plaidToken: string; // Plaid Account Processor Token
    _links: object; // Dwolla On Demand Authorization Link
}

export interface NewDwollaCustomerParams {
    firstName: string;
    lastName: string;
    email: string;
    type: string;
    address1: string;
    city: string;
    state: string;
    postalCode: string;
    dateOfBirth: string;
    ssn: string;
}

export interface TransferParams {
    sourceFundingSourceUrl: string;
    destinationFundingSourceUrl: string;
    amount: string;
}

export interface AddFundingSourceParams {
    dwollaCustomerId: string;
    processorToken: string;
    bankName: string;
}

export interface Transaction {
    id: string;
    $id: string;
    name: string;
    paymentChannel: string;
    type: string;
    accountId: string;
    amount: number;
    pending: boolean;
    category: string;
    date: string;
    image: string;
    $createdAt: string;
    channel: string;
    senderBankId: string;
    receiverBankId: string;
}

export interface getBankProps {
    bankId: string;
}

export interface getBanksProps {
    email: string;
}

export interface getBankByAccountIdProps {
    accountId: string;
}