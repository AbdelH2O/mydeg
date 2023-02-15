import { useDraggable } from "@dnd-kit/core";
import React, { FC, memo, useEffect } from "react";
import { Handle, NodeProps, Position, WrapNodeProps } from "reactflow";
import { useCourses } from "../../../hooks/useCourses";
import { SIDEBAR } from "../../../types/SideBar";
import { abreviations } from "../../../enums/abr";

const SelectorNode: FC<NodeProps> = ({ data, dragHandle }) => {
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
    // console.log(listeners);

    

    const { used, req, sideBar, setSideBar, setInfoCourse, infoCourse } = useCourses();
    const selected = (data.children as { course: string, selected: boolean, color: string }[]).find((child) => child.selected);
    // console.log({selected, children: data.children});
    
    const unlocked = !selected || (selected && (req[selected.course] === undefined || req[selected.course].every((r) => used[r] !== undefined)));
    const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {   
        if(sideBar !== SIDEBAR.INFO) setSideBar(SIDEBAR.INFO);
        if(infoCourse.id !== data.code) setInfoCourse({ id: data.code, credits: data.credits, name: data.name, children: data.children });
        listeners && listeners.onKeyDown(e);
    };

    const atrr = selected && sideBar === SIDEBAR.COURSES ? { ...attributes, ...listeners } : {};
    
    return (
        <div
            ref={
                selected ?
                (
                    (!used.hasOwnProperty(data.code) && unlocked && sideBar === SIDEBAR.COURSES) ?
                    setNodeRef :
                    undefined
                ) :
                undefined
            }
            {...atrr}
            onClick={handleClick}
            className="px-[18px] py-[10px] border border-black rounded overflow-hidden relative"
            style={{
                ...style,
                ...{
                    boxShadow: `-3px 5px ${!selected ? data.background : "#000"}`,
                    // background: unlocked ? "linear-gradient(to right, rgb(185, 28, 28), rgb(109, 40, 217), rgb(202, 138, 4), rgb(185, 28, 28)) 0% 0% / 200%" : "#404040",
                    background: unlocked ? (selected ? selected.color :"#171717") : "#404040",
                    animation: "1.5s linear 0s infinite normal none running background-pan",
                    zIndex: 9999999,
                    transition: "all 0.2s ease-in-out",
                    opacity: selected && used.hasOwnProperty(selected?.course) ? 0.5 : 1,
                    cursor: sideBar !== SIDEBAR.COURSES ? "pointer" : (used.hasOwnProperty(data.code) || !unlocked ? "not-allowed" : "grab"),
                    // filter: !unlocked ? "grayscale(100%)" : "none",
                    borderColor: "#000",
                    // border: '1px',
                    // borderRadius: "0.25rem",
                },
            }}
        >
            <div 
                className="text-white font-JetBrainsMono px-1 rounded" 
                style={{
                    background: selected ? '#000' : "",
                    color: !selected ? data.background : "#fff",
                }}
            >
                {
                    selected ?
                    data.children.find((child: { course: string, selected: boolean }) => child.selected)?.course :
                    (
                        data.code in abreviations ?
                        abreviations[data.code] :
                        data.code
                    )
                }
            </div>
            <div
                className="shine"
                style={{
                    "--start-color": unlocked && selected ? "#fff" : data.background + "00",
                    "--step1-color": unlocked && selected ? "#fff" : data.background + "80",
                    "--step2-color": unlocked && selected ? "#fff" : data.background + "20",
                    "--end-color": unlocked && selected ? "#fff" : data.background + "00",
                    "--opacity": unlocked && selected ? 0.4 : 0.8,
                } as React.CSSProperties}
            />
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

export default memo(SelectorNode);
