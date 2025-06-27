export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attendance_records: {
        Row: {
          attendance_type: Database["public"]["Enums"]["Attendance_Type"]
          created_at: string
          event_id: number
          id: number
          recorded_time: string
          student_id: string
        }
        Insert: {
          attendance_type: Database["public"]["Enums"]["Attendance_Type"]
          created_at?: string
          event_id: number
          id?: number
          recorded_time: string
          student_id: string
        }
        Update: {
          attendance_type?: Database["public"]["Enums"]["Attendance_Type"]
          created_at?: string
          event_id?: number
          id?: number
          recorded_time?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendace_records_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendace_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id_number"]
          },
        ]
      }
      attendance_slots: {
        Row: {
          created_at: string
          event_id: number
          fine_amount: number
          id: number
          trigger_time: string
          type: Database["public"]["Enums"]["Attendance_Type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          event_id: number
          fine_amount: number
          id?: number
          trigger_time: string
          type: Database["public"]["Enums"]["Attendance_Type"]
          updated_at?: string | null
        }
        Update: {
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
      events: {
        Row: {
          created_at: string
          custom_email_subject: string
          date: string
          id: number
          name: string
          organization_id: number
          self_attendance_link_id: number
        }
        Insert: {
          created_at?: string
          custom_email_subject?: string
          date: string
          id?: number
          name?: string
          organization_id: number
          self_attendance_link_id: number
        }
        Update: {
          created_at?: string
          custom_email_subject?: string
          date?: string
          id?: number
          name?: string
          organization_id?: number
          self_attendance_link_id?: number
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
            foreignKeyName: "events_self_attendance_link_id_fkey"
            columns: ["self_attendance_link_id"]
            isOneToOne: false
            referencedRelation: "self_attendance_codes"
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
      organizations: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string
        }
        Update: {
          created_at?: string
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
          is_paid: boolean
          student_id: string
          type: Database["public"]["Enums"]["Payable_Type"]
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          id?: number
          is_paid?: boolean
          student_id: string
          type: Database["public"]["Enums"]["Payable_Type"]
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          id?: number
          is_paid?: boolean
          student_id?: string
          type?: Database["public"]["Enums"]["Payable_Type"]
        }
        Relationships: [
          {
            foreignKeyName: "payables_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id_number"]
          },
        ]
      }
      receipts: {
        Row: {
          created_at: string
          id: number
          paid_amount: number
          paid_on: string
          payable_id: number
          remarks: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          paid_amount: number
          paid_on: string
          payable_id: number
          remarks?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          paid_amount?: number
          paid_on?: string
          payable_id?: number
          remarks?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipts_payable_id_fkey"
            columns: ["payable_id"]
            isOneToOne: false
            referencedRelation: "payables"
            referencedColumns: ["id"]
          },
        ]
      }
      self_attendance_codes: {
        Row: {
          created_at: string
          id: number
          link_text: string
        }
        Insert: {
          created_at?: string
          id?: number
          link_text?: string
        }
        Update: {
          created_at?: string
          id?: number
          link_text?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          created_at: string
          degree: string
          email_address: string
          first_name: string
          last_name: string
          major: string | null
          middle_name: string | null
          organization_id: number
          program: string
          student_id_number: string
          year: number
        }
        Insert: {
          created_at?: string
          degree?: string
          email_address?: string
          first_name?: string
          last_name?: string
          major?: string | null
          middle_name?: string | null
          organization_id: number
          program: string
          student_id_number?: string
          year: number
        }
        Update: {
          created_at?: string
          degree?: string
          email_address?: string
          first_name?: string
          last_name?: string
          major?: string | null
          middle_name?: string | null
          organization_id?: number
          program?: string
          student_id_number?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "students_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["User_Roles"]
          student_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string
          id?: string
          role: Database["public"]["Enums"]["User_Roles"]
          student_id: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["User_Roles"]
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id_number"]
          },
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
      Attendance_Type: "time_in" | "time_out"
      Payable_Type: "fee" | "fine"
      User_Roles: "admin" | "non_admin" | "student" | "super"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      Attendance_Type: ["time_in", "time_out"],
      Payable_Type: ["fee", "fine"],
      User_Roles: ["admin", "non_admin", "student", "super"],
    },
  },
} as const
