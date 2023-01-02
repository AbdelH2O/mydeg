import { CoursesProvider, AuthProvider } from "./provider";

const Providers = ({ children }: { children: JSX.Element|JSX.Element[]}) => {
    return (
        <CoursesProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </CoursesProvider>
    );
};
export default Providers;