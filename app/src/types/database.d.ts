export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      choices: {
        Row: {
          color: string
          created_at: string
          description: string
          id: string
          image: string | null
          link: string | null
          name: string
          voting_id: string
        }
        Insert: {
          color: string
          created_at?: string
          description: string
          id?: string
          image?: string | null
          link?: string | null
          name: string
          voting_id: string
        }
        Update: {
          color?: string
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
          }
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
          }
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
      voting_type: "voting" | "nomination"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

