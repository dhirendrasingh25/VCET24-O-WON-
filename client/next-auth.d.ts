import { User as UserType } from "next-auth";

declare module "next-auth" {
    interface User extends UserType {
        id: string;
    }

    interface Session {
        user: User;
    }
}
