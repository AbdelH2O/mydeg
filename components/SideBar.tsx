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
    return (
        <>
            <div 
                className="h-full border border-sky-300/50 absolute z-50 resize-x"
                style={{left: show ? '25vw' : '2vw', transition: 'all 0.3s ease-in-out', cursor: show ? 'ew-resize' : 'auto'}}
                onMouseEnter={() => {if(!show) setHovering(true)}}
                onMouseLeave={() => {if(!show || hovering) setHovering(false)}}
            ></div>
            <div
                className={`bg-white h-full fixed left-0`}
                style={{width: show ? '25vw' : '2vw', cursor: !show ? 'pointer' : 'default', backdropFilter: hovering ? 'blur(4px)' : 'none', transition: 'all 0.3s ease-in-out'}}
                onClick={() => {if(!show) {setShow(!show);setHovering(false)}}}
                onMouseEnter={() => {if(!show) setHovering(true)}}
                onMouseLeave={() => {if(!show || hovering) setHovering(false)}}
            >
                <div className="w-full h-full flex flex-col justify-start items-center">
                    {
                        show ?
                        <div
                            className="bg-cyan-200 border-2 border-black w-32 h-10 mt-5 flex justify-center"
                            style={{ boxShadow: '-3px 5px #000' }}
                        >
                            <div className="flex flex-row justify-center items-center align-middle">
                                <p className="text-white bg-black px-1 rounded font-JetBrainsMono">BSCSC</p>
                            </div>
                        </div> :
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