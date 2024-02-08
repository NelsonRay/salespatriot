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
      batches: {
        Row: {
          adg_matches: Json | null
          adg_misses: Json[] | null
          airtable_record: string | null
          created_at: string
          id: string
          matches_completed: boolean
          uploaded_count: number
        }
        Insert: {
          adg_matches?: Json | null
          adg_misses?: Json[] | null
          airtable_record?: string | null
          created_at?: string
          id?: string
          matches_completed?: boolean
          uploaded_count?: number
        }
        Update: {
          adg_matches?: Json | null
          adg_misses?: Json[] | null
          airtable_record?: string | null
          created_at?: string
          id?: string
          matches_completed?: boolean
          uploaded_count?: number
        }
        Relationships: []
      }
      bid_partners: {
        Row: {
          created_at: string
          firm: string
          id: string
          name: string
          set_aside: Database["public"]["Enums"]["set_aside"] | null
        }
        Insert: {
          created_at?: string
          firm: string
          id?: string
          name: string
          set_aside?: Database["public"]["Enums"]["set_aside"] | null
        }
        Update: {
          created_at?: string
          firm?: string
          id?: string
          name?: string
          set_aside?: Database["public"]["Enums"]["set_aside"] | null
        }
        Relationships: [
          {
            foreignKeyName: "bid_partners_firm_fkey"
            columns: ["firm"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          }
        ]
      }
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
          submitted_by: string | null
        }
        Insert: {
          created_at?: string
          form: string
          id?: number
          response?: Json | null
          response_timestamp?: string | null
          solicitation_matched: string
          submitted?: boolean
          submitted_by?: string | null
        }
        Update: {
          created_at?: string
          form?: string
          id?: number
          response?: Json | null
          response_timestamp?: string | null
          solicitation_matched?: string
          submitted?: boolean
          submitted_by?: string | null
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
          },
          {
            foreignKeyName: "forms_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      matching_nsns: {
        Row: {
          created_at: string
          description: string | null
          firm: string
          id: string
          nsn: number
          part_number: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          firm: string
          id?: string
          nsn: number
          part_number: string
        }
        Update: {
          created_at?: string
          description?: string | null
          firm?: string
          id?: string
          nsn?: number
          part_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "matching_nsns_firm_fkey"
            columns: ["firm"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matching_nsns_nsn_fkey"
            columns: ["nsn"]
            isOneToOne: false
            referencedRelation: "nsns"
            referencedColumns: ["id"]
          }
        ]
      }
      matching_rules: {
        Row: {
          created_at: string
          firm: string
          id: string
          level: number | null
          name: string
          nsns: boolean
          rules: Json[]
        }
        Insert: {
          created_at?: string
          firm: string
          id?: string
          level?: number | null
          name: string
          nsns?: boolean
          rules?: Json[]
        }
        Update: {
          created_at?: string
          firm?: string
          id?: string
          level?: number | null
          name?: string
          nsns?: boolean
          rules?: Json[]
        }
        Relationships: [
          {
            foreignKeyName: "matching_rules_firm_fkey"
            columns: ["firm"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          }
        ]
      }
      nsns: {
        Row: {
          created_at: string
          description: string | null
          id: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
        }
        Relationships: []
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
          amsc: string
          award_history: Json[] | null
          batch: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          contract_status: string | null
          created_at: string
          days_to_deliver: number | null
          description: string | null
          dla_forecast: Json | null
          estimated_value: number | null
          expires_on: string
          first_article: boolean
          id: string
          issued_on: string
          line_number: string | null
          nsn: number
          number: string
          pb_matching_details: string | null
          quantity: number
          quantity_units: string | null
          set_aside: Database["public"]["Enums"]["set_aside"] | null
          solicitation_url: string | null
          tech_docs: string | null
          vendors: Json[] | null
        }
        Insert: {
          amsc: string
          award_history?: Json[] | null
          batch: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contract_status?: string | null
          created_at?: string
          days_to_deliver?: number | null
          description?: string | null
          dla_forecast?: Json | null
          estimated_value?: number | null
          expires_on: string
          first_article?: boolean
          id?: string
          issued_on: string
          line_number?: string | null
          nsn: number
          number: string
          pb_matching_details?: string | null
          quantity: number
          quantity_units?: string | null
          set_aside?: Database["public"]["Enums"]["set_aside"] | null
          solicitation_url?: string | null
          tech_docs?: string | null
          vendors?: Json[] | null
        }
        Update: {
          amsc?: string
          award_history?: Json[] | null
          batch?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contract_status?: string | null
          created_at?: string
          days_to_deliver?: number | null
          description?: string | null
          dla_forecast?: Json | null
          estimated_value?: number | null
          expires_on?: string
          first_article?: boolean
          id?: string
          issued_on?: string
          line_number?: string | null
          nsn?: number
          number?: string
          pb_matching_details?: string | null
          quantity?: number
          quantity_units?: string | null
          set_aside?: Database["public"]["Enums"]["set_aside"] | null
          solicitation_url?: string | null
          tech_docs?: string | null
          vendors?: Json[] | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitations_batch_fkey"
            columns: ["batch"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitations_nsn_fkey"
            columns: ["nsn"]
            isOneToOne: false
            referencedRelation: "nsns"
            referencedColumns: ["id"]
          }
        ]
      }
      solicitations_matched: {
        Row: {
          bid_exception: boolean
          bid_notes: string | null
          bom_notes: string | null
          bom_url: string | null
          created_at: string
          engineering_notes: string | null
          estimated_labor_hours: number | null
          estimated_purchasing_budget: number | null
          estimated_purchasing_days: number | null
          exception_notes: string | null
          firm: string
          id: string
          labor_notes: string | null
          matching_rule: string
          opportunity_notes: string | null
          price_per_unit: number | null
          purchasing_notes: string | null
          quote_number: string | null
          review_notes: string | null
          skip_engineering: boolean
          solicitation: string
          special_equipment: string | null
          status: string[]
        }
        Insert: {
          bid_exception?: boolean
          bid_notes?: string | null
          bom_notes?: string | null
          bom_url?: string | null
          created_at?: string
          engineering_notes?: string | null
          estimated_labor_hours?: number | null
          estimated_purchasing_budget?: number | null
          estimated_purchasing_days?: number | null
          exception_notes?: string | null
          firm: string
          id?: string
          labor_notes?: string | null
          matching_rule: string
          opportunity_notes?: string | null
          price_per_unit?: number | null
          purchasing_notes?: string | null
          quote_number?: string | null
          review_notes?: string | null
          skip_engineering?: boolean
          solicitation: string
          special_equipment?: string | null
          status?: string[]
        }
        Update: {
          bid_exception?: boolean
          bid_notes?: string | null
          bom_notes?: string | null
          bom_url?: string | null
          created_at?: string
          engineering_notes?: string | null
          estimated_labor_hours?: number | null
          estimated_purchasing_budget?: number | null
          estimated_purchasing_days?: number | null
          exception_notes?: string | null
          firm?: string
          id?: string
          labor_notes?: string | null
          matching_rule?: string
          opportunity_notes?: string | null
          price_per_unit?: number | null
          purchasing_notes?: string | null
          quote_number?: string | null
          review_notes?: string | null
          skip_engineering?: boolean
          solicitation?: string
          special_equipment?: string | null
          status?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "solicitations_matched_firm_fkey"
            columns: ["firm"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitations_matched_matching_rule_fkey"
            columns: ["matching_rule"]
            isOneToOne: false
            referencedRelation: "matching_rules"
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
