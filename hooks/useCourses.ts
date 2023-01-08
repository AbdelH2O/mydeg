import { createContext, useContext } from "react";
import { Edge, Node } from "reactflow";
import { SIDEBAR } from "../types/SideBar";

const DEFAULT_CONTEXT: {
    map: Map<string, string[]>;
    setMap: React.Dispatch<React.SetStateAction<Map<string, string[]>>>;
    major: string;
    minor: string;
    nodes: Node[];
    edges: Edge[];
    loading: boolean;
    terms: {[key: string]: string};
    setTerms: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
    colors: {[key: string]: string};
    activeId: string;
    setActiveId: React.Dispatch<React.SetStateAction<string>>;
    used: {[key: string]: number};
    setUsed: React.Dispatch<React.SetStateAction<{[key: string]: number}>>;
    req: {[key: string]: string[]};
    setReq: React.Dispatch<React.SetStateAction<{[key: string]: string[]}>>;
    sideBar: SIDEBAR;
    setSideBar: React.Dispatch<React.SetStateAction<SIDEBAR>>;
    infoCourse: {id: string, name: string, children?: {course: string, name: string, selected: boolean}[]};
    setInfoCourse: React.Dispatch<React.SetStateAction<{id: string, name: string, children?: {course: string, name: string, selected: boolean}[]}>>;
} = {
    map: new Map(),
    setMap: () => {},
    major: '',
    minor: '',
    nodes: [],
    edges: [],
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
    infoCourse: {id: '', name: ''},
    setInfoCourse: () => {},
};

export const CoursesContext = createContext(DEFAULT_CONTEXT);

export function useCourses() {
    return useContext(CoursesContext);
}