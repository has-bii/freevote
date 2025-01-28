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
      choices: {
        Row: {
          created_at: string
          description: string
          id: string
          image: string | null
          link: string | null
          name: string
          voting_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image?: string | null
          link?: string | null
          name: string
          voting_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image?: string | null
          link?: string | null
          name?: string
          voting_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "choices_voting_id_fkey"
            columns: ["voting_id"]
            isOneToOne: false
            referencedRelation: "votings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          full_name: string
          id: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          full_name: string
          id?: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          full_name?: string
          id?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          choices: string[]
          created_at: string
          description: string | null
          id: string
          name: string
          session_end_at: string
          session_start_at: string
          voting_id: string
        }
        Insert: {
          choices?: string[]
          created_at?: string
          description?: string | null
          id?: string
          name: string
          session_end_at: string
          session_start_at: string
          voting_id: string
        }
        Update: {
          choices?: string[]
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          session_end_at?: string
          session_start_at?: string
          voting_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_voting_id_fkey"
            columns: ["voting_id"]
            isOneToOne: false
            referencedRelation: "votings"
            referencedColumns: ["id"]
          },
        ]
      }
      voters: {
        Row: {
          created_at: string
          id: number
          user_id: string
          voting_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          user_id?: string
          voting_id: string
        }
        Update: {
          created_at?: string
          id?: never
          user_id?: string
          voting_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voters_voting_id_fkey"
            columns: ["voting_id"]
            isOneToOne: false
            referencedRelation: "votings"
            referencedColumns: ["id"]
          },
        ]
      }
      votings: {
        Row: {
          created_at: string
          description: string | null
          icon: string
          id: string
          is_open: boolean
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          is_open?: boolean
          name: string
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          is_open?: boolean
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      end_expired_voting_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      voting_type: "voting" | "nomination"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

