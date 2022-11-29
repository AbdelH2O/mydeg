import { createContext, useContext } from "react";
import { Edge, Node } from "reactflow";
import { Course } from "../types";

const DEFAULT_CONTEXT: {
    map: Map<string, string[]>;
    setMap: (map: Map<string, string[]>) => void;
    major: string;
    minor: string;
    nodes: Node[];
    edges: Edge[];
    loading: boolean;
    terms: {[key: string]: string};
    setTerms: (terms: {[key: string]: string}) => void;
    colors: {[key: string]: string};
    activeId: string;
    setActiveId: (id: string) => void;
    used: {[key: string]: number};
    setUsed: (used: {[key: string]: number}) => void;
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
};
  
export const CoursesContext = createContext(DEFAULT_CONTEXT);

export function useCourses() {
    return useContext(CoursesContext);
}