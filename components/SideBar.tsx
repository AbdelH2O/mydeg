import { useDroppable } from "@dnd-kit/core";
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";
import { useCourses } from "../hooks/useCourses";
import styles from "../styles/sideBar.module.css";
import { defaultTerms } from "../enums/terms";
import Droppable from "./Droppable";
import { addTerm } from "../utils/bridge";
import { useRouter } from "next/router";

const SideBar = (
    {
        show,
        setShow
    } : 
    {
        show: boolean,
        setShow: Dispatch<SetStateAction<boolean>>
    }
    
) => {
    const [hovering, setHovering] = React.useState(false);
    const { terms, setTerms, map, setMap, colors} = useCourses();
    const { id } = useRouter().query;

    const handleAddTerm = async () => {
        const term = Object.keys(defaultTerms)[Object.keys(terms).length];
        const { id: termId, success } = await addTerm(id as string, term);
        if(success) {
            console.log({...terms, [termId as string]: term});
            map.set(termId as string, []);
            setMap(map);
            setTerms({...terms, [termId as string]: term});
            
        } else {
            // TODO: handle error
        }
    }

    return (
        <>
            <div 
                className="h-full border border-sky-300/50 absolute z-20 resize-x"
                style={{left: show ? '25vw' : '2vw', transition: 'all 0.3s ease-in-out', cursor: show ? 'ew-resize' : 'auto'}}
                onMouseEnter={() => {if(!show) setHovering(true)}}
                onMouseLeave={() => {if(!show || hovering) setHovering(false)}}
            ></div>
            <div
                className={`bg-white h-[calc(100%-3.5rem)] fixed left-0`}
                style={{width: show ? '25vw' : '2vw', cursor: !show ? 'pointer' : 'default', backdropFilter: hovering ? 'blur(4px)' : 'none', transition: 'all 0.3s ease-in-out'}}
                onClick={() => {if(!show) {setShow(!show);setHovering(false)}}}
                onMouseEnter={() => {if(!show) setHovering(true)}}
                onMouseLeave={() => {if(!show || hovering) setHovering(false)}}
            >
                <div className="w-full h-full flex flex-col justify-start items-center pb-2 overflow-y-scroll">
                    {
                        show ?
                        <>
                            <div className="flex-auto w-full">
                                {
                                    Object.keys(terms).map((term, index) => {
                                        
                                        return (
                                            <div className="min-h-[18vh] mx-4 rounded mt-4" key={term + index} style={{animation: 'resize 0.2s linear', '--scale': 0}}>
                                                <div className="font-Poppins font-bold w-full h-10 flex flex-row rounded-t shadow-2xl justify-center items-center text-white bg-black">
                                                    {terms[term]}
                                                </div>
                                            <div className="grid grid-cols-2 grid-rows-[75px_75px_75px] gap-2 m-2">
                                                {
                                                    map.get(term)!.map((course, index) => {                                              
                                                        return (
                                                            <div key={course + index} className="border border-dashed border-gray-300 rounded flex justify-center items-center bg-gray-100">
                                                                <div
                                                                    className="px-4 py-2 border-2 border-black rounded w-full my-auto h-full flex justify-center items-center"
                                                                    style={{
                                                                        // boxShadow: "-3px 5px #000",
                                                                        backgroundColor: colors[course],
                                                                        zIndex: 9999999,
                                                                        transition: "all 0.2s ease-in-out",
                                                                        textAlign: "center",
                                                                        whiteSpace: "nowrap"
                                                                    }}
                                                                >
                                                                    <div className="text-white text-lg font-JetBrainsMono bg-black p-2 rounded h-fit flex justify-center items-center">
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
                                                            // The key prop is set inside the Droppable component using the id prop
                                                            // eslint-disable-next-line react/jsx-key
                                                            <Droppable index={index} id={term + 'empty' + index}>
                                                            </Droppable>
                                                        );
                                                    }) :
                                                    null
                                                }
                                            </div>
                                        </div>
                                        )
                                    })
                                }
                                {
                                    Object.keys(terms).length < 8 ?
                                    <div className="w-full h-16 px-4 mb-2">
                                        <div onClick={handleAddTerm} className="w-full bg-cyan-100 border-cyan-300 border-dashed border h-full my-4 rounded flex justify-center items-center cursor-pointer">
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
                        </> :
                        <></>
                    }
                </div>
            </div>
            {/* <div className="h-full border border-neutral-300 absolute left-[2vw] z-50 cursor-ew-resize hover:brightness-105 hover:"></div> */}
            <div
                className={`z-[999999] top-1/2 absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full shadow-xl bg-white cursor-pointer `}
                style={{
                    left: show ? '25vw' : '2vw',
                    transition: 'all 0.3s ease-in-out, background-color 0s',
                    // backgroundColor: !hovering ? 'white' : '#5eead4',
                    filter: !hovering ? 'brightness(100%)' : 'brightness(110%)',
                    // boxShadow: '-3px 5px #000',
                }}
                onClick={() => setShow(!show)}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
            >
                <svg style={{transform: show ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'all 0.3s ease-in-out'}} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 64 64" viewBox="0 0 64 64">
                    <path
                        className={"cursor-pointer "}
                        // style={{fill: hovering ? '#ffffff' : '#000000', transition: 'all 0.3s ease-in-out, fill 0.2s ease-in-out'}}
                        d="m-210.9-289-2-2 11.8-11.7-11.8-11.7 2-2 13.8 13.7-13.8 13.7"
                        transform="translate(237 335)"
                        onMouseEnter={() => setHovering(true)}
                        onMouseLeave={() => setHovering(false)}
                    />
                </svg>
            </div>
        </>
    );
};

export default SideBar;