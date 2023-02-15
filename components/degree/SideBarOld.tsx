import { useDroppable } from "@dnd-kit/core";
import Image from "next/image";
import React, { Dispatch, Fragment, MouseEventHandler, MutableRefObject, SetStateAction, useEffect } from "react";
import { useCourses } from "../../hooks/useCourses";
// import { defaultTerms } from "../../enums/terms";
import Droppable from "../Droppable";
import { addTerm, removeCourse } from "../../utils/bridge";
import { useRouter } from "next/router";
import useSupabase from "../../hooks/useSupabase";
import { SIDEBAR } from "../../types/SideBar";
import { Tab } from "@headlessui/react";
import {
    Info,
    PenIcon,
    TrashCan,
    SnowIcon,
    LeafIcon,
    SunIcon,
} from "../icons";
import { toast } from "react-toastify";
import { TERMS } from "../../types/Terms";
import checkIndex from "../../utils/util";

const TermHandler = ({
    terms,
    setTerms,
    map,
    setMap,
    id,
    supabase,
    majorMinor,
    helperWindow,
    setHelperWindow,
    addRef,
}:{
    terms: {[key: string]: { type: string, year: string }},
    setTerms: Dispatch<SetStateAction<{[key: string]: { type: string, year: string }}>>,
    map: Map<string, string[]>,
    setMap: Dispatch<SetStateAction<Map<string, string[]>>>,
    id: string | string[] | undefined,
    supabase: any,
    majorMinor: { term: { type: TERMS, year: string }, major: string, minor: string },
    helperWindow: {display: boolean, x: number, y: number},
    setHelperWindow: Dispatch<SetStateAction<{display: boolean, x: number, y: number}>>,
    addRef: MutableRefObject<HTMLDivElement | null>,
}) => {
    const handleAddTerm = async (termType: string, termYear: string) => {
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
            map.set(termId as string, []);
            setMap(map);
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
                    .reduce((r: {[key: string]: { type: string, year: string }},k)=>(r[k]=temp[k],r),{})
            );
            
        } else {
            toast.error("Error adding term. Please try again later.");
        }
    }

    const ref = React.useRef<HTMLDivElement>(null);
    const [height, setHeight] = React.useState(0);

    useEffect(() => {
        if(ref.current) {
            setHeight(ref.current.clientHeight);
        }
        function handleClick(e: MouseEvent) {
            if(helperWindow.display && !ref.current?.contains(e.target as Node) && !addRef.current?.contains(e.target as Node)) {                
                setHelperWindow({display: false, x: 0, y: 0});
            }
        }
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [ref, helperWindow.display]);

    const getNextTerm = (type: string, year: string) => {
        const yearPlus = (parseInt(year) + 1).toString();
        if(type === "Fall" && Object.values(terms).every(t => t.type !== "Spring" || t.year !== yearPlus)) {
            return [{type: "Spring", year: yearPlus}];
        }
        if(type === "Spring") {
            const ret = [];
            if(Object.values(terms).every(t => t.type !== "Fall" || t.year !== year)) {
                ret.push({type: "Fall", year});
            }
            if(Object.values(terms).every(t => t.type !== "Summer" || t.year !== year)) {
                ret.push({type: "Summer", year});
            }
            return ret;
        }
        return [];
    }

    return (
        <div
            className="absolute z-[999] h-fit text-black bg-transparent transition-all -translate-y-1/2 rounded"
            style={{
                top: Math.min(helperWindow.y, 9999999999),
                left: helperWindow.x,
                width: "12rem",
                // height: "",
                // backgroundColor: "white",
                // borderRadius: "0.5rem",
                // boxShadow: "0 0 0.5rem 0.5rem rgba(0,0,0,0.1)",
                zIndex: 100,
            }}
            ref={ref}
        >
            <div className="h-full grid grid-cols-1 gap-1 grid-rows-1 p-1">
                <div className="text-yellow-900 hidden"/>
                <div className="text-green-900 hidden"/>
                <div className="text-blue-900 hidden"/>
                {
                    Object.keys(terms).length !== 0 &&
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
                                            className="flex items-center justify-between p-2 py-3 font-Lato font-bold border bg-white rounded cursor-pointer shadow hover:shadow-md transition-shadow"
                                            onClick={() => handleAddTerm(term.type, term.year)}
                                        >
                                            <div className="flex items-center">
                                                <div>
                                                    {
                                                        term.type === "Fall" ?
                                                            <SnowIcon height={25} width={25} className={"fill-blue-500 mx-4 ml-2"}/> :
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
                {/* <div className="flex items-center justify-start border w-full p-2 py-3 shadow bg-white rounded text-green-900 font-Lato font-bold select-none cursor-pointer hover:shadow-md transition-shadow">
                    <LeafIcon  height={25} width={25} className="fill-green-500 mx-4 ml-2"/>
                    <p>
                        Spring 2021
                    </p>
                </div> */}
                {/* <div className="flex items-center justify-start border w-full p-2 py-3 shadow bg-white rounded text-green-900 font-Lato font-bold select-none cursor-pointer hover:shadow-md transition-shadow">
                    <LeafIcon  height={25} width={25} className="fill-green-500 mx-4 ml-2"/>
                    <p>
                        Spring 2021
                    </p>
                </div>
                <div className="flex items-center justify-start border w-full p-2 py-3 shadow bg-white rounded text-blue-900 font-Lato font-bold select-none cursor-pointer hover:shadow-md transition-shadow">
                    {/* <LeafIcon  height={20} width={20} className="fill-green-500 mx-4 ml-2"/> * /}
                    <SnowIcon height={32} width={32} className="fill-blue-500 mx-4 ml-1"/>
                    <p>
                        Fall 2021
                    </p>
                </div>
                <div className="flex items-center justify-start border w-full p-2 py-3 shadow bg-white rounded text-yellow-900 font-Lato font-bold select-none cursor-pointer hover:shadow-md transition-shadow">
                    {/* <LeafIcon  height={20} width={20} className="fill-green-500 mx-4 ml-2"/> * /}
                    <SunIcon height={32} width={32} className="mx-4 ml-1"/>
                    <p>
                        Summer 2021
                    </p>
                </div> */}
            </div>
        </div>
    );
}

const SideBar = (
    {
        onSideBarRefChange
    } : 
    {
        onSideBarRefChange: (node: HTMLDivElement) => void
    }
    
) => {
    const [hovering, setHovering] = React.useState(false);
    const [display, setDisplay] = React.useState(false);
    const [helperWindow, setHelperWindow] = React.useState({
        display: false,
        x: 0,
        y: 0,
    });
    const { terms, majorMinor, sideBar, setSideBar, setTerms, map, setMap, colors, used, setUsed, activeId, req } = useCourses();
    const { id } = useRouter().query;
    const { supabase } = useSupabase();
    const addRef = React.useRef<HTMLDivElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // console.log({
        //     pageX: event.pageX,
        //     pageY: event.pageY,
        //     clientX: event.clientX,
        //     clientY: event.clientY,
        //     screenX: event.screenX,
        //     screenY: event.screenY,
        // });
        setHelperWindow({
            display: true,
            x: event.clientX,
            y: event.clientY,
        });
    }

    const handleDeleteCourse: MouseEventHandler<HTMLDivElement> = async (e) => {
        e.preventDefault();
        delete used[(e.target as HTMLElement).innerText];
        setUsed(used);
        removeCourse((e.target as HTMLElement).dataset.term!, (e.target as HTMLElement).innerText, supabase);
        map.set((e.target as HTMLElement).dataset.term!, map.get((e.target as HTMLElement).dataset.term!)!.filter(c => c !== (e.target as HTMLElement).innerText));
        setMap(map);
        setTerms({...terms});
    }

    // Checks whether or not we can add the actively dragged element to the term at the specified index
    const addable = (index: number) => {
        // console.log(terms, req[activeId]);
        // console.log(req[activeId].map(r => used[r]));
        // req[activeId]?.forEach(r => {
        //     console.log(r, used[r]);
        // });
        return (
            !req[activeId] ||
            req[activeId]
                .every(
                    (requirement) => used[requirement] !== undefined && (checkIndex(Object.values(terms)[index], ["Fall", "Spring", "Summer"].includes(used[requirement].type) ? used[requirement] : terms[used[requirement].type]))
                )
        );
    }

    const show = sideBar === SIDEBAR.COURSES;

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
        if(sideBar === SIDEBAR.INFO && display) {
            setTimeout(() => {
                setDisplay(false);
            }, 300);
        }
    }, [sideBar]);

    return (
        <div className="h-[calc(100vh-4rem)] absolute">
            <div 
                className="h-full border border-sky-300/50 absolute z-[9999] resize-x"
                style={{right: show ? '75vw' : '98.5vw', transition: 'all 0.3s ease-in-out', cursor: show ? 'ew-resize' : 'auto'}}
                onMouseEnter={() => {if(!show) setHovering(true)}}
                onMouseLeave={() => {if(!show || hovering) setHovering(false)}}
            ></div>
            <div
                className={`bg-white h-[calc(100vh-4rem)] left-0 fixed z-50`}
                style={{width: '25vw', marginLeft: show ? '0' : '-23.5vw', cursor: !show ? 'pointer' : 'default', backdropFilter: hovering ? 'blur(4px)' : 'none', transition: 'all 0.3s ease-in-out'}}
                onClick={() => {if(!show) {handleClose}}}
                onMouseEnter={() => {if(!show) setHovering(true)}}
                onMouseLeave={() => {if(!show || hovering) setHovering(false)}}
            >
                <div className="w-full h-full flex flex-col justify-start items-center pb-2 overflow-y-scroll" ref={onSideBarRefChange}>
                    <Tab.Group>
                        <div className="flex w-full flex-row justify-center items-center px-4 py-3 transition-colors shadow-md font-Poppins bg-cyan-800">
                            <Tab.List className="flex flex-row justify-center items-center gap-4">
                                <Tab
                                    className={({ selected }) => `w-1/2 flex flex-row gap-2 items-center text-center py-1 px-4 rounded text-white font-bold ${selected ? 'bg-cyan-900' : 'bg-cyan-800'}`}
                                >
                                    {/* <Info height={30} width={30}/> */}
                                    Degree
                                    {/* <PenIcon height={30} width={30}/> */}
                                </Tab>
                                <Tab
                                    className={({ selected }) => `w-1/2 flex flex-row gap-2 items-center text-center py-1 px-4 rounded text-white font-bold ${selected ? 'bg-cyan-900' : 'bg-cyan-800'}`}
                                >
                                    Discard
                                    {/* <TrashCan height={30} width={30}/> */}
                                </Tab>
                            </Tab.List>
                        </div>
                            <Tab.Panels className="w-full h-full">
                                <Tab.Panel className="w-full h-full">
                                    {/* <div className="text-black font-Merriweather mx-4 mt-2 text-center text-md">
                                        Plan your degree with the courses you need to take.
                                    </div> */}
                                    <div className="flex-auto w-full">
                                        {
                                            Object.keys(terms).map((term, index) => {      
                                                // console.log(term);
                                                return (
                                                    <div className="min-h-[35vh] mx-4 rounded mt-4" key={term + index} style={{animation: 'resize 0.2s linear', '--scale': 0} as React.CSSProperties}>
                                                        <div
                                                            className="font-Poppins font-bold w-full h-10 flex flex-row rounded-t shadow-2xl justify-center items-center text-white bg-black"
                                                            style={{
                                                                backgroundColor: !activeId || !addable(index) ? 'black' : '#0891b2',
                                                                transition: 'background-color 0.3s ease'
                                                            }}
                                                        >
                                                            {terms[term].type + " " + terms[term].year}
                                                        </div>
                                                    <div
                                                        className="grid grid-cols-2 grid-rows-[75px_75px_75px] gap-2 m-2 p-2 rounded"
                                                        style={{
                                                            // backgroundColor: !activeId ? 'transparent' : '#dcfce7',
                                                            animation: !activeId || !addable(index) ? '' : 'bgColor 1s linear infinite',
                                                        }}
                                                    >
                                                        {
                                                            map.get(term)!.map((course, index) => {                                              
                                                                return (
                                                                    <div key={course + index} className="border border-dashed border-gray-300 rounded flex justify-center items-center bg-gray-100">
                                                                        <div
                                                                            className="px-4 py-2 relative border-2 rounded w-full my-auto h-full flex justify-center items-center"
                                                                            style={{
                                                                                boxShadow: "-3px 5px #000",
                                                                                backgroundColor: colors[course],
                                                                                zIndex: 9999999,
                                                                                transition: "all 0.2s ease-in-out",
                                                                                textAlign: "center",
                                                                                whiteSpace: "nowrap",
                                                                                borderColor: "#000",
                                                                            }}
                                                                            data-term={term}
                                                                            onContextMenu={handleDeleteCourse}
                                                                        >
                                                                            <div data-term={term} className="text-white text-lg font-JetBrainsMono bg-black p-2 rounded h-fit flex justify-center items-center">
                                                                                {course}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                        {
                                                            map.get(term)!.length < 6 ?
                                                            [...Array(6 - map.get(term)!.length)].map((_, index) => {            
                                                                return (
                                                                    <Fragment key={term+'empty'+index}>
                                                                        <Droppable
                                                                            // index={index}
                                                                            id={term + 'empty' + index}
                                                                            className="border border-dashed border-gray-300 rounded flex justify-center items-center bg-gray-100"
                                                                            // style={{
                                                                            //     backgroundColor: !activeId ? '#f3f4f6' : 'transparent',
                                                                            // }}
                                                                        />
                                                                    </Fragment>
                                                                );
                                                            }) :
                                                            ( map.get(term)!.length === 6 && 
                                                                <Fragment key={term+'empty7'}>
                                                                    <Droppable
                                                                        // index={7}
                                                                        id={term + 'empty7'}
                                                                        className="border border-dashed w-[144px] mx-auto col-span-2 h-[75px] border-gray-300 rounded flex justify-center items-center bg-gray-100"
                                                                        // style={{
                                                                        //     backgroundColor: !activeId ? '#f3f4f6' : 'transparent',
                                                                        // }}
                                                                    />
                                                                </Fragment>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                )
                                            })
                                        }
                                        {
                                            Object.keys(terms).length < 12 ?
                                            <div className="w-full h-16 px-4 mb-2" ref={addRef}>
                                                <div onClick={handleClick} className="w-full bg-cyan-50 border-cyan-200 border-dashed border h-full my-4 rounded flex justify-center items-center cursor-pointer hover:shadow-md transition-shadow">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height={40} width={40} fill={'#0891b2'}>
                                                        <g data-name="Layer 2">
                                                            <g data-name="plus-circle">
                                                                <rect width="24" height="24" opacity="0"/>
                                                                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm3 11h-2v2a1 1 0 0 1-2 0v-2H9a1 1 0 0 1 0-2h2V9a1 1 0 0 1 2 0v2h2a1 1 0 0 1 0 2z"/>
                                                            </g>
                                                        </g>
                                                    </svg>
                                                </div>
                                            </div> :
                                            <></>
                                        }
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel className="w-full h-full">
                                    
                                </Tab.Panel>
                            </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
            {/* <div className="h-full border border-neutral-300 absolute left-[2vw] z-50 cursor-ew-resize hover:brightness-105 hover:"></div> */}
            <div className="group h-fit w-screen">
                <div className="w-[25vw] h-[calc(100vh-4rem)] bg-white z-[99] absolute peer cursor-pointer" style={{display: !display ? 'block' : 'none', marginLeft: show ? '0' : '-23.5vw'}} onClick={handleClose}></div>
                <div
                    className={`z-[9999] group-hover:bg-cyan-500 peer-hover:bg-cyan-500 top-1/2 absolute translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full shadow-xl bg-white cursor-pointer `}
                    style={{
                        right: show ? '75vw' : '98.5vw',
                        transition: 'all 0.3s ease-in-out, background-color 0.1s ease-in-out, fill 0.1s ease-in-out',
                        // backgroundColor: !hovering ? 'white' : '#0e7490',
                        // filter: !hovering ? 'brightness(100%)' : 'brightness(110%)',
                        // boxShadow: '-3px 5px #000',
                    }}
                    onClick={handleClose}
                    // onMouseEnter={() => setHovering(true)}
                    // onMouseLeave={() => setHovering(false)}
                >
                    <svg className="group-hover:fill-white peer-hover:fill-white fill-black" fill={!hovering ? 'black' : 'white'} 
                        // onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} 
                        style={{transform: show ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'all 0.1s ease-in-out'}} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 64 64" viewBox="0 0 64 64">
                        <path
                            className={"cursor-pointer group-hover:fill-current group-hover:text-white peer-hover:fill-current peer-hover:text-white"}
                            // style={{fill: hovering ? '#ffffff' : '#000000', transition: 'all 0.3s ease-in-out, fill 0.2s ease-in-out'}}
                            d="m-210.9-289-2-2 11.8-11.7-11.8-11.7 2-2 13.8 13.7-13.8 13.7"
                            transform="translate(237 335)"
                            // onMouseEnter={() => setHovering(true)}
                            // onMouseLeave={() => setHovering(false)}
                        />
                    </svg>
                </div>
            </div>
            <div className="relative z-[999999999]">
                {
                    helperWindow.display &&
                    <TermHandler 
                        terms={terms}
                        setTerms={setTerms}
                        map={map}
                        setMap={setMap}
                        id={id}
                        supabase={supabase}
                        majorMinor={majorMinor}
                        helperWindow={helperWindow}
                        setHelperWindow={setHelperWindow}
                        addRef={addRef}
                    />
                }
            </div>
        </div>
    );
};

export default SideBar;
