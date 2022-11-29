import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Edge, MarkerType, Node } from "reactflow";
import { CoursesContext } from "../hooks/useCourses";
import { Course_Course, Major_Course } from "../types";
import supabase from "../utils/supabaseClient";
import { defaultTerms } from "../enums/terms";

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
    }>({ major: "", minor: "" });
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [loading, setLoading] = useState(true);
    const [terms, setTerms] = useState<{[key: string]: string}>({});
    const [colors, setColors] = useState<{[key: string]: string}>({});
    const [activeId, setActiveId] = useState<string>("");
    const [used, setUsed] = useState<{[key: string]: number}>({});

    useEffect(() => {
        if(id) {
            console.log("id", id);
            (async () => {
                setLoading(true);
                const mm = await getDegree(id as string, setMajorMinor, coursesMap, setTerms, setUsed);
                mm.major && (await getCourses(mm.major, setNodes, setEdges, setColors));
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
                loading,
                nodes,
                ...majorMinor,
                terms,
                setTerms,
                colors,
                activeId,
                setActiveId,
                used,
                setUsed,
            }}
        >
            {children}
        </CoursesContext.Provider>
    );
};

const getDegree = async (
    id: string,
    setMajorMinor: React.Dispatch<React.SetStateAction<{major: string, minor: string}>>,
    coursesMap: Map<string, string[]>,
    setTerms: React.Dispatch<React.SetStateAction<{[key: string]: string}>>,
    setUsed: React.Dispatch<React.SetStateAction<{[key: string]: number}>>
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
        return { major: "", minor: "" };
    } else {
        const terms: {[key: string]: string} = {};
        setMajorMinor({ major: data[0].major, minor: data[0].minor });
        const used: {[key: string]: number} = {};
        console.log(data);
        
        data[0].Degree_Term.forEach(
            (
                term: {
                    id: string,
                    name: string,
                    Degree_Term_Course: {
                        term: string,
                        course: string
                    }[]
                }
            ) => {
            terms[term.id] = term.name;
            const courses = term.Degree_Term_Course.map((course: {term: string, course: string}) => {
                // const courses = (coursesMap.get(course.term) || []).concat(course.course);
                // @ts-ignore
                used[course.course] = defaultTerms[term.id];
                return course.course;
            });
            coursesMap.set(term.id, Array.from(new Set(courses)));
        });
        setUsed(used);
        // @ts-ignore 
        setTerms(Object.keys(terms).sort(function(a,b){return defaultTerms[terms[a]] - defaultTerms[terms[b]]}).reduce((r: {[key: string]: string},k)=>(r[k]=terms[k],r),{}));
        console.log(terms);
        
        return { major: data[0].major, minor: data[0].minor };
        // }
    }
};

const getCourses = async (
    id: string,
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
    setColors: React.Dispatch<React.SetStateAction<{[key: string]: string}>>,
) => {
    const { data, error } = await supabase
        .from("Majors")
        .select(
            `
                    *,
                    Major_Course!inner (
                        *
                    )
                `
        )
        .eq("name", id);
    
    const parents: Node[] = [];
    const added = new Map<string, boolean>();
    const groups = new Map<string, { color: string; group: number }>();
    const coord = new Map<string, { x: number; y: number }>();
    const colors: {[key: string]: string} = {};
    const nodes_pre = data![0].Major_Course.map((majorCourse: Major_Course) => {
        groups.set(majorCourse.course, {
            group: majorCourse.group,
            color: majorCourse.color,
        });
        colors[majorCourse.course] = majorCourse.color;
        coord.set(majorCourse.course, { x: majorCourse.x, y: majorCourse.y });
        if (majorCourse.parent !== null && !added.has(majorCourse.parent!)) {
            added.set(majorCourse.parent!, true);
            return {
                id: majorCourse.course,
                type: "courseNode",
                data: {
                    code: majorCourse.course,
                    // name: majorCourse.name,
                    background: majorCourse.color,
                },
                position: {
                    x: majorCourse.x * 100,
                    y:
                        (majorCourse.x % 2 !== 0
                            ? majorCourse.y
                            : majorCourse.y + 2) * 75,
                },
                // parentNode: majorCourse.parent,
            };
        }
        return {
            id: majorCourse.course,
            type: "courseNode",
            data: {
                code: majorCourse.course,
                // name: majorCourse.name,
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
    });
    setColors(colors);
    setNodes([...parents, ...nodes_pre]);
    
    const { data: data2, error: error2 } = await supabase
        .from("Course_Course")
        .select(`*`)
        .in(
            "course",
            data![0].Major_Course.map(
                (majorCourse: Major_Course) => majorCourse.course
            )
        );
    const edges_temp: Edge[] = data2!
        .filter(
            (requisite: Course_Course) =>
                (requisite.group == groups.get(requisite.course)?.group ||
                    requisite.type == "co") &&
                coord.has(requisite.course) &&
                coord.has(requisite.requisite)
        )
        .map((requisite: Course_Course) => {
            return {
                id: `${requisite.course} -> ${requisite.requisite}`,
                source: requisite.requisite,
                target: requisite.course,
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
                targetHandle:
                    (coord.get(requisite.requisite) || { x: 0 }).x <
                    coord.get(requisite.course)!.x
                        ? requisite.course + "tarLeft"
                        : (coord.get(requisite.requisite) || { x: 0 }).x ==
                          coord.get(requisite.course)!.x
                        ? (coord.get(requisite.requisite) || { y: 0 }).y <
                          coord.get(requisite.course)!.y
                            ? requisite.course + "tarTop"
                            : requisite.course + "tarBottom"
                        : requisite.course + "tarRight",
                type: "step",
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
        });
    setEdges(edges_temp);
    groups.clear();
    coord.clear();
    added.clear();
};
