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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_reports: {
        Row: {
          ai_prediction: string
          confidence_score: number | null
          created_at: string | null
          documents: string[] | null
          id: string
          patient_id: string
          status: string
          symptoms: string
          updated_at: string | null
        }
        Insert: {
          ai_prediction: string
          confidence_score?: number | null
          created_at?: string | null
          documents?: string[] | null
          id?: string
          patient_id: string
          status?: string
          symptoms: string
          updated_at?: string | null
        }
        Update: {
          ai_prediction?: string
          confidence_score?: number | null
          created_at?: string | null
          documents?: string[] | null
          id?: string
          patient_id?: string
          status?: string
          symptoms?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      doctor_verifications: {
        Row: {
          action: string
          created_at: string | null
          doctor_id: string
          feedback: string | null
          id: string
          report_id: string
          verified_at: string | null
          verified_summary: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          doctor_id: string
          feedback?: string | null
          id?: string
          report_id: string
          verified_at?: string | null
          verified_summary?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          doctor_id?: string
          feedback?: string | null
          id?: string
          report_id?: string
          verified_at?: string | null
          verified_summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctor_verifications_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "ai_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      health_records: {
        Row: {
          attachments: string[] | null
          created_at: string
          diagnosis: string | null
          doctor_name: string | null
          id: string
          notes: string | null
          prescription: string | null
          record_date: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string
          diagnosis?: string | null
          doctor_name?: string | null
          id?: string
          notes?: string | null
          prescription?: string | null
          record_date: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: string[] | null
          created_at?: string
          diagnosis?: string | null
          doctor_name?: string | null
          id?: string
          notes?: string | null
          prescription?: string | null
          record_date?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      intern_reviews: {
        Row: {
          corrections: string | null
          created_at: string | null
          forwarded_to_doctor: boolean | null
          id: string
          intern_id: string
          notes: string | null
          report_id: string
          verified_at: string | null
        }
        Insert: {
          corrections?: string | null
          created_at?: string | null
          forwarded_to_doctor?: boolean | null
          id?: string
          intern_id: string
          notes?: string | null
          report_id: string
          verified_at?: string | null
        }
        Update: {
          corrections?: string | null
          created_at?: string | null
          forwarded_to_doctor?: boolean | null
          id?: string
          intern_id?: string
          notes?: string | null
          report_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "intern_reviews_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "ai_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          availability: string[] | null
          avatar_url: string | null
          bio: string | null
          certifications: string[] | null
          created_at: string
          education: string[] | null
          free_community_hours: number | null
          full_name: string
          hospital: string | null
          id: string
          learning_goals: string[] | null
          phone: string | null
          rating: number | null
          role: string
          skills: string[] | null
          specialty: string | null
          study_year: number | null
          supervisor_id: string | null
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          availability?: string[] | null
          avatar_url?: string | null
          bio?: string | null
          certifications?: string[] | null
          created_at?: string
          education?: string[] | null
          free_community_hours?: number | null
          full_name: string
          hospital?: string | null
          id: string
          learning_goals?: string[] | null
          phone?: string | null
          rating?: number | null
          role: string
          skills?: string[] | null
          specialty?: string | null
          study_year?: number | null
          supervisor_id?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          availability?: string[] | null
          avatar_url?: string | null
          bio?: string | null
          certifications?: string[] | null
          created_at?: string
          education?: string[] | null
          free_community_hours?: number | null
          full_name?: string
          hospital?: string | null
          id?: string
          learning_goals?: string[] | null
          phone?: string | null
          rating?: number | null
          role?: string
          skills?: string[] | null
          specialty?: string | null
          study_year?: number | null
          supervisor_id?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "doctor" | "intern" | "patient"
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
      app_role: ["admin", "doctor", "intern", "patient"],
    },
  },
} as const
