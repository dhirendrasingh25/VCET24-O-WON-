"use client";
import { usePathname } from "next/navigation";

import Link from "next/link";
import {
    Tooltip,
    TooltipProvider,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    Home,
    Landmark,
    Receipt,
    Package2,
    BadgeIndianRupee,
    CircleDollarSign,
} from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <TooltipProvider delayDuration={1}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="#"
                                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base relative z-20"
                            >
                                <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                                <span className="sr-only">Acme Inc</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="z-20 relative">
                            Bachat Pro
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <SidebarLink href="/dashboard" icon={Home} label="Home" />
                <SidebarLink
                    href="/dashboard/my-banks"
                    icon={CircleDollarSign}
                    label="My Banks"
                />
                <SidebarLink
                    href="/dashboard/transaction-history"
                    icon={Receipt}
                    label="Transaction History"
                />
                <SidebarLink
                    href="/dashboard/payment-transfer"
                    icon={BadgeIndianRupee}
                    label="Payment Transfer"
                />
                <SidebarLink
                    href="/dashboard/connect-bank"
                    icon={Landmark}
                    label="Connect Bank"
                />
            </nav>
        </aside>
    );
}

interface SidebarLinkProps {
    href: string;
    icon: React.ElementType;
    label: string;
}

function SidebarLink({ href, icon: Icon, label }: SidebarLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    console.log(pathname);

    return (
        <TooltipProvider delayDuration={1}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={href}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                            isActive
                                ? "text-custom-blue hover:text-blue-600"
                                : "text-black hover:text-blue-600"
                        }`}
                    >
                        <Icon className="h-5 w-5 stoke-2 font-bold hover:text-blue-600 transition-all" />
                        <span className="sr-only">{label}</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
