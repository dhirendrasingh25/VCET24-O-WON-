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
                const response = await fetch(
                    `${process.env.BACKEND_URL}/api/check`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email_id: user.email,
                        }),
                    },
                );

                const data = await response.json();
                console.log(`API response: `, data);

                // If user boolean in response is false, redirect to complete profile
                if (data.complete_profile === false) {
                    // Here you return a URL to redirect the user to
                    return "/dashboard/complete-profile";
                }

                return true;
            } catch (error) {
                console.log(`Error posting user data: ${error}`);
                return false;
            }
        },

        // Handle redirection after login
        async redirect({ url, baseUrl }) {
            // Redirect to the given URL, or use baseUrl as fallback
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    },
};
