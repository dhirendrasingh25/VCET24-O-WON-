import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    PlaidLinkOnSuccess,
    PlaidLinkOptions,
    usePlaidLink,
} from "react-plaid-link";
import { useRouter } from "next/navigation";
import {
    createLinkToken,
    exchangePublicToken,
} from "@/lib/actions/user.actions";
import { PlaidLinkProps } from "@/types";
// import Image from "next/image";

const PlaidLink = ({ user }: PlaidLinkProps) => {
    const router = useRouter();

    const [token, setToken] = useState("");

    useEffect(() => {
        const getLinkToken = async () => {
            const data = await createLinkToken({ user });

            setToken(data?.linkToken);
        };

        getLinkToken();
    }, [user]);

    const onSuccess = useCallback<PlaidLinkOnSuccess>(
        async (public_token: string) => {
            await exchangePublicToken({
                publicToken: public_token,
                user,
            });

            router.push("/");
        },
        [user, router],
    );

    const config: PlaidLinkOptions = {
        token,
        onSuccess,
    };

    const { open, ready } = usePlaidLink(config);

    return (
        <Button
            onClick={() => open()}
            disabled={!ready}
            className="bg-custom-blue hover:bg-blue-600 transition-all disabled:cursor-not-allowed"
        >
            <p className="text-[16px] font-semibold text-black-2">
                Connect bank
            </p>
        </Button>
    );
};

export default PlaidLink;
