import { User } from "@/Types/auth";
import { create } from "zustand";

interface IAuth {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<IAuth>(setState => ({
    user: null,
    setUser: user => setState({user: user}),
}));