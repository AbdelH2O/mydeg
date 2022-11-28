import { useDroppable } from "@dnd-kit/core";
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";
import styles from "../styles/sideBar.module.css";

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
    const {isOver, setNodeRef} = useDroppable({
        id: 'droppable',
    });
    const style = {
        color: isOver ? 'green' : undefined,
    };
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
                            {/* <div className="w-full h-16 bg-white flex flex-col justify-center items-center z-10">
                                <div
                                    className="w-32 h-20 my-5 flex justify-center rounded"
                                    // style={{ boxShadow: '-3px 5px #000' }}
                                >
                                    <div className="flex flex-row justify-start items-center bg-white align-middle h-fit rounded">
                                        <p
                                            className="font-JetBrainsMono font-extrabold px-6 py-2 rounded text-2xl text-cyan-900"
                                            // style={{
                                            //     background: 'linear-gradient(to right, #b91c1c, #6d28d9, #ca8a04, #b91c1c)',
                                            //     WebkitBackgroundClip: 'text',
                                            //     WebkitTextFillColor: 'transparent',
                                            //     whiteSpace: 'nowrap',
                                            //     backgroundSize: '200%',
                                            //     animation: 'background-pan 1.5s linear infinite',
                                            // }}
                                        >
                                            BSCSC
                                        </p>
                                    </div>
                                </div>
                                {/* <div className="border-b -mt-2 mb-2 bg-white w-[80%] mx-auto border-neutral-200 rounded"></div> 
                            </div> */}
                            {/* <div className="border-b w-full mx-auto border-neutral-300 shadow-2xl"></div> */}
                            <div className="flex-auto w-full">
                                <div className="min-h-[18vh] mx-4 rounded mt-4">
                                        <div className="font-Poppins font-bold w-full h-10 flex flex-row rounded-t shadow-2xl justify-center items-center text-white bg-black">
                                            Freshman S1
                                        </div>
                                    <div className="grid grid-cols-2 grid-rows-[75px_75px_75px] gap-2 m-2">
                                        <div style={style} ref={setNodeRef} className="border border-dashed border-gray-300 rounded flex justify-center items-center bg-gray-100 cursor-pointer">

                                        </div>
                                        <div className="border border-dashed border-gray-300 rounded flex justify-center items-center bg-gray-100 cursor-pointer">
                                        </div>
                                        <div className="border border-dashed border-gray-300 rounded flex justify-center items-center bg-gray-100 cursor-pointer">

                                        </div>
                                        <div className="border border-dashed border-gray-300 rounded flex justify-center items-center bg-gray-100 cursor-pointer">
                                        </div>
                                        <div className="border border-dashed border-gray-300 rounded flex justify-center items-center bg-gray-100 cursor-pointer">

                                        </div>
                                        <div className="border border-dashed border-gray-300 rounded flex justify-center items-center bg-gray-100 cursor-pointer">
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b w-[90%] mt-4 mx-auto border-neutral-200 shadow-2xl rounded"></div>
                                {/* <div className="min-h-[18vh] mx-4 rounded mt-4">
                                        <div className="font-Poppins font-bold w-full h-10 flex flex-row rounded-t shadow-2xl justify-center items-center text-white bg-black">
                                            Freshman S2
                                        </div>
                                    <div className="grid grid-cols-2 grid-rows-[75px_minmax(100px,_1fr)_100px] gap-2 m-2">
                                        <div className="h-30 border border-dashed border-cyan-300 rounded flex justify-center items-center bg-cyan-100 cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height={40} width={40} fill={'#0891b2'}>
                                                <g data-name="Layer 2">
                                                    <g data-name="plus-circle">
                                                        <rect width="24" height="24" opacity="0"/>
                                                        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm3 11h-2v2a1 1 0 0 1-2 0v-2H9a1 1 0 0 1 0-2h2V9a1 1 0 0 1 2 0v2h2a1 1 0 0 1 0 2z"/>
                                                    </g>
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b w-[90%] mt-4 mx-auto border-neutral-200 shadow-2xl"></div>
                                <div className="min-h-[18vh] mx-4 rounded mt-4">
                                    <div className="font-Poppins font-bold w-full h-10 flex flex-row rounded-t shadow-2xl justify-center items-center text-white bg-black">
                                        Sophomore S1
                                    </div>
                                    <div className="grid grid-cols-2 grid-rows-[75px_minmax(100px,_1fr)_100px] gap-2 m-2">
                                        <div className="h-30 border border-dashed border-cyan-300 rounded flex justify-center items-center bg-cyan-100 cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height={40} width={40} fill={'#0891b2'}>
                                                <g data-name="Layer 2">
                                                    <g data-name="plus-circle">
                                                        <rect width="24" height="24" opacity="0"/>
                                                        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm3 11h-2v2a1 1 0 0 1-2 0v-2H9a1 1 0 0 1 0-2h2V9a1 1 0 0 1 2 0v2h2a1 1 0 0 1 0 2z"/>
                                                    </g>
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b w-[90%] mt-4 mx-auto border-neutral-200 shadow-2xl"></div> */}
                                
                                <div className="w-full h-16 px-4 mb-2">
                                    <div className="w-full bg-cyan-100 border-cyan-300 border-dashed border h-full my-4 rounded flex justify-center items-center cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height={40} width={40} fill={'#0891b2'}>
                                            <g data-name="Layer 2">
                                                <g data-name="plus-circle">
                                                    <rect width="24" height="24" opacity="0"/>
                                                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm3 11h-2v2a1 1 0 0 1-2 0v-2H9a1 1 0 0 1 0-2h2V9a1 1 0 0 1 2 0v2h2a1 1 0 0 1 0 2z"/>
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
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
                <svg style={{transform: show ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'all 0.3s ease-in-out'}} xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 64 64" viewBox="0 0 64 64">
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