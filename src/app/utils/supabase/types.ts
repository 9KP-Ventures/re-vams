export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      attendance_codes: {
        Row: {
          attendance_slot_id: number
          created_at: string
          id: number
          link_text: string
        }
        Insert: {
          attendance_slot_id: number
          created_at?: string
          id?: number
          link_text?: string
        }
        Update: {
          attendance_slot_id?: number
          created_at?: string
          id?: number
          link_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_codes_attendance_slot_id_fkey"
            columns: ["attendance_slot_id"]
            isOneToOne: false
            referencedRelation: "attendance_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          attendance_type: Database["public"]["Enums"]["Attendance_Type"]
          created_at: string
          id: number
          recorded_time: string
          slot_id: number
          student_id: string
        }
        Insert: {
          attendance_type: Database["public"]["Enums"]["Attendance_Type"]
          created_at?: string
          id?: number
          recorded_time: string
          slot_id: number
          student_id: string
        }
        Update: {
          attendance_type?: Database["public"]["Enums"]["Attendance_Type"]
          created_at?: string
          id?: number
          recorded_time?: string
          slot_id?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "attendance_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_slots: {
        Row: {
          attendance_code_expiration: string
          created_at: string
          event_id: number
          fine_amount: number
          id: number
          trigger_time: string
          type: Database["public"]["Enums"]["Attendance_Type"]
          updated_at: string | null
        }
        Insert: {
          attendance_code_expiration: string
          created_at?: string
          event_id: number
          fine_amount: number
          id?: number
          trigger_time: string
          type: Database["public"]["Enums"]["Attendance_Type"]
          updated_at?: string | null
        }
        Update: {
          attendance_code_expiration?: string
          created_at?: string
          event_id?: number
          fine_amount?: number
          id?: number
          trigger_time?: string
          type?: Database["public"]["Enums"]["Attendance_Type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_requirements_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      degrees: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          custom_email_message: string
          custom_email_subject: string
          date: string
          id: number
          name: string
          organization_id: number
          semester_id: number
          status: Database["public"]["Enums"]["Status"]
        }
        Insert: {
          created_at?: string
          custom_email_message: string
          custom_email_subject?: string
          date: string
          id?: number
          name?: string
          organization_id: number
          semester_id: number
          status?: Database["public"]["Enums"]["Status"]
        }
        Update: {
          created_at?: string
          custom_email_message?: string
          custom_email_subject?: string
          date?: string
          id?: number
          name?: string
          organization_id?: number
          semester_id?: number
          status?: Database["public"]["Enums"]["Status"]
        }
        Relationships: [
          {
            foreignKeyName: "events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
        ]
      }
      fees: {
        Row: {
          description: string | null
          id: number
          name: string
          organization_id: number
          payable_id: number
        }
        Insert: {
          description?: string | null
          id?: number
          name?: string
          organization_id: number
          payable_id: number
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
          organization_id?: number
          payable_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fees_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fees_payable_id_fkey"
            columns: ["payable_id"]
            isOneToOne: false
            referencedRelation: "payables"
            referencedColumns: ["id"]
          },
        ]
      }
      fines: {
        Row: {
          id: number
          payable_id: number
          slot_id: number
        }
        Insert: {
          id?: number
          payable_id: number
          slot_id: number
        }
        Update: {
          id?: number
          payable_id?: number
          slot_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fines_payable_id_fkey"
            columns: ["payable_id"]
            isOneToOne: false
            referencedRelation: "payables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fines_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "attendance_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      majors: {
        Row: {
          id: number
          name: string
          program_id: number | null
        }
        Insert: {
          id?: number
          name: string
          program_id?: number | null
        }
        Update: {
          id?: number
          name?: string
          program_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "majors_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_students: {
        Row: {
          abandon_date: string | null
          custom_role: Database["public"]["Enums"]["User_Roles"]
          id: number
          joined_date: string
          organization_id: number
          student_id: string
        }
        Insert: {
          abandon_date?: string | null
          custom_role: Database["public"]["Enums"]["User_Roles"]
          id?: number
          joined_date?: string
          organization_id: number
          student_id: string
        }
        Update: {
          abandon_date?: string | null
          custom_role?: Database["public"]["Enums"]["User_Roles"]
          id?: number
          joined_date?: string
          organization_id?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_student_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_student_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          custom_role: Database["public"]["Enums"]["User_Roles"]
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          custom_role: Database["public"]["Enums"]["User_Roles"]
          description?: string | null
          id?: number
          name?: string
        }
        Update: {
          created_at?: string
          custom_role?: Database["public"]["Enums"]["User_Roles"]
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      payables: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          id: number
          status: Database["public"]["Enums"]["Payment_Status"] | null
          student_id: string
          type: Database["public"]["Enums"]["Payable_Type"]
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          id?: number
          status?: Database["public"]["Enums"]["Payment_Status"] | null
          student_id: string
          type: Database["public"]["Enums"]["Payable_Type"]
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          id?: number
          status?: Database["public"]["Enums"]["Payment_Status"] | null
          student_id?: string
          type?: Database["public"]["Enums"]["Payable_Type"]
        }
        Relationships: [
          {
            foreignKeyName: "payables_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      payables_receipts: {
        Row: {
          created_at: string
          id: number
          payable_id: number | null
          receipt_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          payable_id?: number | null
          receipt_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          payable_id?: number | null
          receipt_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payables_receipts_payable_id_fkey"
            columns: ["payable_id"]
            isOneToOne: false
            referencedRelation: "payables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payables_receipts_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      receipts: {
        Row: {
          created_at: string
          id: number
          paid_amount: number
          remarks: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          paid_amount: number
          remarks?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          paid_amount?: number
          remarks?: string | null
        }
        Relationships: []
      }
      semesters: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          created_at: string
          degree_id: number
          email_address: string
          first_name: string
          id: string
          last_name: string
          major_id: number | null
          middle_name: string | null
          program_id: number
          year_level_id: number
        }
        Insert: {
          created_at?: string
          degree_id: number
          email_address?: string
          first_name?: string
          id: string
          last_name?: string
          major_id?: number | null
          middle_name?: string | null
          program_id: number
          year_level_id: number
        }
        Update: {
          created_at?: string
          degree_id?: number
          email_address?: string
          first_name?: string
          id?: string
          last_name?: string
          major_id?: number | null
          middle_name?: string | null
          program_id?: number
          year_level_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "students_degree_id_fkey"
            columns: ["degree_id"]
            isOneToOne: false
            referencedRelation: "degrees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_major_id_fkey"
            columns: ["major_id"]
            isOneToOne: false
            referencedRelation: "majors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_year_level_id_fkey"
            columns: ["year_level_id"]
            isOneToOne: false
            referencedRelation: "year_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          active: boolean
          created_at: string
          id: string
          student_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          student_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      year_levels: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      Attendance_Type: "TIME_IN" | "TIME_OUT"
      Payable_Type: "fee" | "fine"
      Payment_Status: "pending" | "partially_paid" | "paid" | "overdue"
      Status: "upcoming" | "on_going" | "completed"
      User_Roles: "admin" | "non_admin" | "student" | "super"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      Attendance_Type: ["TIME_IN", "TIME_OUT"],
      Payable_Type: ["fee", "fine"],
      Payment_Status: ["pending", "partially_paid", "paid", "overdue"],
      Status: ["upcoming", "on_going", "completed"],
      User_Roles: ["admin", "non_admin", "student", "super"],
    },
  },
} as const
