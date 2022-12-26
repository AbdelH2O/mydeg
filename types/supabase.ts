export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json }
    | Json[];

export interface Database {
    public: {
        Tables: {
            Course: {
                Row: {
                    code: string;
                    name: string;
                    credits: number;
                    prerequisites_misc: string[];
                };
                Insert: {
                    code: string;
                    name: string;
                    credits: number;
                    prerequisites_misc?: string[];
                };
                Update: {
                    code?: string;
                    name?: string;
                    credits?: number;
                    prerequisites_misc?: string[];
                };
            };
            Course_Course: {
                Row: {
                    id: number;
                    course: string;
                    requisite: string;
                    type: string;
                    group: number;
                };
                Insert: {
                    id?: number;
                    course: string;
                    requisite: string;
                    type?: string;
                    group?: number;
                };
                Update: {
                    id?: number;
                    course?: string;
                    requisite?: string;
                    type?: string;
                    group?: number;
                };
            };
            Degree: {
                Row: {
                    id: string;
                    major: string;
                    minor: string;
                    created_at: string | null;
                };
                Insert: {
                    id: string;
                    major: string;
                    minor: string;
                    created_at?: string | null;
                };
                Update: {
                    id?: string;
                    major?: string;
                    minor?: string;
                    created_at?: string | null;
                };
            };
            Degree_Term: {
                Row: {
                    id: string;
                    name: string;
                    created_at: string;
                    degree: string;
                };
                Insert: {
                    id: string;
                    name: string;
                    created_at?: string;
                    degree: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    created_at?: string;
                    degree?: string;
                };
            };
            Degree_Term_Course: {
                Row: {
                    id: number;
                    term: string;
                    course: string;
                };
                Insert: {
                    id?: number;
                    term: string;
                    course: string;
                };
                Update: {
                    id?: number;
                    term?: string;
                    course?: string;
                };
            };
            Major_Course: {
                Row: {
                    id: number;
                    major: string;
                    course: string;
                    group: number;
                    parent: string | null;
                    color: string;
                    x: number;
                    y: number;
                };
                Insert: {
                    id?: number;
                    major: string;
                    course: string;
                    group?: number;
                    parent?: string | null;
                    color?: string;
                    x?: number;
                    y?: number;
                };
                Update: {
                    id?: number;
                    major?: string;
                    course?: string;
                    group?: number;
                    parent?: string | null;
                    color?: string;
                    x?: number;
                    y?: number;
                };
            };
            Majors: {
                Row: {
                    name: string;
                    catalog: string;
                    type: string;
                };
                Insert: {
                    name: string;
                    catalog: string;
                    type?: string;
                };
                Update: {
                    name?: string;
                    catalog?: string;
                    type?: string;
                };
            };
            Professor: {
                Row: {
                    name: string;
                    rating: number;
                    keywords: string[];
                };
                Insert: {
                    name: string;
                    rating?: number;
                    keywords: string[];
                };
                Update: {
                    name?: string;
                    rating?: number;
                    keywords?: string[];
                };
            };
            Section: {
                Row: {
                    id: string;
                    professor: string;
                    course: string;
                    days: string;
                    start_time: string;
                    end_time: string;
                    term: string;
                    raw_schedule: string;
                };
                Insert: {
                    id: string;
                    professor?: string;
                    course?: string;
                    days?: string;
                    start_time?: string;
                    end_time?: string;
                    term?: string;
                    raw_schedule?: string;
                };
                Update: {
                    id?: string;
                    professor?: string;
                    course?: string;
                    days?: string;
                    start_time?: string;
                    end_time?: string;
                    term?: string;
                    raw_schedule?: string;
                };
            };
            Single_Term: {
                Row: {
                    id: string;
                    major: string;
                    minor: string | null;
                    created_at: string | null;
                };
                Insert: {
                    id: string;
                    major: string;
                    minor?: string | null;
                    created_at?: string | null;
                };
                Update: {
                    id?: string;
                    major?: string;
                    minor?: string | null;
                    created_at?: string | null;
                };
            };
            Single_Term_Section: {
                Row: {
                    id: number;
                    term: string;
                    section: string;
                };
                Insert: {
                    id?: number;
                    term: string;
                    section: string;
                };
                Update: {
                    id?: number;
                    term?: string;
                    section?: string;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
    };
}
