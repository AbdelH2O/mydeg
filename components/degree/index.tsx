import ReactFlow, { Background, Controls, Edge, MarkerType, MiniMap, Node, ReactFlowInstance } from 'reactflow';
import { SmartStepEdge } from '@tisoap/react-flow-smart-edge';
import CourseNode from './nodes/CourseNode';
import SelectorNode from './nodes/SelectorNode';
import 'reactflow/dist/style.css';
import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import SideBar from './SideBar';
import RightBar from './RightBar';
import Top from '../Top';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { useCourses } from '../../hooks/useCourses';
import { addCourse } from '../../utils/bridge';
import useSupabase from '../../hooks/useSupabase';
import { SIDEBAR } from '../../types/SideBar';
import checkIndex from '../../utils/util';
import Head from 'next/head';

const edgeTypes = {
    smart: SmartStepEdge
};

const Degree = () => {
    const nodeTypes = useMemo(() => ({ courseNode: CourseNode, selectorNode: SelectorNode }), []);
    // const [show, setShow] = useState(false);
    const [flow, setFlow] = useState<ReactFlowInstance>();
    // const ref = useRef<HTMLDivElement>();
    const { supabase } = useSupabase();
    const [ref, setRef] = useState<HTMLDivElement>();
    const onRefChange = useCallback((node: HTMLDivElement) => {
        if (node !== null) { 
            setRef(node);
            node.scrollTo(0, node.scrollHeight);
        }
    }, []);

    const { nodes, majorMinor, sideBar, edges, map, setMap, activeId, setActiveId, terms, req, colors, used, setUsed } = useCourses();

    const handleDragStart = (event: DragStartEvent) => {
        // console.log(event);
        let id = typeof(event.active.id) === 'string' ? event.active.id : event.active.id.toString();
        if(event.active.data.current?.children?.length > 0) {
            id = event.active.data.current!.children.filter((child: {selected: boolean}) => child.selected)[0].course;
        }
        setActiveId(id);
        const lowestIndex = req[event.active.id] ?
            terms[[
                ...req[event.active.id].map((r) => used[r])
            ].sort((a, b) => {
                if(a.year === b.year) {
                    const order = ["Spring", "Summer", "Fall"];
                    return order.indexOf(a.type) - order.indexOf(b.type);
                }
                return parseInt(a.year) - parseInt(b.year)
            })[0].type] :
            terms[Object.keys(terms)[0]];
        
        // ref && ref.scrollTo({ top: window.innerHeight * 0.35 * (Object.values(terms).indexOf(lowestIndex) | 0), behavior: 'smooth' });
    }    

    const handleDragEnd = (event: DragEndEvent) => {
        const {over, active} = event;        
        setActiveId('');
        
        if (over && over.id && active && active.id) {
            if(!map.get((over.id as string).slice(0, 36))?.includes(active.id as string)) {
                const courseId = active.data.current?.children ? active.data.current.children.find((child: {selected: boolean}) => child.selected).course : active.id;
                const index = Object.keys(terms).indexOf((over.id as string).slice(0, 36));
                if
                (
                    req[courseId] &&
                    !req[courseId]
                        .every(
                            (requirement) => used[requirement] !== undefined &&
                                            (checkIndex(Object.values(terms)[index], used[requirement]))
                        )
                ) {
                    return;
                }
                map.set(
                    (over.id as string).slice(0, 36),
                    [
                        ...map.get((over.id as string).slice(0, 36)) || [],
                        courseId
                    ]
                );
                addCourse((over.id as string).slice(0, 36), courseId, supabase);
                setUsed({...used, [courseId]: terms[(over.id as string).slice(0, 36)] });
                setMap(new Map(map));
            }
        }
    };

    return (
        <>
            <Head>
                <title>{majorMinor.major} degree | Compass</title>
            </Head>
            <div className='h-[calc(100vh-4rem)] mt-16 w-screen flex flex-col overflow-hidden'>
                <DndContext
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <Top />
                    <div className='flex-grow w-full flex flex-row justify-end bg-cyan-100 overflow-hidden'>
                        <SideBar onSideBarRefChange={onRefChange}/>
                        <div className='z-[999] overflow-hidden h-full shadow-2xl' style={{width: sideBar === SIDEBAR.NONE ? '98.5vw' : ( sideBar === SIDEBAR.COURSES ? '75vw' : '73.5vw'), position: 'relative', right: sideBar !== SIDEBAR.INFO ? 0 : '25vw', transition: 'all 0.3s ease-in-out'}}>
                            <DragOverlay
                                zIndex={100}
                                style={{
                                    animation: "resize 0.07s ease",
                                    "--scale": flow?.getZoom().toString(),
                                    height: "calc(100vh-4rem)",
                                    position: "fixed"
                                } as React.CSSProperties}
                                dropAnimation={{
                                    duration: 250,
                                    keyframes: (params) => {
                                        return [
                                            { opacity: 1 },
                                            { opacity: 0.5 },
                                        ]
                                    }
                                }}
                            >
                                {
                                    activeId ? (
                                        <div
                                            className="px-4 z-[9999999] py-2 border-2 rounded custom-drag-handle text-sm w-fit whitespace-nowrap"
                                            style={{
                                                    boxShadow: "-3px 5px #000",
                                                    backgroundColor: colors[activeId],
                                                    // borderColor: colors[activeId],
                                                    borderColor: 'black'
                                            }}
                                        >
                                            <div className="text-white font-JetBrainsMono bg-black px-1 rounded">
                                                {activeId}
                                            </div>
                                        </div>
                                    ) : null
                                }
                            </DragOverlay>
                            <ReactFlow
                                style={{background: '#cffafe', overflow: 'hidden', position: 'fixed'}}
                                nodes={nodes}
                                edges={edges}
                                fitView={true}
                                nodeTypes={nodeTypes}
                                draggable={false}
                                // className="[&>*]:backdrop-blur-xl"
                                id="reactflow"
                                onInit={(reactFlowInstance) => {
                                    setFlow(reactFlowInstance);
                                }}
                                edgeTypes={edgeTypes}
                            >
                                <Background 
                                    color="#000"
                                    // className='backdrop-blur-xl'
                                />
                                {/* <MiniMap 
                                    nodeColor={(node) => node.data.background}
                                    zoomable
                                    pannable
                                /> */}
                                <Controls />
                            </ReactFlow>
                        </div>
                        <RightBar />
                    </div>
                </DndContext>
            </div>
        </>
    );
};

export default Degree;
