import axios from 'axios';
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
                await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check`, {
                    params: {
                        email_id: user.email,
                        image: user.image,
                        name: user.name
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                return true;
            } catch (error) {
                console.log(`Error posting user data: ${error}`);
                return true;
            }
        },
    },
};
