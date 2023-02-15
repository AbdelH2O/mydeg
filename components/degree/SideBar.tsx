import { MouseEventHandler, useEffect, useState } from "react";
import { useCourses } from "../../hooks/useCourses";
import { SIDEBAR } from "../../types/SideBar";
import { TERMS } from "../../types/Terms";
import Droppable from "../Droppable";
import { removeCourse } from "../../utils/bridge";
import useSupabase from "../../hooks/useSupabase";

const map: {[key: string]: string} = {
    Fall: 'FA',
    Spring: 'SP',
    Summer: 'SU',
}

const level: { [key: string]: {label: string, color: string}} = {
    0: {
        label: "Introductory",
        color: "-blue-600"
    },
    1: {
        label: "Introductory",
        color: "-blue-600"
    },
    2: {
        label: "Intermediate",
        color: "-green-600"
    },
    3: {
        label: "Advanced",
        color: "-red-600"
    },
    4: {
        label: "Expert",
        color: "-purple-600"
    }
}

const SideBar = ({
    onSideBarRefChange,
}: {
    onSideBarRefChange: (node: HTMLDivElement) => void;
}) => {
    const [hovering, setHovering] = useState(false);
    const [display, setDisplay] = useState(false);

    const { supabase } = useSupabase();

    const {
        sideBar,
        setSideBar,
        terms,
        currentTerm,
        activeId,
        used,
        setUsed,
        setTerms,
        setCurrentTerm,
        // Term/Courses map
        map: coursesMap,
        setMap,
        // all courses info
        info,
    } = useCourses();

    const show = sideBar === SIDEBAR.COURSES;

    // handling closing the sidebar
    const handleClose = () => {
        if(show) {
            setSideBar(SIDEBAR.NONE);
            setHovering(false);
            setTimeout(() => {
                setDisplay(!display);
            }, 300);
        } else {
            setDisplay(!display);
            setSideBar(SIDEBAR.COURSES);
            setHovering(false);
        }
    }

    useEffect(() => {
        console.log("activeId", activeId);
    }, [activeId]);

    // handling clicking on a term
    const handleClick = (term: {type: string, year: string, id: string}) => {
        setCurrentTerm(term as {type: TERMS, year: string, id: string});
    }

    const handleDelete = async (courseCode: string) => {
        delete used[courseCode];
        setUsed(used);
        removeCourse(currentTerm.id, courseCode, supabase);
        coursesMap.set(currentTerm.id, coursesMap.get(currentTerm.id)!.filter(c => c !== courseCode));
        setMap(coursesMap);
        setTerms({...terms});
    }
    
    return (
        <div className="h-[calc(100vh-4rem)] absolute">
            <div 
                className="h-full border border-sky-300/50 absolute z-[9999] resize-x"
                style={{right: show ? '75vw' : '98.5vw', transition: 'all 0.3s ease-in-out', cursor: show ? 'ew-resize' : 'auto'}}
                onMouseEnter={() => {if(!show) setHovering(true)}}
                onMouseLeave={() => {if(!show || hovering) setHovering(false)}}
            ></div>
            <div
                className={`bg-white h-[calc(100vh-4rem)] left-0 fixed z-50 flex flex-row`}
                style={{width: '25vw', marginLeft: show ? '0' : '-23.5vw', cursor: !show ? 'pointer' : 'default', backdropFilter: hovering ? 'blur(4px)' : 'none', transition: 'all 0.3s ease-in-out'}}
                onClick={() => {if(!show) {handleClose}}}
                onMouseEnter={() => {if(!show) setHovering(true)}}
                onMouseLeave={() => {if(!show || hovering) setHovering(false)}}
            >
                <div className="h-full w-[4vw] bg-cyan-800 flex flex-col" ref={onSideBarRefChange}>
                    {
                        Object.keys(terms).map((term, index) => {
                            const eq = currentTerm.type === terms[term].type && currentTerm.year === terms[term].year;
                            return (
                                <div key={index} className="h-14 w-full flex flex-col justify-center items-center border- b border-cyan-700" >
                                    <p onClick={() => handleClick({...terms[term], id: term})} className={`font-Poppins font-extrabold text-center border-cyan-700/60 w-f ull h-fu ll w-[85%] h-[85%] ${terms[term].type + (eq ? "_Selected border-none" : " cursor-pointer")} rounded flex flex-col justify-center select-none`}>
                                        {map[terms[term].type] + terms[term].year.slice(2)}
                                    </p>
                                </div>
                            )
                        })
                    }
                    <div className="h-14 w-full flex flex-col justify-center items-center">
                        {/* Plus sign to add terms */}
                        <p className="font-Poppins text-xl font-extrabold text-center w-[90%] h-[90%] bg-cyan-900 hover:brightness-90 rounded flex flex-col justify-center cursor-pointer select-none">
                            +
                        </p>
                    </div>
                </div>
                <div
                    className="w-[21vw]"
                    // style={{
                    //     background: `linear-gradient(90deg, #cffafe 21.8px, transparent 1%) center, linear-gradient(#cffafe 21.8px, transparent 1%) center, #000`,
                    //     backgroundSize: "23px 23px",
                    // }}
                >
                    <div className="w-full">
                        <div className="w-full mx-auto pb-2 h-20 bg-cyan-800 bor der border-cyan-70 0 flex flex-col justify-center items-center round ed font-bold font-Poppins text-2xl">
                            <p>
                                {currentTerm.type + " " + currentTerm.year}
                            </p>
                            <div className="flex flex-row font-JetBrainsMono">
                                <p className="text-sm font-normal">
                                    {coursesMap.get(currentTerm.id)?.length} course{coursesMap.get(currentTerm.id)?.length === 1 ? "" : "s"} / 
                                </p>
                                <p className="text-sm font-bold text-green-500">
                                    &nbsp;{coursesMap.get(currentTerm.id)?.reduce((acc, course) => acc + info[course]?.credits, 0)} credits
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-cyan-800 w-full h-2">
                        <div className="bg-white rounded-t h-full">
                            {/* Total credits: {coursesMap.get(currentTerm.id)?.reduce((acc, course) => acc + info[course]?.credits, 0)} */}
                        </div>
                    </div>
                    {/* <div className="bg-cyan-800 rounded-b ml-auto mr-2 w-fit px-2 font-Lato py-1 font-bold">
                        Total credits: {coursesMap.get(currentTerm.id)?.reduce((acc, course) => acc + info[course]?.credits, 0)}
                    </div> */}
                    <div className="w-full overflow-y-scroll h-[calc(100vh-9.5rem)] rounded">
                        <div className="bg-blue-600 hidden"/>
                        <div className="bg-green-600 hidden"/>
                        <div className="bg-red-600 hidden"/>
                        <div className="bg-purple-600 hidden"/>
                        {/* <div className="text-black font-Poppins font-bold mx-auto text-xl w-fit">
                            {coursesMap.get(currentTerm.id)?.reduce((acc, course) => acc + 1, 0)} Classes
                        </div> */}
                        {
                            coursesMap.get(currentTerm.id)?.length !== 0 ? (
                            coursesMap.get(currentTerm.id)?.map((course, index) => {
                                // console.log(info[course]);
                                // const level = ["Introductory", "Intermediate", "Advanced", "Expert"];
                                const courseLevel = level[Math.max(parseInt(course[4]) - 1, 0)];
                                console.log({courseLevel, index: parseInt(course[4]) - 1});
                                
                                return (
                                    <div key={index} className="w-full p-2 pb-0">
                                        <div className="border-2 border-black bg-cyan-100 rounded p-2 shadow-md font-JetBrainsMono" style={{boxShadow: `-3px 5px #000`, backgroundColor: info[course]?.desc}}>
                                            <div className="w-full flex flex-row justify-between items-center">
                                                <p className="bg-cyan-700 text-sm font-extrabold w-fit rounded p-[1px] px-1 shadow-inner" style={{color: info[course]?.background}}>
                                                    {course}
                                                </p>
                                                <button onClick={() => handleDelete(course)} className="bg-red-60 0 text-xs hover:bg-red-700 hover:text-white transition-colors text-red-600 font-bold py-1 px-2 rounded">
                                                    x
                                                </button>
                                            </div>
                                            <p className="text-black font-extrabold text-base mt-1 ">
                                                {info[course]?.name}
                                            </p>
                                            <div className="mt-1 flex flex-row gap-2">
                                                <p className="text-black text-xs bg-black font-bold font-Lato w-fit rounded p-[1px] px-1"  style={{backgroundColor: info[course]?.background}}>
                                                    {info[course]?.credits} credit{info[course]?.credits > 1 ? "s" : ""}
                                                </p>
                                                <p className={`text-white text-xs rounded p-[1px] px-1 bg${courseLevel?.color}`}>
                                                    {courseLevel?.label}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })) : (
                                <div className="w-full h-64 p-2 absolute bottom-0 mt-4 left-0 transition-all duration-300 ease-in-out" style={{height: activeId ? '16rem' : '0', bottom: activeId ? '0' : '-13rem',}}>
                                    {/* Display to the user: No courses added yet :( */}
                                    <div className="border h-full border-dashed border-gray-300 bg-cyan-100/95 rounded flex justify-center items-center">
                                        <p className="text-black font-bold font-Poppins text-2xl">
                                            No courses added yet :(
                                        </p>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div
                        className="w-full h-64 p-2 absolute bottom-0 mt-4 left-0 transition-all duration-300 ease-in-out"
                        style={{
                            height: activeId ? '16rem' : '0',
                            bottom: activeId ? '0' : '-13rem',
                            // opacity: activeId ? 1 : 0,
                            // display: activeId ? "block" : "none",
                        }}
                    >
                        <Droppable
                            // index={index}
                            id={currentTerm.id}
                            className="border h-full border-dashed border-gray-300 bg-cyan-100/95 rounded flex justify-center items-center"
                            style={{
                                // boxShadow: `-3px 5px #000000F0`
                                // backgroundColor: !activeId ? '#f3f4f6' : 'transparent',
                                // animation: activeId ? "opacity 0.85s ease-in-out infinite" : "",
                            }}
                        >
                            <div className="w-full h-full flex flex-col justify-center items-center opacity-100">
                                <p className="text-gray-100 font-bold font-Poppins text-xl bg-cyan-600 p-2 px-3 rounded">
                                    Drop here
                                </p>
                            </div>
                        </Droppable>
                    </div>
                </div>
            </div>

            <div className="group h-fit w-screen">
                <div className="w-[25vw] h-[calc(100vh-4rem)] bg-white z-[99] absolute peer cursor-pointer" style={{display: !display ? 'block' : 'none', marginLeft: show ? '0' : '-23.5vw'}} onClick={handleClose}></div>
                <div
                    className={`z-[9999] group-hover:bg-cyan-500 peer-hover:bg-cyan-500 top-1/2 absolute translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full shadow-xl bg-white cursor-pointer `}
                    style={{
                        right: show ? '75vw' : '98.5vw',
                        transition: 'all 0.3s ease-in-out, background-color 0.1s ease-in-out, fill 0.1s ease-in-out',
                    }}
                    onClick={handleClose}
                >
                    <svg className="group-hover:fill-white peer-hover:fill-white fill-black" fill={!hovering ? 'black' : 'white'} 
                        style={{transform: show ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'all 0.1s ease-in-out'}} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 64 64" viewBox="0 0 64 64">
                        <path
                            className={"cursor-pointer group-hover:fill-current group-hover:text-white peer-hover:fill-current peer-hover:text-white"}
                            d="m-210.9-289-2-2 11.8-11.7-11.8-11.7 2-2 13.8 13.7-13.8 13.7"
                            transform="translate(237 335)"
                        />
                    </svg>
                </div>
            </div>
        </div>
    )
};

export default SideBar;