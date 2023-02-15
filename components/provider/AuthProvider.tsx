import { AccountInfo, Configuration, PublicClientApplication } from "@azure/msal-browser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../hooks/useAuth";
import { MsalProvider } from "@azure/msal-react";

const msalConfig: Configuration = {
    auth: {
        clientId: process.env.NEXT_PUBLIC_MSAL_CLIENT_ID || "",
        redirectUri: `${
            process.env.NEXT_PUBLIC_MSAL_REDIRECT_URI || (typeof window !== "undefined" ? window.location.origin : "")
        }/login`,
        authority: process.env.NEXT_PUBLIC_MSAL_AUTHORITY || "",
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true,
        secureCookies: true,
    },
};

const msalApp = new PublicClientApplication(msalConfig);

const scopes = ["user.read", "email", "openid", "profile"];

export const msalLogin = async () => {
    try {
        const response = await msalApp.loginPopup({
            scopes,
            prompt: "select_account",
        });
        return response;
    } catch (err) {
        console.dir(err); // HACK proper error handling
        toast.error("Login failed");
    }
};

const AuthProvider = ({ children }: { children: JSX.Element[] | JSX.Element}) => {
    const router = useRouter();
    const [user, setUser] = useState<null | AccountInfo>(null);
    useEffect(() => {
        const account = msalApp.getAllAccounts()[0];
        console.log("account", account);
        
        if(router.route === "/login") {
            if(account) {
                router.push("/dashboard");
            }
            return;
        } else if(!account) {
            // router.push("/login");
            return;
        }
    }, [router.route]);

    useEffect(() => {
        const account = msalApp.getAllAccounts()[0];
        setUser(account ? account : null);
    }, []);
    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
            }}
        >
            <MsalProvider instance={msalApp}>
                {children}
            </MsalProvider>
        </AuthContext.Provider>
    );
};

export default AuthProvider;