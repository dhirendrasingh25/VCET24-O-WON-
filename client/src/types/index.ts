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

export interface PlaidLinkProps {
    user: User;
}

export interface CreateLinkTokenProps {
    user: User;
}

export interface CreateBankAccountProps {
    userId: string;
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

export interface GetBanksProps {
    userId: string;
}
