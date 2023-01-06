import { useDroppable } from "@dnd-kit/core";
import Image from "next/image";
import React, { Dispatch, Fragment, MouseEventHandler, MutableRefObject, SetStateAction } from "react";
import { useCourses } from "../hooks/useCourses";
import styles from "../styles/sideBar.module.css";
import { defaultTerms } from "../enums/terms";
import Droppable from "./Droppable";
import { addTerm, removeCourse } from "../utils/bridge";
import { useRouter } from "next/router";
import useSupabase from "../hooks/useSupabase";

const SideBar = (
    {
        show,
        setShow,
        onSideBarRefChange
    } : 
    {
        show: boolean,
        setShow: Dispatch<SetStateAction<boolean>>,
        onSideBarRefChange: (node: HTMLDivElement) => void
    }
    
) => {
    const [hovering, setHovering] = React.useState(false);
    const [display, setDisplay] = React.useState(false);
    const { terms, setTerms, map, setMap, colors, used, setUsed, activeId, req } = useCourses();
    const { id } = useRouter().query;
    const { supabase } = useSupabase();

    const handleAddTerm = async () => {
        const term = Object.keys(defaultTerms)[Object.keys(terms).length];
        const { id: termId, success } = await addTerm(id as string, term, supabase);
        if(success) {
            map.set(termId as string, []);
            setMap(map);
            setTerms({...terms, [termId as string]: term});
            
        } else {
            // TODO: handle error
        }
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
        console.log(req[activeId], used[activeId], activeId, index);
        req[activeId] && req[activeId].forEach((requirement) => {
            console.log(requirement, used[requirement], index);
            
        });
        return (
            !req[activeId] ||
            req[activeId]
                .every(
                    (requirement) => used[requirement] !== undefined && (used[requirement] < index)
                )
        );
    }

    const handleClose = () => {
        if(show) {
            setShow(!show);
            setHovering(false);
            setTimeout(() => {
                setDisplay(!display);
            }, 300);
        } else {
            setDisplay(!display);
            setShow(!show);
            setHovering(false);
        }
    }

    return (
        <div className="h-[calc(100vh-4rem)] absolute">
            <div 
                className="h-full border border-cyan-800 absolute z-[9999] resize-x"
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
                    {/* {
                        show ?
                        <> */}
                            <div className="flex-auto w-full">
                                {
                                    Object.keys(terms).map((term, index) => {                                        
                                        return (
                                            <div className="min-h-[35vh] mx-4 rounded mt-4" key={term + index} style={{animation: 'resize 0.2s linear', '--scale': 0} as React.CSSProperties}>
                                                <div
                                                    className="font-Poppins font-bold w-full h-10 flex flex-row rounded-t shadow-2xl justify-center items-center text-white bg-black"
                                                    style={{
                                                        backgroundColor: !activeId || !addable(index) ? 'black' : '#0891b2',
                                                        transition: 'background-color 0.3s ease'
                                                    }}
                                                >
                                                    {terms[term]}
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
                                                                    index={index}
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
                                                                index={7}
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
                                    Object.keys(terms).length < 8 ?
                                    <div className="w-full h-16 px-4 mb-2">
                                        <div onClick={handleAddTerm} className="w-full bg-cyan-100 border-cyan-300 border-dashed border h-full my-4 rounded flex justify-center items-center cursor-pointer hover:shadow-xl transition-shadow">
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
                                    null
                                }
                            </div>
                        {/* </> :
                        <></>
                    } */}
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
        </div>
    );
};

export default SideBar;