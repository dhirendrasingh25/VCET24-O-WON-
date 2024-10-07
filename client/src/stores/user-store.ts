import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "next-auth";

interface IUserStore {
    user: User | null;
    setUser: (user: User) => void;
}

const userStore = create<IUserStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user: User) => set({ user }),
        }),
        {
            name: "user-store",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);

export default userStore;
