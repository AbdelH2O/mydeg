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

export const addTerm = async (degree: string, name: string, supabase: SupabaseClient<Database>) => {
    // const id = uuid();
    NProgress.set(0.3);
    NProgress.start();
    const { data, error } = await supabase
        .from("Degree_Term")
        .insert({
            degree,
            name,
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