import { Configuration, PublicClientApplication } from "@azure/msal-browser";
import { toast } from "react-toastify";

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
