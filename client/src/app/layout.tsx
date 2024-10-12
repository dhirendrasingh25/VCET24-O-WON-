import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Bachat Pro",
    description:
        "Bachat Pro is an interactive financial evaluation tool that helps financial advisors create adaptive investment plans considering age, lifestyle, emergencies, and market trends.",
    keywords:
        "Bachat Pro, financial planning, investment tool, adaptive investment, wealth management, financial advisor, personalized portfolio",
    authors: [{ name: "Bachat Pro", url: "https://bachatpro.vercel.app" }],
};

interface RootLayoutProps {
    children?: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
    return (
        <html lang="en">
            <head>
                <link rel="manifest" href="/manifest.json" />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
