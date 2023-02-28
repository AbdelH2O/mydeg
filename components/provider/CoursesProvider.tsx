import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Edge, MarkerType, Node } from "reactflow";
import { CoursesContext } from "../../hooks/useCourses";
// import supabase from "../../utils/supabaseClient";
import useSupabase from "../../hooks/useSupabase";
// import { defaultTerms } from "../../enums/terms";
import { abreviations } from "../../enums/abr";
import NProgress from "nprogress";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../Database";
import { SIDEBAR } from "../../types/SideBar";
import { TERMS } from "../../types/Terms";

export const CoursesProvider = ({
    children,
}: {
    children: JSX.Element | JSX.Element[];
}) => {
    const { id } = useRouter().query;
    const [coursesMap, setCoursesMap] = useState<Map<string, string[]>>(
        new Map<string, string[]>()
    );
    const [majorMinor, setMajorMinor] = useState<{
        major: string;
        minor: string;
        term: {
            type: TERMS,
            year: string
        },
    }>({ major: "", minor: "", term: {type: TERMS.FALL, year: ""} });
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [loading, setLoading] = useState(true);
    /* Keeping track of the currently selected sidebar */
    const [sideBar, setSideBar] = useState<SIDEBAR>(SIDEBAR.NONE);
    const [terms, setTerms] = useState<{[key: string]: { type: string, year: string }}>({});
    const [colors, setColors] = useState<{[key: string]: string}>({});
    /* Keeping track of the currently dragged course */
    const [activeId, setActiveId] = useState<string>("");
    /* Keeping track of discarded courses */
    const [trash, setTrash] = useState<string[]>([]);
    /* Keeping track of the currently selected term */
    const [currentTerm, setCurrentTerm] = useState<{type: TERMS, id: string, year: string}>({type: TERMS.FALL, id: "", year: ""});
    /* Dictionary to keep track of whether or not a course was added, and the term it was added to. */
    const [used, setUsed] = useState<{[key: string]: { type: string, year: string }}>({});
    /* Dictionary to keep track of a course's requirements */
    const [req, setReq] = useState<{[key: string]: string[]}>({});
    /* Dictionary to keep track of a course's info */
    const [info, setInfo] = useState<{[key: string]: {name: string, credits: number, desc: string, background: string}}>({});
    const [infoCourse, setInfoCourse] = useState<{
        id: string;
        name: string;
        credits: number;
        children?: {course: string, name: string, selected: boolean, color: string, desc: string}[];
    }>({ id: "", name: "", credits: 0});
    const { supabase } = useSupabase();

    useEffect(() => {
        if(id) {
            (async () => {
                setLoading(true);
                NProgress.set(0.3);
                NProgress.start();
                const mm = await getDegree(id as string, setMajorMinor, coursesMap, setTerms, setUsed, supabase);
                mm.term.type && (setCurrentTerm(mm.term as {type: TERMS, year: string, id: string}));
                if(mm.major) {
                    const major = await getCourses(mm.major, id as string, setNodes, nodes, setEdges, edges, setColors, colors, setReq, req, supabase, setInfo, info)
                    mm.minor && (await getCourses(mm.minor, id as string, setNodes, major.nodes, setEdges, major.edges, setColors, major.colors, setReq, major.req, supabase, setInfo, major.info));
                };
                mm.minor && (NProgress.done());
                setLoading(false);
            })();
        }
    }, [id]);
    return (
        <CoursesContext.Provider
            value={{
                map: coursesMap,
                setMap: setCoursesMap,
                edges,
                setEdges,
                loading,
                nodes,
                setNodes,
                majorMinor,
                terms,
                setTerms,
                colors,
                activeId,
                setActiveId,
                used,
                setUsed,
                req,
                setReq,
                sideBar,
                setSideBar,
                infoCourse,
                setInfoCourse,
                currentTerm,
                setCurrentTerm,
                info,
            }}
        >
            {children}
        </CoursesContext.Provider>
    );
};

const getDegree = async (
    id: string,
    setMajorMinor: React.Dispatch<React.SetStateAction<{major: string, minor: string, term: {type: TERMS, year: string}}>>,
    coursesMap: Map<string, string[]>,
    setTerms: React.Dispatch<React.SetStateAction<{[key: string]: { type: string, year: string }}>>,
    setUsed: React.Dispatch<React.SetStateAction<{[key: string]: { type: string, year: string }}>>,
    supabase: SupabaseClient<Database>
) => {
    const { data, error } = await supabase
        .from("Degree")
        .select(`
            *,
            Degree_Term (
                *,
                Degree_Term_Course (
                    *
                )
            )
        `)
        .eq("id", id);
    if (error) {
        // TODO: Handle error
        return { major: "", minor: "", term: {type: "", year: "", id: ""} };
    } else {
        const terms: {[key: string]: { type: string, year: string }} = {};
        const indexMatch = [TERMS.FALL, TERMS.SPRING];
        // The degree start is either 0 or 1 (Fall or Spring)
        setMajorMinor({ major: data[0].major, minor: data[0].minor , term: {type: indexMatch[data[0].start], year: data[0].year}});
        const used: {[key: string]: { type: string, year: string }} = {};
        if(error || data === null || data.length === 0 || data[0] === null || data[0].Degree_Term === null || !Array.isArray(data[0].Degree_Term)) {
            return { major: "", minor: "", term: {type: "", year: "", id: ""} };
        } else {
            data[0].Degree_Term.forEach(
                (term) => {
                terms[term.id] = { type: term.type, year: term.year };
                if(term.Degree_Term_Course === null || !Array.isArray(term.Degree_Term_Course)) {
                    return { major: "", minor: "", term: {type: "", year: "", id: ""} };
                }
                const courses = term.Degree_Term_Course.map((course: {term: string, course: string}) => {
                    // const courses = (coursesMap.get(course.term) || []).concat(course.course);
                    used[course.course] = { type: term.type, year: term.year};
                    return course.course;
                });
                coursesMap.set(term.id, Array.from(new Set(courses)));
            });
            setUsed(used);        
            setTerms(
                Object.keys(terms)
                    .sort((a,b) => {
                        if(terms[a].year === terms[b].year) {
                            const order = ["Spring", "Summer", "Fall"];
                            return order.indexOf(terms[a].type) - order.indexOf(terms[b].type);
                        }
                        return parseInt(terms[a].year) - parseInt(terms[b].year)
                    })
                    .reduce((r: {[key: string]: { type: string, year: string }},k)=>(r[k]=terms[k],r),{})
            );
            
            return { major: data[0].major, minor: data[0].minor, term: {...terms[Object.keys(terms)[0]], id: Object.keys(terms)[0]} };
        }
        // }
    }
};

const getCourses = async (
    id: string,
    degreeId: string,
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
    nodes: Node[],
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
    edges: Edge[],
    setColors: React.Dispatch<React.SetStateAction<{[key: string]: string}>>,
    iColors: {[key: string]: string},
    setReq: React.Dispatch<React.SetStateAction<{[key: string]: string[]}>>,
    iReq: {[key: string]: string[]},
    supabase: SupabaseClient<Database>,
    setInfo: React.Dispatch<React.SetStateAction<{[key: string]: {name: string, desc: string, credits: number, background: string}}>>,
    iInfo: {[key: string]: {name: string, desc: string, credits: number, background: string}}
) => {
    const { data, error } = await supabase
        .from("Majors")
        .select(`
            *,
            Major_Course (
                *,
                Course (
                    name,
                    credits,
                    Major_Course_Selected (
                        *
                    )
                )
            )
        `)
        .eq("name", id)
        .eq("Major_Course.Course.Major_Course_Selected.degree", degreeId);
    
    const parents: { [key: string]: { course: string, credits: number, name: string, selected: boolean, color: string, desc: string}[]} = {};
    const added = new Map<string, boolean>();
    const groups = new Map<string, { color: string; group: number }>();
    const coord = new Map<string, { x: number; y: number }>();
    const colors: {[key: string]: string} = {};
    // courses info:
    const info: {[key: string]: {name: string, desc: string, credits: number, background: string}} = {};
    // const trash:
    // const parents:
    if (error || data === null || data.length === 0 || data[0] === null || data[0].Major_Course === null || !Array.isArray(data[0].Major_Course)) {
        throw error;
    }
    const nodes_pre = data[0].Major_Course.map((majorCourse) => {
        groups.set(majorCourse.course, {
            group: majorCourse.group,
            color: majorCourse.color,
        });
        colors[majorCourse.course] = majorCourse.color;
        coord.set(majorCourse.course, { x: majorCourse.x, y: majorCourse.y });
        if (majorCourse.parent !== null) {
            if(!added.has(majorCourse.parent!)) {
                added.set(majorCourse.parent!, true);
                parents[majorCourse.parent!] = [];
            }
            let selected = false, name = "", credits = 0;
            if(
                majorCourse.Course !== null &&
                !Array.isArray(majorCourse.Course)
            ) {
                if(
                    majorCourse.Course.Major_Course_Selected !== null &&
                    Array.isArray(majorCourse.Course.Major_Course_Selected) &&
                    majorCourse.Course.Major_Course_Selected.length > 0
                ) {
                    selected = true;
                }
                // console.log(majorCourse);
                // color[majorCourse.course]
                name = majorCourse.Course.name;
                credits = majorCourse.Course.credits;
            }
            
            parents[majorCourse.parent!].push({course: majorCourse.course, credits, name, selected, color: majorCourse.color, desc: "hahahahahhahahah ahhahahha"});
            info[majorCourse.course] = {name, credits, desc: "haha", background: majorCourse.color};
            return undefined;
        }
        if (
            majorCourse.Course !== null &&
            !Array.isArray(majorCourse.Course) &&
            majorCourse.Course.Major_Course_Selected !== null &&
            !Array.isArray(majorCourse.Course.Major_Course_Selected)
        ) {
            
        }
        const data = {
            name: majorCourse.Course && !Array.isArray(majorCourse.Course) ? majorCourse.Course.name : "",
            credits: majorCourse.Course && !Array.isArray(majorCourse.Course) ? majorCourse.Course.credits : 0,
            desc: "haha",
            background: majorCourse.color,
        };
        info[majorCourse.course] = data;
        return {
            id: majorCourse.course,
            type: "courseNode",
            data: {
                ...data,
                code: majorCourse.course,
                background: majorCourse.color,
            },
            position: {
                x: majorCourse.x * 100,
                y:
                    (majorCourse.x % 2 !== 0
                        ? majorCourse.y
                        : majorCourse.y + 2) * 75,
            },
        };
    }).filter((node) => node !== undefined) as Node[];
    setColors({ ...iColors, ...colors });
    setInfo({ ...iInfo, ...info });
    const parentNodes: Node[] = Object.keys(parents).map((par: string) => {
        return {
            id: par,
            type: "selectorNode",
            data: {
                code: par,
                // name: majorCourse.name,
                background: colors[parents[par][0].course],
                children: parents[par],
                credits: parents[par] ? parents[par][0].credits : 0,
            },
            position: {
                x: coord.get(parents[par][0].course)!.x * 100,
                y: (coord.get(parents[par][0].course)!.x % 2 !== 0
                    ? coord.get(parents[par][0].course)!.y
                    : coord.get(parents[par][0].course)!.y + 2)* 75,
            },
        };
    });
    
    setNodes([...nodes ,...parentNodes, ...nodes_pre]);

    const selectables: string[] = [];

    const isChild = new Map<string, string>();
    Object.keys(parents).forEach((par) => {
        parents[par].forEach((child) => {
            isChild.set(child.course, child.selected ? par : "n");
            selectables.push(child.course);
        });
    });    
    
    const { data: data2, error: error2 } = await supabase
        .from("Course_Course")
        .select(`*`)
        .in(
            "course",
            [...data![0].Major_Course.map(
                (majorCourse) => majorCourse.course
            ), ...selectables]
        );

    const req: {[key: string]: string[]} = {};
    if (error2 || data2 === null || data2.length === 0 || data2[0] === null) {
        throw error2;
    }
    const edges_temp: Edge[] = data2
        .filter(
            (requisite) =>
                (requisite.group === groups.get(requisite.course)?.group ||
                    requisite.type === "co")
        )
        .map((requisite) => {
            if (requisite.type === "pre") {
                if (req[requisite.course] === undefined) {
                    req[requisite.course] = [];
                }
                req[requisite.course].push(requisite.requisite);
            }
            if(isChild.get(requisite.course) === "n") {
                return undefined;
            }
            const name = isChild.get(requisite.course) !== undefined ? isChild.get(requisite.course)! : requisite.course;
            return {
                id: `${requisite.course} -> ${requisite.requisite}`,
                source: requisite.requisite,
                target: name,
                sourceHandle:
                    (coord.get(requisite.requisite) || { x: 0 }).x <
                    coord.get(requisite.course)!.x
                        ? requisite.requisite + "right"
                        : (coord.get(requisite.requisite) || { x: 0 }).x ==
                            coord.get(requisite.course)!.x
                        ? (coord.get(requisite.requisite) || { y: 0 }).y <
                            coord.get(requisite.course)!.y
                            ? requisite.requisite + "bottom"
                            : requisite.requisite + "top"
                        : requisite.requisite + "left",
                targetHandle: name + "tarTop",
                type: "smoothstep",
                animated: requisite.type === "co",
                markerEnd: {
                    type:
                        requisite.type === "pre"
                            ? MarkerType.ArrowClosed
                            : MarkerType.Arrow,
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
        }).filter((edge) => edge !== undefined) as Edge[];
    setReq({ ...iReq, ...req });
    setEdges([...edges, ...edges_temp]);
    // console.log(edges_temp);
    
    groups.clear();
    coord.clear();
    added.clear();
    return {
        nodes: [...parentNodes, ...nodes_pre],
        edges: edges_temp,
        colors: colors,
        info: info,
        req: req,
    }
};
