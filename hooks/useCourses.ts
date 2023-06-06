import { createContext, useContext } from "react";
import { Edge, Node } from "reactflow";
import { SIDEBAR } from "../types/SideBar";
import { TERMS } from "../types/Terms";

const DEFAULT_CONTEXT: {
    map: Map<string, string[]>;
    setMap: React.Dispatch<React.SetStateAction<Map<string, string[]>>>;
    majorMinor: {
        major: string;
        minor: string;
        term: {
            type: TERMS,
            year: string
        },
    }
    nodes: Node[];
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    edges: Edge[];
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
    loading: boolean;
    terms: {[key: string]: { type: TERMS, year: string }};
    setTerms: React.Dispatch<React.SetStateAction<{[key: string]: { type: TERMS, year: string }}>>;
    colors: {[key: string]: string};
    activeId: string;
    setActiveId: React.Dispatch<React.SetStateAction<string>>;
    used: {[key: string]: { type: string, year: string }};
    setUsed: React.Dispatch<React.SetStateAction<{[key: string]: { type: string, year: string }}>>;
    req: {[key: string]: string[]};
    setReq: React.Dispatch<React.SetStateAction<{[key: string]: string[]}>>;
    sideBar: SIDEBAR;
    setSideBar: React.Dispatch<React.SetStateAction<SIDEBAR>>;
    infoCourse: {id: string, credits: number, name: string, children?: {course: string, name: string, selected: boolean, color: string, desc: string}[]};
    setInfoCourse: React.Dispatch<React.SetStateAction<{id: string, credits: number, name: string, children?: {course: string, name: string, selected: boolean, color: string, desc: string}[]}>>;
    currentTerm: {type: TERMS, year: string, id: string};
    setCurrentTerm: React.Dispatch<React.SetStateAction<{type: TERMS, year: string, id: string}>>;
    info: {[key: string]: {name: string, credits: number, desc: string, background: string}};
} = {
    map: new Map(),
    setMap: () => {},
    majorMinor: {
        major: "",
        minor: "",
        term: {
            type: TERMS.FALL,
            year: "2021",
        },
    },
    nodes: [],
    setNodes: () => {},
    edges: [],
    setEdges: () => {},
    loading: false,
    terms: {},
    setTerms: () => {},
    colors: {},
    activeId: "",
    setActiveId: () => {},
    used: {},
    setUsed: () => {},
    req: {},
    setReq: () => {},
    sideBar: SIDEBAR.NONE,
    setSideBar: () => {},
    infoCourse: {id: '', name: '', credits: 0},
    setInfoCourse: () => {},
    currentTerm: {type: TERMS.FALL, year: "2021", id: ""},
    setCurrentTerm: () => {},
    info: {},
};

export const CoursesContext = createContext(DEFAULT_CONTEXT);

export function useCourses() {
    return useContext(CoursesContext);
}