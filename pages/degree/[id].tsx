import Degree from "../../components/degree";
import { CoursesProvider } from "../../components/provider";

const DegreePage = () => {
    // console.log({Degree, CoursesProvider});
    
    return (
        <CoursesProvider>
            <Degree />
        </CoursesProvider>
    )
};

export default DegreePage;