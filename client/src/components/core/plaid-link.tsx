import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
    PlaidLinkOnSuccess,
    PlaidLinkOptions,
    usePlaidLink,
} from "react-plaid-link";
import { User } from "next-auth";
import { Button } from "../ui/button";

interface PlaidLinkProps {
    user: User;
    variant: "connect" | "reconnect";
}

export default function PlaidLink({ user, variant }: PlaidLinkProps) {
    const router = useRouter();
    const [token, setToken] = useState("");

    const onSuccess = useCallback<PlaidLinkOnSuccess>(
        async (public_token: string) => {
            await exchangePublicToken(public_token);

            router.push("/");
        },
        [user],
    );

    const config: PlaidLinkOptions = {
        token,
        onSuccess,
    };

    const { open, ready } = usePlaidLink(config);

    useEffect(() => {
        const getLinkToken = async () => {
            const data = await createLinkToken(user.id);
            setToken(data?.linkToken);
        };

        getLinkToken();
    }, [user]);

    return (
        <Button onClick={() => open()} disabled={!ready}>
            Connect To Bank
        </Button>
    );
}
