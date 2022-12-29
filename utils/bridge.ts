import supabase from "./supabaseClient";
import uuid from "./uuid";
import NProgress from "nprogress";

export const addCourse = async (term: string, course: string) => {
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

export const addTerm = async (degree: string, name: string) => {
    const id = uuid();
    NProgress.set(0.3);
    NProgress.start();
    const { data, error } = await supabase
        .from("Degree_Term")
        .insert({
            id,
            degree,
            name,
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
        id,
    };
}

export const addDegree = async (major: string, minor: string) => {
    NProgress.set(0.3);
    NProgress.start();
    const { data, error } = await supabase
        .from("Degree")
        .insert({
            id: uuid(),
            major,
            minor,
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

export const removeCourse = async (term: string, course: string) => {
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
