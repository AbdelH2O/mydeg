import { AccountInfo } from "@azure/msal-browser";
import { createContext, useContext } from "react";

const DEFAULT_CONTEXT: {
    user: AccountInfo | null;
    setUser: (user: AccountInfo | null) => void;
} = {
    user: null,
    setUser: () => {},
};

export const AuthContext = createContext(DEFAULT_CONTEXT);

export function useAuth() {
    return useContext(AuthContext);
}
