import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        // TODO: Add other providers like login with email here, up till now, not needed
    ],
    callbacks: {
        async signIn({ user }) {
            try {
                // const response = await fetch(
                //     `${process.env.BACKEND_URL}/api/check`,
                //     {
                //         method: "POST",
                //         headers: {
                //             "Content-Type": "application/json",
                //         },
                //         body: JSON.stringify({
                //             name: user.name,
                //             image: user.image,
                //             email: user.email,
                //         }),
                //     },
                // );

                // const data = await response.json();
                // console.log(`API response: `, data);

                return true;
            } catch (error) {
                console.log(`Error posting user data: ${error}`);
                return false;
            }
        },
    },
};
