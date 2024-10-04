import SessionWrapper from "@/components/core/session-wrapper";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SessionWrapper>
            <main>{children}</main>
        </SessionWrapper>
    );
}
