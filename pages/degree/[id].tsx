import ReactFlow, { Background, Controls, Edge, MarkerType, MiniMap, Node, ReactFlowInstance } from 'reactflow';
// import { SmartStepEdge } from '@tisoap/react-flow-smart-edge';
import CourseNode from '../../components/CourseNode';
import supabase from '../../utils/supabaseClient';
import 'reactflow/dist/style.css';
import { useEffect, useMemo, useState } from 'react';
import { Course_Course, Major_Course } from '../../types';
import SideBar from '../../components/SideBar';
import Top from '../../components/Top';
import { DndContext, DragOverlay } from '@dnd-kit/core';

const Degree = () => {
    const nodeTypes = useMemo(() => ({ courseNode: CourseNode }), []);
    // const edgeTypes = {
    //     smart: SmartStepEdge
    // };
    const [loading, setLoading] = useState(true);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [show, setShow] = useState(false);
    const [activeId, setActiveId] = useState<{ code: string, color: string} | null>(null);
    const [flow, setFlow] = useState<ReactFlowInstance>();

    useEffect(() => {
        const fetchNodes = async () => {
            const { data, error } = await supabase
                .from('Majors')
                .select(`
                    *,
                    Major_Course!inner (
                        *
                    )
                `)
                .eq('name', 'BSCSC');

            if (error) {
                console.error(error);
            }
            console.log(data);
            
            const parents: Node[] = [];
            const added = new Map<string, boolean>();
            const groups = new Map<string, {color: string, group: number}>();
            const coord = new Map<string, {x: number, y: number}>();
            const nodes_pre = 
                data![0].Major_Course.map((majorCourse: Major_Course) => {
                    groups.set(majorCourse.course, {group: majorCourse.group, color: majorCourse.color});
                    coord.set(majorCourse.course, {x: majorCourse.x, y: majorCourse.y});
                    if (majorCourse.parent !== null && !added.has(majorCourse.parent!)) {
                        // parents.push({
                        //     id: majorCourse.parent,
                        //     data: { label: majorCourse.parent },
                        //     position: { x: majorCourse.x*100, y: majorCourse.y*75 },
                        //     type: 'group',
                        //     // style: {
                        //     //     height: 100,
                        //     //     width: 300,
                        //     // }
                        // });
                        added.set(majorCourse.parent!, true);
                        return {
                            id: majorCourse.course,
                            type: 'courseNode',
                            data: {
                                code: majorCourse.course,
                                // name: majorCourse.name,
                                background: majorCourse.color,
                            },
                            position: { x: majorCourse.x*100, y: (majorCourse.x%2!==0?majorCourse.y:majorCourse.y+2)*75 },
                            // parentNode: majorCourse.parent,
                        };
                    }
                    return {
                        id: majorCourse.course,
                        type: 'courseNode',
                        data: {
                            code: majorCourse.course,
                            // name: majorCourse.name,
                            background: majorCourse.color,
                        },
                        position: { x: majorCourse.x*100, y: (majorCourse.x%2!==0?majorCourse.y:majorCourse.y+2)*75 },
                    };
                })
            setNodes([
                ...parents,
                ...nodes_pre
            ])
            console.log([
                ...parents,
                ...nodes_pre
            ]);
            const edges: Edge[] = [];
            // nodes_pre.forEach((node: Node) => {
                
            // });
            const { data: data2, error: error2 } = await supabase
                .from('Course_Course')
                .select(`
                    *
                `)
                .in('course', data![0].Major_Course.map((majorCourse: Major_Course) => majorCourse.course));
            console.log(data2?.filter((requisite: Course_Course) => requisite.group == groups.get(requisite.course)?.group || requisite.type == "co"), error2);
            const edges_temp: Edge[] = 
                data2!.
                filter((requisite: Course_Course) => (requisite.group == groups.get(requisite.course)?.group || requisite.type == "co") && coord.has(requisite.course) && coord.has(requisite.requisite))
                .map((requisite: Course_Course) => {
                    return {
                        id: `${requisite.course} -> ${requisite.requisite}`,
                        source: requisite.requisite,
                        target: requisite.course,
                        // using the source and target coordinates, determine the source and target anchor
                        sourceHandle:
                            (coord.get(requisite.requisite) || {x:0}).x < coord.get(requisite.course)!.x ?
                            requisite.requisite + 'right' :
                            (
                                (coord.get(requisite.requisite) || {x:0}).x == coord.get(requisite.course)!.x ?
                                (
                                    (coord.get(requisite.requisite) || {y:0}).y < coord.get(requisite.course)!.y ?
                                    requisite.requisite + 'bottom' :
                                    requisite.requisite + 'top'
                                ) :
                                requisite.requisite + 'left'
                            ),
                        targetHandle:
                            (coord.get(requisite.requisite) || {x:0}).x < coord.get(requisite.course)!.x ?
                            requisite.course + 'tarLeft' :
                            (
                                (coord.get(requisite.requisite) || {x:0}).x == coord.get(requisite.course)!.x ?
                                (
                                    (coord.get(requisite.requisite) || {y:0}).y < coord.get(requisite.course)!.y ?
                                    requisite.course + 'tarTop' :
                                    requisite.course + 'tarBottom'
                                ) :
                                requisite.course + 'tarRight'
                            ),
                        type: 'step',
                        animated: requisite.type === "co",
                        // arrowHeadType: MarkerType.ArrowClosed,
                        markerEnd: {
                            type: requisite.type === "pre" ? MarkerType.ArrowClosed : MarkerType.Arrow,
                            color: groups.get(requisite.requisite)?.color,
                            width: 20,
                            height: 20,
                            strokeWidth: 0,
                        },
                        style: {
                            stroke: groups.get(requisite.requisite)?.color,
                            strokeWidth: 2,
                        },
                    };
                });
            setEdges(edges_temp);
            groups.clear();
            coord.clear();
            added.clear();
            setLoading(false);
            // setLoading(false);
        }
        fetchNodes();
    }, []);
    useEffect(() => {
        if(flow) console.log(flow?.getZoom());
    }, [flow]);
    const edgess: Edge[] = [
        {
            id: 'MTH 1303 -> MTH 2301',
            source: 'MTH 1303',
            target: 'MTH 2301',
            // label: 'p',
            // animated: true,
            sourceHandle: 'MTH 1303right',
            targetHandle: 'MTH 2301tarLeft',
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: 'black',
                width: 20,
                height: 20,
                strokeWidth: 0,
            },
            style: {
                stroke: 'black',
                filter: 'drop-shadow(0px 0px 0px black)',
                scale: 0.2
                // border: '1px solid black',
            },
        },
        {
            id: 'MTH 1304 -> CSC 1401',
            source: 'MTH 1304',
            target: 'CSC 1401',
            // label: 'c',
            type: 'default',
            animated: true,
            sourceHandle: 'MTH 1304bottom',
            targetHandle: 'CSC 1401tarTop',
            style: {
                stroke: 'black',
            }
        }
    ]
    return (
        <div className='h-screen w-screen flex flex-col overflow-hidden'>
            <DndContext
                onDragStart={(e) => setActiveId(typeof(e.active.id) === 'string' ? {code: e.active.id, color: e.active.data.current!.background} : {code: e.active.id.toString(), color: e.active.data.current!.background})}
                onDragEnd={(e) => setActiveId(null)}
            >
                <Top />
                <div className='flex-grow w-full flex flex-row justify-end bg-cyan-100'>
                    <SideBar show={show} setShow={setShow} />
                    <div className='z-10 overflow-hidden h-full shadow-2xl' style={{width: show ? '75vw' : '98vw', transition: 'all 0.3s ease-in-out'}}>
                        <DragOverlay>
                            {
                                activeId ? (
                                    <div
                                        className="px-4 z-50 py-2 border-2 border-black custom-drag-handle text-sm w-fit whitespace-nowrap"
                                        style={{
                                            // ...style,
                                            ...{
                                                boxShadow: "-3px 5px #000",
                                                backgroundColor: activeId.color,
                                                transition: "all 0.2s ease-in-out",
                                                transform: `scale(${flow?.getZoom()})`,
                                            },
                                        }}
                                    >
                                        <div className="text-white font-JetBrainsMono bg-black px-1 rounded">
                                            {activeId.code}
                                        </div>
                                    </div>
                                ) : null
                            }
                        </DragOverlay>
                        <ReactFlow
                            style={{background: '#cffafe'}}
                            nodes={nodes}
                            edges={edges}
                            // snapToGrid={true}
                            fitView={true}
                            nodeTypes={nodeTypes}
                            draggable={false}
                            onInit={(reactFlowInstance) => {
                                setFlow(reactFlowInstance);
                            }}
                            // edgeTypes={edgeTypes}
                        >
                            {/* <Controls 
                                className='ml-7'
                                showInteractive={false}
                                // showZoom={false}
                                position='top-left'
                            /> */}
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
    )
};

export default Degree;