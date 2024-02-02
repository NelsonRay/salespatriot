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
      form: {
        Row: {
          created_at: string
          id: string
          matched_fields: Json[]
          name: string
          solicitation_fields: string[]
          type: Database["public"]["Enums"]["form_type"]
          user: string
        }
        Insert: {
          created_at?: string
          id?: string
          matched_fields: Json[]
          name: string
          solicitation_fields: string[]
          type: Database["public"]["Enums"]["form_type"]
          user: string
        }
        Update: {
          created_at?: string
          id?: string
          matched_fields?: Json[]
          name?: string
          solicitation_fields?: string[]
          type?: Database["public"]["Enums"]["form_type"]
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      forms: {
        Row: {
          created_at: string
          form: string
          id: number
          response: Json | null
          response_timestamp: string | null
          solicitation_matched: string
          submitted: boolean
        }
        Insert: {
          created_at?: string
          form: string
          id?: number
          response?: Json | null
          response_timestamp?: string | null
          solicitation_matched: string
          submitted?: boolean
        }
        Update: {
          created_at?: string
          form?: string
          id?: number
          response?: Json | null
          response_timestamp?: string | null
          solicitation_matched?: string
          submitted?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "forms_form_fkey"
            columns: ["form"]
            isOneToOne: false
            referencedRelation: "form"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forms_solicitation_matched_fkey"
            columns: ["solicitation_matched"]
            isOneToOne: false
            referencedRelation: "solicitations_matched"
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
          award_history: string | null
          contract_status: string | null
          created_at: string
          days_to_deliver: number
          description: string | null
          estimated_value: string | null
          expires_on: string
          first_article: boolean
          id: string
          issued_on: string
          nsn: string
          number: string | null
          quantity: number
          set_aside: Database["public"]["Enums"]["set_aside"] | null
          solicitation_url: string | null
          tech_docs: string | null
        }
        Insert: {
          award_history?: string | null
          contract_status?: string | null
          created_at?: string
          days_to_deliver: number
          description?: string | null
          estimated_value?: string | null
          expires_on: string
          first_article?: boolean
          id?: string
          issued_on: string
          nsn: string
          number?: string | null
          quantity: number
          set_aside?: Database["public"]["Enums"]["set_aside"] | null
          solicitation_url?: string | null
          tech_docs?: string | null
        }
        Update: {
          award_history?: string | null
          contract_status?: string | null
          created_at?: string
          days_to_deliver?: number
          description?: string | null
          estimated_value?: string | null
          expires_on?: string
          first_article?: boolean
          id?: string
          issued_on?: string
          nsn?: string
          number?: string | null
          quantity?: number
          set_aside?: Database["public"]["Enums"]["set_aside"] | null
          solicitation_url?: string | null
          tech_docs?: string | null
        }
        Relationships: []
      }
      solicitations_matched: {
        Row: {
          award_status: string | null
          bid_exception: boolean
          bid_notes: string | null
          bid_status: string | null
          bom_notes: string | null
          bom_status: string | null
          bom_url: string | null
          created_at: string
          engineering_notes: string | null
          engineering_status: string | null
          estimated_purchasing_days: number | null
          exception_notes: string | null
          firm: string
          id: string
          labor_notes: string | null
          labor_status: string | null
          opportunity_notes: string | null
          opportunity_status: string | null
          price_per_unit: number | null
          purchasing_notes: string | null
          purchasing_status: string | null
          quote_number: string | null
          review_notes: string | null
          review_status: string | null
          skip_engineering: boolean
          solicitation: string
          special_equipment: string | null
        }
        Insert: {
          award_status?: string | null
          bid_exception?: boolean
          bid_notes?: string | null
          bid_status?: string | null
          bom_notes?: string | null
          bom_status?: string | null
          bom_url?: string | null
          created_at?: string
          engineering_notes?: string | null
          engineering_status?: string | null
          estimated_purchasing_days?: number | null
          exception_notes?: string | null
          firm: string
          id?: string
          labor_notes?: string | null
          labor_status?: string | null
          opportunity_notes?: string | null
          opportunity_status?: string | null
          price_per_unit?: number | null
          purchasing_notes?: string | null
          purchasing_status?: string | null
          quote_number?: string | null
          review_notes?: string | null
          review_status?: string | null
          skip_engineering?: boolean
          solicitation: string
          special_equipment?: string | null
        }
        Update: {
          award_status?: string | null
          bid_exception?: boolean
          bid_notes?: string | null
          bid_status?: string | null
          bom_notes?: string | null
          bom_status?: string | null
          bom_url?: string | null
          created_at?: string
          engineering_notes?: string | null
          engineering_status?: string | null
          estimated_purchasing_days?: number | null
          exception_notes?: string | null
          firm?: string
          id?: string
          labor_notes?: string | null
          labor_status?: string | null
          opportunity_notes?: string | null
          opportunity_status?: string | null
          price_per_unit?: number | null
          purchasing_notes?: string | null
          purchasing_status?: string | null
          quote_number?: string | null
          review_notes?: string | null
          review_status?: string | null
          skip_engineering?: boolean
          solicitation?: string
          special_equipment?: string | null
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
            foreignKeyName: "solicitations_matched_bom_status_fkey"
            columns: ["bom_status"]
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
            foreignKeyName: "solicitations_matched_review_status_fkey"
            columns: ["review_status"]
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
          level: number
          name: string
          type: Database["public"]["Enums"]["tag_type"] | null
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          level: number
          name: string
          type?: Database["public"]["Enums"]["tag_type"] | null
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          level?: number
          name?: string
          type?: Database["public"]["Enums"]["tag_type"] | null
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
      form_type:
        | "opportunity"
        | "engineering"
        | "bom"
        | "purchasing"
        | "labor"
        | "review"
        | "bid"
      set_aside:
        | "HUB Zone"
        | "Small Business"
        | "Women Owned"
        | "Veteran Owned"
        | "8A"
        | "Other - Error"
      tag_type:
        | "opportunity_status"
        | "engineering_status"
        | "bom_status"
        | "purchasing_status"
        | "labor_status"
        | "review_status"
        | "bid_status"
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
