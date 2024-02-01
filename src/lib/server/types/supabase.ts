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
      firms: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      forms: {
        Row: {
          created_at: string
          fields: Json[]
          id: number
          name: string
          response: Json | null
          response_timestamp: string | null
          solicitation_matched: string
          user: string | null
        }
        Insert: {
          created_at?: string
          fields: Json[]
          id?: number
          name: string
          response?: Json | null
          response_timestamp?: string | null
          solicitation_matched: string
          user?: string | null
        }
        Update: {
          created_at?: string
          fields?: Json[]
          id?: number
          name?: string
          response?: Json | null
          response_timestamp?: string | null
          solicitation_matched?: string
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forms_solicitation_matched_fkey"
            columns: ["solicitation_matched"]
            isOneToOne: false
            referencedRelation: "solicitations_matched"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forms_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      oem_rfqs: {
        Row: {
          created_at: string
          firm: string
          id: string
        }
        Insert: {
          created_at?: string
          firm: string
          id?: string
        }
        Update: {
          created_at?: string
          firm?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oem_rfqs_firm_fkey"
            columns: ["firm"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          }
        ]
      }
      solicitations: {
        Row: {
          created_at: string
          id: string
          number: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          number?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          number?: string | null
        }
        Relationships: []
      }
      solicitations_matched: {
        Row: {
          award_status: string | null
          bid_notes: string | null
          bid_status: string | null
          created_at: string
          engineering_notes: string | null
          engineering_status: string | null
          firm: string
          id: string
          labor_notes: string | null
          labor_status: string | null
          opportunity_notes: string | null
          opportunity_status: string | null
          purchasing_notes: string | null
          purchasing_status: string | null
          solicitation: string
        }
        Insert: {
          award_status?: string | null
          bid_notes?: string | null
          bid_status?: string | null
          created_at?: string
          engineering_notes?: string | null
          engineering_status?: string | null
          firm: string
          id?: string
          labor_notes?: string | null
          labor_status?: string | null
          opportunity_notes?: string | null
          opportunity_status?: string | null
          purchasing_notes?: string | null
          purchasing_status?: string | null
          solicitation: string
        }
        Update: {
          award_status?: string | null
          bid_notes?: string | null
          bid_status?: string | null
          created_at?: string
          engineering_notes?: string | null
          engineering_status?: string | null
          firm?: string
          id?: string
          labor_notes?: string | null
          labor_status?: string | null
          opportunity_notes?: string | null
          opportunity_status?: string | null
          purchasing_notes?: string | null
          purchasing_status?: string | null
          solicitation?: string
        }
        Relationships: [
          {
            foreignKeyName: "solicitations_matched_award_status_fkey"
            columns: ["award_status"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitations_matched_bid_status_fkey"
            columns: ["bid_status"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitations_matched_engineering_status_fkey"
            columns: ["engineering_status"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitations_matched_firm_fkey"
            columns: ["firm"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitations_matched_labor_status_fkey"
            columns: ["labor_status"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitations_matched_opportunity_status_fkey"
            columns: ["opportunity_status"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitations_matched_purchasing_status_fkey"
            columns: ["purchasing_status"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitations_matched_solicitation_fkey"
            columns: ["solicitation"]
            isOneToOne: false
            referencedRelation: "solicitations"
            referencedColumns: ["id"]
          }
        ]
      }
      tags: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          type: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          name: string
          type: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          firm: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          firm: string
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          firm?: string
          id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_firm_fkey"
            columns: ["firm"]
            isOneToOne: false
            referencedRelation: "firms"
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
