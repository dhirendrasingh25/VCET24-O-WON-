"use client";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    Home,
    Landmark,
    CircleUserRound,
    Package2,
    BadgeIndianRupee,
    CircleDollarSign,
    MessageCircle,
    PanelLeft,
} from "lucide-react";
import { IoMdTrophy } from "react-icons/io";

export default function Header() {
    const { data: session } = useSession();

    const pathname = usePathname();
    const title = pathname.split("/").slice(1);

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link
                            href="#"
                            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                        >
                            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                            <span className="sr-only">Bachat Pro</span>
                        </Link>
                        <SheetNavLink
                            href="/dashboard"
                            icon={Home}
                            label="Home"
                        />
                        <SheetNavLink
                            href="/dashboard/my-banks"
                            icon={CircleDollarSign}
                            label="My Banks"
                        />
                        <SheetNavLink
                            href="/dashboard/global-chat"
                            icon={MessageCircle}
                            label="Global Chat"
                        />
                        <SheetNavLink
                            href="/dashboard/payment-transfer"
                            icon={BadgeIndianRupee}
                            label="Payment Transfer"
                        />
                        <SheetNavLink
                            href="/dashboard/connect-bank"
                            icon={Landmark}
                            label="Connect Bank"
                        />
                        <SheetNavLink
                            href="/dashboard/my-account"
                            icon={CircleUserRound}
                            label="My Account"
                        />
                        <SheetNavLink
                            href="/dashboard/achievements"
                            icon={IoMdTrophy}
                            label="View Achievements"
                        />
                    </nav>
                </SheetContent>
            </Sheet>

            <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                    {title.map((link, index) => (
                        <Fragment key={index}>
                            <BreadcrumbItem key={index}>
                                <BreadcrumbPage className="capitalize">
                                    {link}
                                </BreadcrumbPage>
                            </BreadcrumbItem>

                            {index < title.length - 1 && (
                                <BreadcrumbSeparator />
                            )}
                        </Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="overflow-hidden rounded-full"
                        >
                            <Image
                                src={
                                    session?.user?.image ||
                                    "/placeholder-user.jpg"
                                }
                                width={36}
                                height={36}
                                alt="Avatar"
                                className="overflow-hidden rounded-full"
                            />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Link href="/dashboard/my-account">My Account</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="bg-red-500 font-bold text-white focus:bg-red-600 focus:text-white"
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

interface SheetNavLinkProps {
    href: string;
    icon: React.ElementType;
    label: string;
}

function SheetNavLink({ href, icon: Icon, label }: SheetNavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`flex items-center gap-4 px-2.5 py-2 text-lg transition-colors ${
                isActive
                    ? "text-custom-blue hover:text-blue-600"
                    : "text-black hover:text-blue-600"
            }`}
        >
            <Icon className="h-5 w-5 stoke-2 font-bold hover:text-blue-600 transition-all" />
            {label}
        </Link>
    );
}
