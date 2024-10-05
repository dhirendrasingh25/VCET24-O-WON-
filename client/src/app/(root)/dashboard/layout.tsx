import { Toaster } from "@/components/ui/toaster";
import SessionWrapper from "@/components/core/session-wrapper";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <SessionWrapper>
            <main className="flex min-h-screen w-full flex-col bg-white/40">
                <Sidebar />
                <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                    <Header />
                    {children}
                </div>
            </main>
            <Toaster />
        </SessionWrapper>
    );
}
