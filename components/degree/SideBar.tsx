import { Fragment, useEffect, useState } from "react";
import { useCourses } from "../../hooks/useCourses";
import { SIDEBAR } from "../../types/SideBar";
import { TERMS } from "../../types/Terms";
import Droppable from "../Droppable";
import { removeCourse, addTerm, deleteTerm, removeTermCourses } from "../../utils/bridge";
import useSupabase from "../../hooks/useSupabase";
import { Dialog, Transition } from "@headlessui/react";
import { LeafIcon, SnowIcon, SunIcon } from "../icons";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import MenuButton from "./MenuButton";
import ProgressBar from "@ramonak/react-progress-bar";

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
    // const [display, setDisplay] = useState(true);
    // Adding term dialog
    const [isOpen, setIsOpen] = useState(false);
    const [color, setColor] = useState("gray");

    const { id } = useRouter().query;
    const { supabase } = useSupabase();

    const {
        sideBar,
        setSideBar,
        majorMinor,
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

    useEffect(() => {
        if(!currentTerm || Object.keys(info).length === 0 || !currentTerm.id) return;
        const credits = (coursesMap.get(currentTerm.id) || []).reduce((acc, curr) => acc + info[curr].credits, 0);
        console.log(credits);
        
        let color = "gray";
        if(credits < 12) color = "red";
        else if(credits <= 18) color = "green";
        else if(credits <= 22) color = "yellow";

        setColor(color);
    }, [currentTerm, info, coursesMap.get(currentTerm?.id || "")]);


    const show = sideBar === SIDEBAR.COURSES;
    const display = sideBar === SIDEBAR.COURSES;


    // handling closing the sidebar
    const handleClose = () => {
        if(show) {
            setSideBar(SIDEBAR.NONE);
            setHovering(false);
            // setTimeout(() => {
            //     setDisplay(!display);
            // }, 300);
        } else {
            // setDisplay(!display);
            setSideBar(SIDEBAR.COURSES);
            setHovering(false);
        }
    }

    // handling clicking on a term
    const handleClick = (term: {type: string, year: string, id: string}) => {
        setCurrentTerm(term as {type: TERMS, year: string, id: string});
    }

    const handleDelete = async (courseCode: string, removeSupa?: boolean) => {
        delete used[courseCode];
        setUsed(used);
        // undefined or false means remove from supabase
        if(!removeSupa) removeCourse(currentTerm.id, courseCode, supabase);
        coursesMap.set(currentTerm.id, coursesMap.get(currentTerm.id)!.filter(c => c !== courseCode));
        setMap(coursesMap);
        setTerms({...terms});
    }

    const handleDeleteBatch = async (courseCodes: string[]) => {
        courseCodes.forEach(courseCode => {
            handleDelete(courseCode, true);
        });
        removeTermCourses(currentTerm.id, supabase);
    };


    const closeModal = () => {
        setIsOpen(false);
    }

    const openModal = () => {
        setIsOpen(true);
    }

    const getNextTerm = (type: TERMS, year: string) => {
        const yearPlus = (parseInt(year) + 1).toString();
        if(type === "Fall" && Object.values(terms).every(t => t.type !== "Spring" || t.year !== yearPlus)) {
            return [{type: TERMS.SPRING, year: yearPlus}];
        }
        if(type === "Spring") {
            const ret = [];
            if(Object.values(terms).every(t => t.type !== "Fall" || t.year !== year)) {
                ret.push({type: TERMS.FALL, year});
            }
            if(Object.values(terms).every(t => t.type !== "Summer" || t.year !== year)) {
                ret.push({type: TERMS.SUMMER, year});
            }
            return ret;
        }
        return [];
    }

    

    const handleAddTerm = async (termType: TERMS, termYear: string) => {
        closeModal();
        const term = Object.keys(terms).length === 0 ?
            {
                type: majorMinor.term.type,
                year: majorMinor.term.year
            } :
            {
                type: termType,
                year: termYear
            };
        const { id: termId, success } = await addTerm(id as string, term.year, term.type, supabase);
        if(success) {
            coursesMap.set(termId as string, []);
            setMap(coursesMap);
            const temp = {...terms, [termId as string]: term};
            setTerms(
                Object.keys(temp)
                    .sort((a,b) => {
                        if(temp[a].year === temp[b].year) {
                            const order = ["Spring", "Summer", "Fall"];
                            return order.indexOf(temp[a].type) - order.indexOf(temp[b].type);
                        }
                        return parseInt(temp[a].year) - parseInt(temp[b].year)
                    })
                    .reduce((r: {[key: string]: { type: TERMS, year: string }},k)=>(r[k]=temp[k],r),{})
            );
            
        } else {
            toast.error("Error adding term. Please try again later.");
        }
    }

    const handleClearTerm = async () => {
        // get course codes of the current term
        const courseCodes = coursesMap.get(currentTerm.id) || [];
        courseCodes.forEach(course => {
            handleDelete(course);
        });
        removeTermCourses(currentTerm.id, supabase);
    }

    const handleDeleteTerm = async () => {
        if(currentTerm.type === majorMinor.term.type && currentTerm.year === majorMinor.term.year) {
            // TODO: add trigger to supabase to prevent deleting the starting term
            toast.error("You can't delete the starting term.");
            return;
        }
        if(Object.keys(terms).length === 1) {
            toast.error("You can't delete the only term.");
            return;
        }

        handleDeleteBatch(coursesMap.get(currentTerm.id) || []);
        
        const { success } = await deleteTerm(currentTerm.id, supabase);
        if(success) {
            const temp = {...terms};
            const termIndex = Object.keys(terms).indexOf(currentTerm.id);
            delete temp[currentTerm.id];
            setTerms(temp);
            coursesMap.delete(currentTerm.id);
            setMap(coursesMap);
            setCurrentTerm(
                termIndex === 0 ?
                    {
                        type: temp[Object.keys(temp)[0]].type,
                        year: temp[Object.keys(temp)[0]].year,
                        id: Object.keys(temp)[0]
                    } :
                    {
                        type: temp[Object.keys(temp)[termIndex - 1]].type,
                        year: temp[Object.keys(temp)[termIndex - 1]].year,
                        id: Object.keys(temp)[termIndex - 1]
                    }
            );
        } else {
            toast.error("Error deleting term. Please try again later.");
        }
    }

    
    return (
        <div className="h-[calc(100vh-4rem)] absolute">
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[999999]" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-cyan-50 pb-10 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-2xl w-full font-med ium leading-6 text-white bg-cyan-700 p-4 font-Poppins font-bold"
                                >
                                    Add term
                                </Dialog.Title>
                                <div className="mt-6 grid grid-cols-2 gap-2 px-10">
                                    {
                                        Object.keys(terms).map((termId, index) => {
                                            const next = getNextTerm(terms[termId].type, terms[termId].year);
                                            return (
                                                <Fragment
                                                    key={index}
                                                >
                                                    {
                                                        next.map((term, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-center justify-center p-2 py-3 font-Lato font-bold border bg-gre en-50 rounded cursor-pointer shadow hover:shadow-md transition-shadow"
                                                                onClick={() => handleAddTerm(term.type, term.year)}
                                                                style={{
                                                                    backgroundColor: term.type === "Fall" ? "rgb(239 246 255)" : term.type !== "Spring" ? "rgb(254 252 232)" : "rgb(240 253 244)",
                                                                }}
                                                            >
                                                                <div className="flex items-center flex-col justify-center content-center">
                                                                    <div>
                                                                        {
                                                                            term.type === "Fall" ?
                                                                                <SnowIcon height={35} width={35} className={"fill-blue-500 mx-4 ml-2"}/> :
                                                                                term.type !== "Spring" ?
                                                                                    <SunIcon height={25} width={25} className={"mx-4 ml-1"}/> :
                                                                                    <LeafIcon height={25} width={25} className="fill-green-500 mx-4 ml-2"/>
                                                                        }
                                                                    </div>
                                                                    <p 
                                                                        style={{
                                                                            color: term.type === "Fall" ? "rgb(30 58 138)" : term.type !== "Spring" ? "rgb(113 63 18)" : "rgb(20 83 45)",
                                                                        }}
                                                                    >
                                                                        {term.type} {term.year}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </Fragment>
                                            )
                                        })
                                    }
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            
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
                        <p onClick={openModal} className="font-Poppins text-xl font-extrabold text-center w-[90%] h-[90%] bg-cyan-900 hover:brightness-90 rounded flex flex-col justify-center cursor-pointer select-none">
                            +
                        </p>
                    </div>
                </div>
                <div
                    className="w-[21vw] overflow-hidden"
                    // style={{
                    //     background: `linear-gradient(90deg, #cffafe 21.8px, transparent 1%) center, linear-gradient(#cffafe 21.8px, transparent 1%) center, #000`,
                    //     backgroundSize: "23px 23px",
                    // }}
                >
                    <div className="w-full flex flex-row bg-cyan-800 items-center relative">
                        <div className="w-full mx-auto h-24 border-0 border-cyan-70 0 flex flex-col justify-end items-center round ed font-bold font-Poppins text-2xl">
                            <p>
                                {currentTerm.type + " " + currentTerm.year}
                            </p>
                            <div className="flex flex-row font-JetBrainsMono pb-4">
                                <p className="text-sm font-normal">
                                    {coursesMap.get(currentTerm.id)?.length} course{coursesMap.get(currentTerm.id)?.length === 1 ? "" : "s"} / 
                                </p>
                                <p className="text-sm font-bold" style={{color}}>
                                    &nbsp;{coursesMap.get(currentTerm.id)?.reduce((acc, course) => acc + info[course]?.credits, 0)} credits
                                </p>
                            </div>
                            <ProgressBar customLabelStyles={{display: 'none'}} completed={`${coursesMap.get(currentTerm.id)?.reduce((acc, course) => acc + info[course]?.credits, 0)}`} height="10px" borderRadius={'0.25rem 0 0 0'} maxCompleted={22} width="21vw" bgColor={color} />
                        </div>
                        <MenuButton handleClearTerm={handleClearTerm} handleDeleteTerm={handleDeleteTerm}/>
                    </div>
                    <div className="bg-cyan-800 w-full h-1 -z-10">
                        <div className="bg-white roun ded-tl h-2">
                            {/* Total credits: {coursesMap.get(currentTerm.id)?.reduce((acc, course) => acc + info[course]?.credits, 0)} */}
                        </div>
                    </div>
                    {/* <div className="bg-cyan-800 rounded-b ml-auto mr-2 w-fit px-2 font-Lato py-1 font-bold">
                        Total credits: {coursesMap.get(currentTerm.id)?.reduce((acc, course) => acc + info[course]?.credits, 0)}
                    </div> */}
                    <div className="w-full overflow-y-scroll h-[calc(100vh-9.2rem)] rounded">
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
                                <div className="h-full">
                                    {/* Display to the user: No courses added yet :( instead of displaying the courses */}
                                    <p className="text-black font-Lato text-center my-auto">
                                        No courses added yet <br/>:(
                                    </p>
                                </div>
                            )
                        }
                    </div>
                    <div className="bg-cyan-800 w-full h- 10 absolute bottom-0">
                        <div className="bg-wh ite rounded-bl h- 1">
                            <div className="h-full bg-transparent"/>
                            {/* Total credits: {coursesMap.get(currentTerm.id)?.reduce((acc, course) => acc + info[course]?.credits, 0)} */}
                        </div>
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