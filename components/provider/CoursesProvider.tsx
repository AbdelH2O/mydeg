import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Edge, MarkerType, Node } from "reactflow";
import { CoursesContext } from "../../hooks/useCourses";
// import supabase from "../../utils/supabaseClient";
import useSupabase from "../../hooks/useSupabase";
import { defaultTerms } from "../../enums/terms";
import { abreviations } from "../../enums/abr";
import NProgress from "nprogress";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../Database";

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
    const [req, setReq] = useState<{[key: string]: string[]}>({});
    const { supabase } = useSupabase();

    useEffect(() => {
        if(id) {
            (async () => {
                setLoading(true);
                NProgress.set(0.3);
                NProgress.start();
                const mm = await getDegree(id as string, setMajorMinor, coursesMap, setTerms, setUsed, supabase);
                mm.major && (await getCourses(mm.major, setNodes, setEdges, setColors, setReq, supabase));
                mm.minor && (NProgress.done());
                setLoading(false);
            })();
        }
        // supabase.auth.setSession({
        //     access_token: 'ey',
        //     refresh_token: 'ey',
        // })
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
                req,
                setReq
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
    setUsed: React.Dispatch<React.SetStateAction<{[key: string]: number}>>,
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
        return { major: "", minor: "" };
    } else {
        const terms: {[key: string]: string} = {};
        setMajorMinor({ major: data[0].major, minor: data[0].minor });
        const used: {[key: string]: number} = {};
        if(error || data === null || data.length === 0 || data[0] === null || data[0].Degree_Term === null || !Array.isArray(data[0].Degree_Term)) {
            return { major: "", minor: "" };
        } else {
            data[0].Degree_Term.forEach(
                (term) => {
                terms[term.id] = term.name;
                if(term.Degree_Term_Course === null || !Array.isArray(term.Degree_Term_Course)) {
                    return;
                }
                const courses = term.Degree_Term_Course.map((course: {term: string, course: string}) => {
                    // const courses = (coursesMap.get(course.term) || []).concat(course.course);
                    // @ts-ignore
    
                    used[course.course] = defaultTerms[term.name];
                    return course.course;
                });
                coursesMap.set(term.id, Array.from(new Set(courses)));
            });
            setUsed(used);        
            // @ts-ignore 
            setTerms(Object.keys(terms).sort(function(a,b){return defaultTerms[terms[a]] - defaultTerms[terms[b]]}).reduce((r: {[key: string]: string},k)=>(r[k]=terms[k],r),{}));
            
            return { major: data[0].major, minor: data[0].minor };
        }
        // }
    }
};

const getCourses = async (
    id: string,
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
    setColors: React.Dispatch<React.SetStateAction<{[key: string]: string}>>,
    setReq: React.Dispatch<React.SetStateAction<{[key: string]: string[]}>>,
    supabase: SupabaseClient<Database>
) => {
    const { data, error } = await supabase
        .from("Majors")
        .select(`
            *,
            Major_Course (
                *
            )
        `)
        .eq("name", id);
    
    const parents: { [key: string]: string[]} = {};
    const added = new Map<string, boolean>();
    const groups = new Map<string, { color: string; group: number }>();
    const coord = new Map<string, { x: number; y: number }>();
    const colors: {[key: string]: string} = {};
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
            parents[majorCourse.parent!].push(majorCourse.course);
            return undefined;
            // return {
            //     id: majorCourse.course,
            //     type: "courseNode",
            //     data: {
            //         code: majorCourse.course,
            //         // name: majorCourse.name,
            //         background: majorCourse.color,
            //     },
            //     position: {
            //         x: majorCourse.x * 100,
            //         y:
            //             (majorCourse.x % 2 !== 0
            //                 ? majorCourse.y
            //                 : majorCourse.y + 2) * 75,
            //     },
            //     // parentNode: majorCourse.parent,
            // };
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
    }).filter((node) => node !== undefined) as Node[];
    setColors(colors);
    const parentNodes: Node[] = Object.keys(parents).map((par: string) => {
        return {
            id: par,
            type: "selectorNode",
            data: {
                code: par in abreviations ? abreviations[par] : par,
                // name: majorCourse.name,
                background: colors[parents[par][0]],
                children: parents[par],
            },
            position: {
                x: coord.get(parents[par][0])!.x * 100,
                y: (coord.get(parents[par][0])!.x % 2 !== 0
                    ? coord.get(parents[par][0])!.y
                    : coord.get(parents[par][0])!.y + 2)* 75,
            },
        };
    });
    setNodes([...parentNodes, ...nodes_pre]);
    
    const { data: data2, error: error2 } = await supabase
        .from("Course_Course")
        .select(`*`)
        .in(
            "course",
            data![0].Major_Course.map(
                (majorCourse) => majorCourse.course
            )
        );
    const req: {[key: string]: string[]} = {};
    if (error2 || data2 === null || data2.length === 0 || data2[0] === null) {
        throw error2;
    }
    const edges_temp: Edge[] = data2
        .filter(
            (requisite) =>
                (requisite.group == groups.get(requisite.course)?.group ||
                    requisite.type == "co") &&
                coord.has(requisite.course) &&
                coord.has(requisite.requisite)
        )
        .map((requisite) => {
            if (requisite.type == "pre") {
                if (req[requisite.course] == undefined) {
                    req[requisite.course] = [];
                }
                req[requisite.course].push(requisite.requisite);
            }
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
    setReq(req);
    setEdges(edges_temp);
    groups.clear();
    coord.clear();
    added.clear();
};
