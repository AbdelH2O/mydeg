export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Course: {
        Row: {
          code: string
          credits: number
          description: string | null
          name: string
          prerequisites_misc: string[]
        }
        Insert: {
          code: string
          credits: number
          description?: string | null
          name: string
          prerequisites_misc?: string[]
        }
        Update: {
          code?: string
          credits?: number
          description?: string | null
          name?: string
          prerequisites_misc?: string[]
        }
        Relationships: []
      }
      Course_Course: {
        Row: {
          course: string
          group: number
          id: number
          requisite: string
          type: string
        }
        Insert: {
          course: string
          group?: number
          id?: number
          requisite: string
          type?: string
        }
        Update: {
          course?: string
          group?: number
          id?: number
          requisite?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "Course_Course_course_fkey"
            columns: ["course"]
            referencedRelation: "Course"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "Course_Course_requisite_fkey"
            columns: ["requisite"]
            referencedRelation: "Course"
            referencedColumns: ["code"]
          }
        ]
      }
      Degree: {
        Row: {
          access: string[]
          created_at: string
          created_by: string
          id: string
          last_change: string
          major: string
          minor: string
          special: string | null
          start: number
          year: string
        }
        Insert: {
          access?: string[]
          created_at?: string
          created_by: string
          id?: string
          last_change?: string
          major: string
          minor: string
          special?: string | null
          start?: number
          year?: string
        }
        Update: {
          access?: string[]
          created_at?: string
          created_by?: string
          id?: string
          last_change?: string
          major?: string
          minor?: string
          special?: string | null
          start?: number
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "Degree_major_fkey"
            columns: ["major"]
            referencedRelation: "Majors"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "Degree_minor_fkey"
            columns: ["minor"]
            referencedRelation: "Majors"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "Degree_special_fkey"
            columns: ["special"]
            referencedRelation: "Majors"
            referencedColumns: ["name"]
          }
        ]
      }
      Degree_Term: {
        Row: {
          created_at: string
          degree: string
          id: string
          type: string
          year: string
        }
        Insert: {
          created_at?: string
          degree: string
          id?: string
          type?: string
          year: string
        }
        Update: {
          created_at?: string
          degree?: string
          id?: string
          type?: string
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "Degree_Term_degree_fkey"
            columns: ["degree"]
            referencedRelation: "Degree"
            referencedColumns: ["id"]
          }
        ]
      }
      Degree_Term_Course: {
        Row: {
          course: string
          id: number
          term: string
        }
        Insert: {
          course: string
          id?: number
          term: string
        }
        Update: {
          course?: string
          id?: number
          term?: string
        }
        Relationships: [
          {
            foreignKeyName: "Degree_Term_Course_course_fkey"
            columns: ["course"]
            referencedRelation: "Course"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "Degree_Term_Course_term_fkey"
            columns: ["term"]
            referencedRelation: "Degree_Term"
            referencedColumns: ["id"]
          }
        ]
      }
      Major_Course: {
        Row: {
          color: string
          course: string
          group: number
          id: number
          major: string
          parent: string | null
          x: number
          y: number
        }
        Insert: {
          color?: string
          course: string
          group?: number
          id?: number
          major: string
          parent?: string | null
          x?: number
          y?: number
        }
        Update: {
          color?: string
          course?: string
          group?: number
          id?: number
          major?: string
          parent?: string | null
          x?: number
          y?: number
        }
        Relationships: [
          {
            foreignKeyName: "Major_Course_course_fkey"
            columns: ["course"]
            referencedRelation: "Course"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "Major_Course_major_fkey"
            columns: ["major"]
            referencedRelation: "Majors"
            referencedColumns: ["name"]
          }
        ]
      }
      Major_Course_Selected: {
        Row: {
          course: string
          degree: string
          id: number
          parent: string
        }
        Insert: {
          course: string
          degree: string
          id?: number
          parent: string
        }
        Update: {
          course?: string
          degree?: string
          id?: number
          parent?: string
        }
        Relationships: [
          {
            foreignKeyName: "Major_Course_Selected_course_fkey"
            columns: ["course"]
            referencedRelation: "Course"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "Major_Course_Selected_degree_fkey"
            columns: ["degree"]
            referencedRelation: "Degree"
            referencedColumns: ["id"]
          }
        ]
      }
      Majors: {
        Row: {
          catalog: string
          name: string
          type: string
        }
        Insert: {
          catalog: string
          name: string
          type?: string
        }
        Update: {
          catalog?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      Professor: {
        Row: {
          keywords: string[]
          name: string
          rating: number
        }
        Insert: {
          keywords: string[]
          name: string
          rating?: number
        }
        Update: {
          keywords?: string[]
          name?: string
          rating?: number
        }
        Relationships: []
      }
      Section: {
        Row: {
          course: string
          days: string
          end_time: string
          id: string
          professor: string
          raw_schedule: string
          start_time: string
          term: string
        }
        Insert: {
          course?: string
          days?: string
          end_time?: string
          id?: string
          professor?: string
          raw_schedule?: string
          start_time?: string
          term?: string
        }
        Update: {
          course?: string
          days?: string
          end_time?: string
          id?: string
          professor?: string
          raw_schedule?: string
          start_time?: string
          term?: string
        }
        Relationships: [
          {
            foreignKeyName: "Section_course_fkey"
            columns: ["course"]
            referencedRelation: "Course"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "Section_professor_fkey"
            columns: ["professor"]
            referencedRelation: "Professor"
            referencedColumns: ["name"]
          }
        ]
      }
      Single_Term: {
        Row: {
          access: string[]
          created_at: string | null
          created_by: string
          id: string
          last_change: string
          major: string
          minor: string | null
          term: string
        }
        Insert: {
          access?: string[]
          created_at?: string | null
          created_by: string
          id?: string
          last_change?: string
          major: string
          minor?: string | null
          term: string
        }
        Update: {
          access?: string[]
          created_at?: string | null
          created_by?: string
          id?: string
          last_change?: string
          major?: string
          minor?: string | null
          term?: string
        }
        Relationships: [
          {
            foreignKeyName: "Single_Term_major_fkey"
            columns: ["major"]
            referencedRelation: "Majors"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "Single_Term_minor_fkey"
            columns: ["minor"]
            referencedRelation: "Majors"
            referencedColumns: ["name"]
          }
        ]
      }
      Single_Term_Section: {
        Row: {
          id: number
          section: string
          term: string
        }
        Insert: {
          id?: number
          section: string
          term: string
        }
        Update: {
          id?: number
          section?: string
          term?: string
        }
        Relationships: [
          {
            foreignKeyName: "Single_Term_Section_section_fkey"
            columns: ["section"]
            referencedRelation: "Section"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Single_Term_Section_term_fkey"
            columns: ["term"]
            referencedRelation: "Single_Term"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
