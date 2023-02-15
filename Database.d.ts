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
          name: string
          prerequisites_misc: string[]
        }
        Insert: {
          code: string
          credits: number
          name: string
          prerequisites_misc?: string[]
        }
        Update: {
          code?: string
          credits?: number
          name?: string
          prerequisites_misc?: string[]
        }
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
      }
      Major_Course_GE: {
        Row: {
          color: string | null
          course: string | null
          group: string | null
          id: number
          major: string | null
          parent: string | null
          x: string | null
          y: string | null
        }
        Insert: {
          color?: string | null
          course?: string | null
          group?: string | null
          id?: number
          major?: string | null
          parent?: string | null
          x?: string | null
          y?: string | null
        }
        Update: {
          color?: string | null
          course?: string | null
          group?: string | null
          id?: number
          major?: string | null
          parent?: string | null
          x?: string | null
          y?: string | null
        }
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
  }
}
