import ReactFlow, { Background, Controls, Edge, MarkerType, MiniMap, Node, ReactFlowInstance } from 'reactflow';
// import { SmartStepEdge } from '@tisoap/react-flow-smart-edge';
import CourseNode from '../../components/CourseNode';
import 'reactflow/dist/style.css';
import { useEffect, useMemo, useState } from 'react';
import SideBar from '../../components/SideBar';
import Top from '../../components/Top';
import { DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core';
import { useCourses } from '../../hooks/useCourses';
import { addCourse } from '../../utils/bridge';

const Degree = () => {
    const nodeTypes = useMemo(() => ({ courseNode: CourseNode }), []);
    // const edgeTypes = {
    //     smart: SmartStepEdge
    // };
    const [show, setShow] = useState(false);
    const [flow, setFlow] = useState<ReactFlowInstance>();

    const { nodes, edges, map, setMap, activeId, setActiveId, colors, used, setUsed } = useCourses();

    const handleDragEnd = (event: DragEndEvent) => {
        const {over, active} = event;
        setActiveId('');
        if (over && over.id && active && active.id) {
            if(!map.get((over.id as string).slice(0, 36))?.includes(active.id as string)) {
                map.set(
                    (over.id as string).slice(0, 36),
                    [
                        ...map.get((over.id as string).slice(0, 36)) || [],
                        active.id as string
                    ]
                );
                addCourse((over.id as string).slice(0, 36), active.id as string);
                setUsed({...used, [active.id as string]: true});
                setMap(new Map(map));
            }
        }
    };

    return (
        <div className='h-screen w-screen flex flex-col overflow-hidden'>
            <DndContext
                onDragStart={(e) => setActiveId(typeof(e.active.id) === 'string' ? e.active.id : e.active.id.toString())}
                onDragEnd={handleDragEnd}
            >
                <Top />
                <div className='flex-grow w-full flex flex-row justify-end bg-cyan-100'>
                    <SideBar show={show} setShow={setShow} />
                    <div className='z-10 overflow-hidden h-full shadow-2xl' style={{width: show ? '75vw' : '98vw', transition: 'all 0.3s ease-in-out'}}>
                        <DragOverlay
                            zIndex={100}
                            style={{
                                animation: "resize 0.07s ease",
                                "--scale": flow?.getZoom().toString(),
                            } as React.CSSProperties}
                            dropAnimation={{
                                duration: 500,
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
                                        className="px-4 z-50 py-2 border-2 border-black custom-drag-handle text-sm w-fit whitespace-nowrap"
                                        style={{
                                                boxShadow: "-3px 5px #000",
                                                backgroundColor: colors[activeId],
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
                            style={{background: '#cffafe'}}
                            nodes={nodes}
                            edges={edges}
                            fitView={true}
                            nodeTypes={nodeTypes}
                            draggable={false}
                            onInit={(reactFlowInstance) => {
                                setFlow(reactFlowInstance);
                            }}
                            // edgeTypes={edgeTypes}
                        >
                            <Background 
                                color="#000"
                            />
                            <MiniMap 
                                nodeColor={(node) => node.data.background}
                                zoomable
                                pannable
                            />
                            <Controls />
                        </ReactFlow>
                    </div>
                </div>
            </DndContext>
        </div>
    );
};

export default Degree;