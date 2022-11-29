import supabase from "./supabaseClient";
import uuid from "./uuid";

export const addCourse = async (term: string, course: string) => {
    const { data, error } = await supabase
        .from("Degree_Term_Course")
        .insert({
            term,
            course,
        });
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
    const { data, error } = await supabase
        .from("Degree_Term")
        .insert({
            id,
            degree,
            name,
        });
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
    const { data, error } = await supabase
        .from("Degree")
        .insert({
            id: uuid(),
            major,
            minor,
        });
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
    const { data, error } = await supabase
        .from("Degree_Term_Course")
        .delete()
        .match({ term, course });
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
