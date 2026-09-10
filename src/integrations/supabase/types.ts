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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      event_checkins: {
        Row: {
          attendee_id: string
          checkin_time: string
          created_at: string
          device_id: string | null
          id: string
          method: string
        }
        Insert: {
          attendee_id: string
          checkin_time?: string
          created_at?: string
          device_id?: string | null
          id?: string
          method: string
        }
        Update: {
          attendee_id?: string
          checkin_time?: string
          created_at?: string
          device_id?: string | null
          id?: string
          method?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_checkins_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      event_config: {
        Row: {
          active_from: string | null
          active_until: string | null
          created_at: string
          event_name: string
          id: string
          kiosk_mode: boolean
          updated_at: string
        }
        Insert: {
          active_from?: string | null
          active_until?: string | null
          created_at?: string
          event_name: string
          id?: string
          kiosk_mode?: boolean
          updated_at?: string
        }
        Update: {
          active_from?: string | null
          active_until?: string | null
          created_at?: string
          event_name?: string
          id?: string
          kiosk_mode?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          additional_message: string | null
          attendee_denomination: string | null
          attendee_email: string
          attendee_name: string
          attendee_phone: string | null
          attendee_role: string | null
          attendee_title: string | null
          check_in_id: string | null
          check_in_url: string | null
          created_at: string
          email_sent: boolean | null
          event_date: string
          event_location: string | null
          event_name: string
          event_time: string | null
          id: string
          number_of_attendees: number | null
          registration_type: string | null
          updated_at: string
          whatsapp_sent: boolean | null
        }
        Insert: {
          additional_message?: string | null
          attendee_denomination?: string | null
          attendee_email: string
          attendee_name: string
          attendee_phone?: string | null
          attendee_role?: string | null
          attendee_title?: string | null
          check_in_id?: string | null
          check_in_url?: string | null
          created_at?: string
          email_sent?: boolean | null
          event_date: string
          event_location?: string | null
          event_name: string
          event_time?: string | null
          id?: string
          number_of_attendees?: number | null
          registration_type?: string | null
          updated_at?: string
          whatsapp_sent?: boolean | null
        }
        Update: {
          additional_message?: string | null
          attendee_denomination?: string | null
          attendee_email?: string
          attendee_name?: string
          attendee_phone?: string | null
          attendee_role?: string | null
          attendee_title?: string | null
          check_in_id?: string | null
          check_in_url?: string | null
          created_at?: string
          email_sent?: boolean | null
          event_date?: string
          event_location?: string | null
          event_name?: string
          event_time?: string | null
          id?: string
          number_of_attendees?: number | null
          registration_type?: string | null
          updated_at?: string
          whatsapp_sent?: boolean | null
        }
        Relationships: []
      }
      images: {
        Row: {
          category: string
          id: string
          name: string
          uploaded_at: string | null
          url: string
        }
        Insert: {
          category: string
          id?: string
          name: string
          uploaded_at?: string | null
          url: string
        }
        Update: {
          category?: string
          id?: string
          name?: string
          uploaded_at?: string | null
          url?: string
        }
        Relationships: []
      }
      pledges: {
        Row: {
          created_at: string
          currency: string
          email_sent: boolean | null
          event_name: string
          id: string
          message: string | null
          pledge_amount: number
          pledger_email: string
          pledger_name: string
          pledger_phone: string | null
          updated_at: string
          whatsapp_sent: boolean | null
        }
        Insert: {
          created_at?: string
          currency?: string
          email_sent?: boolean | null
          event_name?: string
          id?: string
          message?: string | null
          pledge_amount: number
          pledger_email: string
          pledger_name: string
          pledger_phone?: string | null
          updated_at?: string
          whatsapp_sent?: boolean | null
        }
        Update: {
          created_at?: string
          currency?: string
          email_sent?: boolean | null
          event_name?: string
          id?: string
          message?: string | null
          pledge_amount?: number
          pledger_email?: string
          pledger_name?: string
          pledger_phone?: string | null
          updated_at?: string
          whatsapp_sent?: boolean | null
        }
        Relationships: []
      }
      qa_questions: {
        Row: {
          author_name: string
          created_at: string
          id: string
          is_dismissed: boolean
          is_highlighted: boolean
          question: string
        }
        Insert: {
          author_name: string
          created_at?: string
          id?: string
          is_dismissed?: boolean
          is_highlighted?: boolean
          question: string
        }
        Update: {
          author_name?: string
          created_at?: string
          id?: string
          is_dismissed?: boolean
          is_highlighted?: boolean
          question?: string
        }
        Relationships: []
      }
      sermons: {
        Row: {
          audio_url: string | null
          created_at: string
          date: string
          description: string | null
          downloads: number | null
          duration: string | null
          featured: boolean | null
          id: string
          series: string | null
          speaker: string
          speaker_image: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          views: number | null
          youtube_id: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          date: string
          description?: string | null
          downloads?: number | null
          duration?: string | null
          featured?: boolean | null
          id?: string
          series?: string | null
          speaker: string
          speaker_image?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          views?: number | null
          youtube_id?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          date?: string
          description?: string | null
          downloads?: number | null
          duration?: string | null
          featured?: boolean | null
          id?: string
          series?: string | null
          speaker?: string
          speaker_image?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          views?: number | null
          youtube_id?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          email: string
          first_name: string | null
          groups: string[] | null
          id: string
          last_contact_date: string | null
          last_name: string | null
          source: string
          subscribe_date: string
          unsubscribed: boolean
        }
        Insert: {
          email: string
          first_name?: string | null
          groups?: string[] | null
          id?: string
          last_contact_date?: string | null
          last_name?: string | null
          source?: string
          subscribe_date?: string
          unsubscribed?: boolean
        }
        Update: {
          email?: string
          first_name?: string | null
          groups?: string[] | null
          id?: string
          last_contact_date?: string | null
          last_name?: string | null
          source?: string
          subscribe_date?: string
          unsubscribed?: boolean
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
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
