import { User } from "@/Types/auth";
import { create } from "zustand";

interface IAuth {
    user: User | null;
    setUser: (user: User | null) => void;
    initialized: boolean;
    setInitialized: (value: boolean) => void;
}

export const useAuthStore = create<IAuth>(setState => ({
    user: null,
    setUser: user => setState({user: user}),
    initialized: false,
    setInitialized: value => setState({initialized: value}),
}));