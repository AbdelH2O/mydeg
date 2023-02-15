import { AuthProvider } from "./provider";

const Providers = ({ children }: { children: JSX.Element|JSX.Element[]}) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
};
export default Providers;