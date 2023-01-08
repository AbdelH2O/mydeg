import { useCourses } from "../hooks/useCourses"
import { SIDEBAR } from "../types/SideBar";

const RightBar = () => {
    const { sideBar, setSideBar, infoCourse } = useCourses();
    const show = sideBar === SIDEBAR.INFO;
    // const show = true;
    console.log(infoCourse);
    
    

    return (
        <div className="h-[calc(100vh-4rem)] absolute">
            <div 
                className="h-full border border-sky-300/50 absolute z-[9999] resize-x"
                style={{right: show ? '25vw' : '0', transition: 'all 0.3s ease-in-out'}}
            ></div>
            <div
                className={`bg-white h-[calc(100vh-4rem)] right-0 fixed z-50`}
                style={{width: '25vw', marginRight: show ? '0' : '-23.5vw', transition: 'all 0.3s ease-in-out'}}
                // onClick={() => {if(!show) {handleClose}}}
                // onMouseEnter={() => {if(!show) setHovering(true)}}
                // onMouseLeave={() => {if(!show || hovering) setHovering(false)}}
            >
                <div className="flex flex-col h-full text-black">
                    <div className="flex flex-row justify-between items-center px-4 py-3 transition-colors shadow-md font-Poppins bg-cyan-50">
                        <div className="text-lg font-bold text-cyan-900">Course Info</div>
                        <div className="flex flex-row items-center">
                            <div className="text-sm select-none h-full py-2 rounded px-3 hover:bg-cyan-100 transition-colors font-bold text-cyan-600 cursor-pointer" onClick={() => setSideBar(SIDEBAR.NONE)}>Close</div>
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto text-black">
                        <div className="px-4 py-2 text-center">
                            {
                                infoCourse.name || !infoCourse.children ? (
                                    <div className="">
                                        <div className="text-lg font-bold">{infoCourse.name}</div>
                                        <div className="text-sm font-bold text-sky-500">{infoCourse.id}</div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-lg font-bold">{infoCourse.id}</div>
                                        {
                                            infoCourse.children.map((child, index) => (
                                                <div key={index} className="text-sm font-bold text-sky-500">{child.course}</div>
                                            ))
                                        }
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RightBar