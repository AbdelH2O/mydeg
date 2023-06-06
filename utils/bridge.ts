// import supabase from "./supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
// import uuid from "./uuid";
import NProgress from "nprogress";
import { Database } from "../Database";

export const addCourse = async (term: string, course: string, supabase: SupabaseClient<Database>) => {
    NProgress.set(0.3);
    NProgress.start();
    const { data, error } = await supabase
        .from("Degree_Term_Course")
        .insert({
            term,
            course,
        });
    NProgress.done();
    if (error) {
        return {
            error: error.message,
            success: false,
            data: null,
        };
    }
    return {
        error: null,
        success: true,
        data,
    };
}

export const addTerm = async (degree: string, year: string, type: string, supabase: SupabaseClient<Database>) => {
    // const id = uuid();
    NProgress.set(0.3);
    NProgress.start();
    const { data, error } = await supabase
        .from("Degree_Term")
        .insert({
            degree,
            year,
            type
        })
        .select('id');
    NProgress.done();
    if (error) {
        return {
            error: error.message,
            success: false,
            data: null,
        };
    }
    return {
        error: null,
        success: true,
        data,
        id: data[0].id,
    };
}

export const deleteTerm = async (id: string, supabase: SupabaseClient<Database>) => {
    NProgress.set(0.3);
    NProgress.start();
    const { data, error } = await supabase
        .from("Degree_Term")
        .delete()
        .match({ id });
    NProgress.done();
    if (error) {
        return {
            error: error.message,
            success: false,
            data: null,
        };
    }
    return {
        error: null,
        success: true,
        data,
    };
}


export const addDegree = async (user: string, major: string, minor: string, supabase: SupabaseClient<Database>) => {
    NProgress.set(0.3);
    NProgress.start();
    const { data, error } = await supabase
        .from("Degree")
        .insert({
            major,
            minor,
            created_by: user,
        })
        .select(`
            *,
            Degree_Term (
                Degree_Term_Course (
                    count
                )
            ),
            major(
                name,
                Major_Course (
                    count
                )
            )
        `);
    NProgress.done();
    if (error) {
        return {
            error: error.message,
            success: false,
            data: null,
        };
    }
    return {
        error: null,
        success: true,
        data,
        id: data[0].id,
    };
}

export const removeCourse = async (term: string, course: string, supabase: SupabaseClient<Database>) => {
    NProgress.set(0.3);
    NProgress.start();
    const { data, error } = await supabase
        .from("Degree_Term_Course")
        .delete()
        .match({ term, course });
    NProgress.done();
    if (error) {
        return {
            error: error.message,
            success: false,
            data: null,
        };
    }
    return {
        error: null,
        success: true,
        data,
    };
}

export const removeTermCourses = async (term: string, supabase: SupabaseClient<Database>) => {
    NProgress.set(0.3);
    NProgress.start();
    const { data: courses, error: coursesError } = await supabase
        .from("Degree_Term_Course")
        .delete()
        .match({ term });
    NProgress.done();
    if (coursesError) {
        return {
            error: coursesError.message,
            success: false,
            data: null,
        };
    }
    return {
        error: null,
        success: true,
        data: courses,
    };
}

export const getDegrees = async (user: string, supabase: SupabaseClient<Database>) => {
    NProgress.set(0.3);
    NProgress.start();
    const { data, error } = await supabase
        .from("Degree")
        .select(`
            *,
            Degree_Term (
                Degree_Term_Course (
                    count
                )
            ),
            major(
                name,
                Major_Course (
                    count
                )
            )
        `, { count: "exact" })
        .eq("created_by", user)
        .limit(6);
    NProgress.done();
    if (error) {
        return {
            error: error.message,
            success: false,
            data: null,
        };
    }
    return {
        error: null,
        success: true,
        data,
    };
}

export const getSingleTerms = async (user: string, supabase: SupabaseClient<Database>) => {
    NProgress.set(0.3);
    NProgress.start();
    const { data, error } = await supabase
        .from("Single_Term")
        .select(`
            *,
            Single_Term_Section (
                count
            ),
            major(
                name,
                Major_Course (
                    count
                )
            )
        `)
        .eq("created_by", user)
        .limit(6);
    NProgress.done();
    if (error) {
        return {
            error: error.message,
            success: false,
            data: null,
        };
    }
    return {
        error: null,
        success: true,
        data,
    };
}

export const getMajors = async (supabase: SupabaseClient<Database>) => {
    NProgress.set(0.3);
    NProgress.start();
    const { data, error } = await supabase
        .from("Majors")
        .select(`
            name,
            type
        `);
    NProgress.done();
    if (error) {
        return {
            error: error.message,
            success: false,
            data: null,
        };
    }
    return {
        error: null,
        success: true,
        data,
    };
}

export const setSelected = async (supabase: SupabaseClient<Database>, id: string, degree: string, parent: string) => {
    NProgress.set(0.3);
    NProgress.start();
    const { data: data2, error: error2 } = await supabase
        .from("Major_Course_Selected")
        .delete()
        .match({ parent, degree });
    const { data, error } = await supabase
        .from("Major_Course_Selected")
        .insert({
            course: id,
            degree,
            parent,
        })
        .select("id");
    NProgress.done();
    if (error) {
        return {
            error: error.message,
            success: false,
            data: null,
        };
    }
    return {
        error: null,
        success: true,
        data,
    }
}