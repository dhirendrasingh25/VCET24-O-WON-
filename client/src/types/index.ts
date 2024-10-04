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
