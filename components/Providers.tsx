import { CoursesProvider } from "./CoursesProvider";

const Providers = ({ children }: { children: JSX.Element|JSX.Element[]}) => {
    return (
        <CoursesProvider>
            {children}
        </CoursesProvider>
    );
};
export default Providers;