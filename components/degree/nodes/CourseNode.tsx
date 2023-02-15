import { useDraggable } from "@dnd-kit/core";
import React, { FC, memo } from "react";
import { Handle, NodeProps, Position, WrapNodeProps } from "reactflow";
import { useCourses } from "../../../hooks/useCourses";
import { SIDEBAR } from "../../../types/SideBar";
import checkIndex from "../../../utils/util";

const CourseNode: FC<NodeProps> = ({ data, dragHandle }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: data.code,
        data: data,
    });
    const style = transform
        ? {
            //   transform: CSS.Translate.toString(transform),
            opacity: 0.5,
        }
        : undefined;

    const { used, currentTerm, majorMinor, infoCourse, setInfoCourse, sideBar, setSideBar, req } = useCourses();

    const atrr = sideBar === SIDEBAR.COURSES ? { ...attributes, ...listeners } : {};
    const unlocked =
        (
            req[data.code] === undefined &&
            majorMinor.term.type === currentTerm.type &&
            majorMinor.term.year === currentTerm.year
        ) ||
        (
            req[data.code] !== undefined &&
            req[data.code].every((r) => used[r] !== undefined && checkIndex(currentTerm, used[r]))
        );

    const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {        
        if(sideBar !== SIDEBAR.INFO) setSideBar(SIDEBAR.INFO);
        if(infoCourse.id !== data.code) setInfoCourse({ id: data.code, credits: data.credits, name: data.name });
        listeners && listeners.onKeyDown(e);
    };
    console.log(data.code === "MTH 1303" ? checkIndex(currentTerm, used[data.code]) : "");
    // console.log(data.code === "MTH 2301" ? checkIndex(currentTerm, used[data.code]) : "");
    
    
    return (
        <div
            ref={!used.hasOwnProperty(data.code) && unlocked && sideBar === SIDEBAR.COURSES ? setNodeRef : undefined}
            {...atrr}
            onClick={handleClick}
            className="px-4 py-2 border-2 border-black rounded blurred"
            style={{
                ...style,
                ...{
                    boxShadow: `-3px 5px #000`,
                    backgroundColor: used.hasOwnProperty(data.code) && checkIndex(currentTerm, used[data.code]) ? "green" : (unlocked && checkIndex(currentTerm, used[data.code]) ? data.background : "#404040"),
                    zIndex: 9999999,
                    transition: "all 0.2s ease-in-out",
                    // opacity: used.hasOwnProperty(data.code) ? 0.5 : 1,
                    cursor: used.hasOwnProperty(data.code) || !unlocked ? "not-allowed" : "grab",
                    // filter: !unlocked ? "grayscale(100%)" : "none",
                    borderColor: "#000",
                    // borderRadius: "0.25rem",
                },
            }}
        >
            <div 
                className="text-white font-JetBrainsMono bg-black px-1 rounded" 
            >
                {data.code}
            </div>
            <Handle
                type="target"
                position={Position.Right}
                id={data.code + "tarRight"}
                // style={{ display: 'none' }}
                style={{
                    height: "0.01px!important",
                    width: "0.01px!important",
                    border: "1px solid black",
                    zIndex: -10,
                    opacity: 0
                }}
            />
            <Handle
                type="source"
                position={Position.Right}
                id={data.code + "right"}
                // style={{ display: 'none' }}
                style={{
                    height: "0.01px!important",
                    width: "0.01px!important",
                    border: "1px solid black",
                    zIndex: -10,
                    opacity: 0
                }}
            />
            <Handle
                type="target"
                position={Position.Left}
                id={data.code + "tarLeft"}
                // style={{ display: 'none' }}
                style={{
                    backgroundColor: "white",
                    height: "0.01px!important",
                    width: "0.01px!important",
                    border: "1px solid black",
                    zIndex: -10,
                    opacity: 0
                }}
            />
            <Handle
                type="source"
                position={Position.Left}
                id={data.code + "left"}
                // style={{ display: 'none' }}
                style={{
                    backgroundColor: "white",
                    height: "0.01px!important",
                    width: "0.01px!important",
                    border: "1px solid black",
                    zIndex: -10,
                    opacity: 0
                }}
            />
            <Handle
                type="target"
                position={Position.Top}
                id={data.code + "tarTop"}
                // style={{ display: 'none' }}
                style={{
                    backgroundColor: "white",
                    height: "0.01px!important",
                    width: "0.01px!important",
                    border: "1px solid black",
                    zIndex: -10,
                    opacity: 0
                }}
            />
            <Handle
                type="source"
                position={Position.Top}
                id={data.code + "top"}
                className="bg-blue-100"
                // style={{ display: 'none' }}
                style={{
                    height: "0.01px!important",
                    width: "0.01px!important",
                    border: "1px solid black",
                    zIndex: -10,
                    opacity: 0
                }}
            />
            <Handle
                type="target"
                position={Position.Bottom}
                id={data.code + "tarBottom"}
                style={{
                    backgroundColor: "white",
                    height: "0.01px!important",
                    width: "0.01px!important",
                    border: "1px solid black",
                    zIndex: -10,
                    opacity: 0
                }}
                // style={{ backgroundColor: 'white', height: '0.01px!important', width: '0.01px!important' }}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id={data.code + "bottom"}
                style={{
                    backgroundColor: "white",
                    height: "0.01px!important",
                    width: "0.01px!important",
                    border: "1px solid black",
                    zIndex: -10,
                    opacity: 0
                }}
            />
        </div>
    );
};

export default memo(CourseNode);
