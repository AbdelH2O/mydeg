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
    const style = transform
        ? {
            //   transform: CSS.Translate.toString(transform),
            opacity: 0.5,
          }
        : undefined;

    const { used, req } = useCourses();

    const unlocked = req[data.code] === undefined || req[data.code].every((r) => used[r] !== undefined);
    
    return (
        <div
            ref={!used.hasOwnProperty(data.code) && unlocked ? setNodeRef : undefined}
            {...listeners}
            {...attributes}
            className="px-4 py-2 border-2 border-black rounded"
            style={{
                ...style,
                ...{
                    boxShadow: `-3px 5px ${unlocked ? "#000" : "#000"}`,
                    backgroundColor: unlocked ? data.background : "#404040",
                    zIndex: 9999999,
                    transition: "all 0.2s ease-in-out",
                    opacity: used.hasOwnProperty(data.code) ? 0.5 : 1,
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
                }}
            />
        </div>
    );
};

export default memo(CourseNode);
