import { useDraggable } from "@dnd-kit/core";
import React, { FC, memo } from "react";
import { Handle, NodeProps, Position, WrapNodeProps } from "reactflow";
import { CSS } from "@dnd-kit/utilities";
import { CustomNode } from "../types";
import { useCourses } from "../hooks/useCourses";

const CourseNode: FC<NodeProps> = ({ data, dragHandle }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: data.code,
        data: data,
    });
    
    const { used, req } = useCourses();
    
    const unlocked =
    req[data.code] === undefined ||
    req[data.code].every((r) => used[r] !== undefined);
    
    const style = !unlocked
        ? {
              //   transform: CSS.Translate.toString(transform),
            boxShadow: '0'

        } as React.CSSProperties
        : {};

    return (
        // <div
        //     // style={{
        //     //     borderRadius: "0.3rem",
        //     //     borderWidth: "0.15rem",
        //     //     borderColor: "black",
        //     // }}
        // >
        <>
            <div
                ref={
                    !used.hasOwnProperty(data.code) && unlocked
                        ? setNodeRef
                        : undefined
                }
                {...listeners}
                {...attributes}
                className={`px-4 py-2 border-black ${unlocked && !used.hasOwnProperty(data.code) ? `` : ""}`}
                style={{
                    // ...style,
                    ...{
                        // boxShadow: `-3px 5px #000`,
                        backgroundColor: used.hasOwnProperty(data.code)
                            ? "#15803d"
                            : "#232323",
                        // backgroundColor: used.hasOwnProperty(data.code)
                        //     ? data.background
                        //     : unlocked
                        //     ? // ? "#1C1C1C"
                        //       "#262626"
                        //     : data.background,
                        // backgroundColor: unlocked ? 'white' : "#404040",
                        // backgroundColor: "white",
                        zIndex: 9999999,
                        transition: "all 0.2s ease-in-out",
                        filter: used.hasOwnProperty(data.code) ? "brightness(75%)" : "none",
                        // opacity: used.hasOwnProperty(data.code) ? 0.5 : 1,
                        cursor:
                            used.hasOwnProperty(data.code) || !unlocked
                                ? "not-allowed"
                                : "grab",
                        // filter: !unlocked ? "grayscale(100%)" : "none",
                        // borderColor: "#000",
                        // borderColor: "#404040",
                        borderLeftColor: used.hasOwnProperty(data.code) ? "#15803d" :unlocked ? data.background : "#232323",
                        borderLeftWidth: "0.4rem",
                        // borderRightColor: unlocked ? data.background : "#404040",
                        // borderRadius: "0.25rem",
                    },
                }}
            >
                <div
                    className="text-white font-bold font-JetBrainsMono px-1 rounded"
                    style={{
                        color: (unlocked ? "white" : "#525252"),
                    }}
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
opacity: 0,
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
opacity: 0,
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
opacity: 0,
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
opacity: 0,
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
opacity: 0,
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
opacity: 0,
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
opacity: 0,
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
opacity: 0,
                    }}
                />
                {/* a circle at the bottom center of the parent */}
                
        </div>
        <div className="flex justify-center -z-10 absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
                className="rounded-full bg-neutral-400"
                style={{
                    width: "0.75rem",
                    height: "0.75rem",
                    backgroundColor: used.hasOwnProperty(data.code) ? "#15803d" : data.background,
                    display: unlocked ? "block" : "none",
                }}
            ></div>
        </div>
        </>
    );
};

export default memo(CourseNode);
