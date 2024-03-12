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
          num_of_duplicates: number | null
          uploaded_count: number
        }
        Insert: {
          adg_matches?: Json | null
          adg_misses?: Json[] | null
          airtable_record?: string | null
          created_at?: string
          id?: string
          matches_completed?: boolean
          num_of_duplicates?: number | null
          uploaded_count?: number
        }
        Update: {
          adg_matches?: Json | null
          adg_misses?: Json[] | null
          airtable_record?: string | null
          created_at?: string
          id?: string
          matches_completed?: boolean
          num_of_duplicates?: number | null
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
      customers: {
        Row: {
          created_at: string
          customer_number: string | null
          email_address: string | null
          email_addresses: string[] | null
          id: string
          name: string
          person_name: string | null
        }
        Insert: {
          created_at?: string
          customer_number?: string | null
          email_address?: string | null
          email_addresses?: string[] | null
          id?: string
          name: string
          person_name?: string | null
        }
        Update: {
          created_at?: string
          customer_number?: string | null
          email_address?: string | null
          email_addresses?: string[] | null
          id?: string
          name?: string
          person_name?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          id: number
          message: string
          pathname: string | null
          user: string
        }
        Insert: {
          created_at?: string
          id?: number
          message: string
          pathname?: string | null
          user: string
        }
        Update: {
          created_at?: string
          id?: number
          message?: string
          pathname?: string | null
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_feedback_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
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
          firm: string
          id: string
          name: string
          step: number
          type: Database["public"]["Enums"]["form_type"]
          user: string
        }
        Insert: {
          created_at?: string
          firm: string
          id?: string
          name: string
          step: number
          type: Database["public"]["Enums"]["form_type"]
          user: string
        }
        Update: {
          created_at?: string
          firm?: string
          id?: string
          name?: string
          step?: number
          type?: Database["public"]["Enums"]["form_type"]
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_firm_fkey"
            columns: ["firm"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_form_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      forms: {
        Row: {
          commercial: boolean
          created_at: string
          deleted: boolean
          form: string
          id: number
          product: number | null
          response: Json | null
          rfq: number | null
          solicitation_matched: string | null
          submitted: boolean
          submitted_by: string | null
          submitted_timestamp: string | null
        }
        Insert: {
          commercial?: boolean
          created_at?: string
          deleted?: boolean
          form: string
          id?: number
          product?: number | null
          response?: Json | null
          rfq?: number | null
          solicitation_matched?: string | null
          submitted?: boolean
          submitted_by?: string | null
          submitted_timestamp?: string | null
        }
        Update: {
          commercial?: boolean
          created_at?: string
          deleted?: boolean
          form?: string
          id?: number
          product?: number | null
          response?: Json | null
          rfq?: number | null
          solicitation_matched?: string | null
          submitted?: boolean
          submitted_by?: string | null
          submitted_timestamp?: string | null
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
            foreignKeyName: "public_forms_product_fkey"
            columns: ["product"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_forms_rfq_fkey"
            columns: ["rfq"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_forms_submitted_by_fkey"
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
          description: string | null
          firm: string
          id: string
          level: number | null
          name: string
          nsns: boolean
          rules: Json[]
        }
        Insert: {
          created_at?: string
          description?: string | null
          firm: string
          id?: string
          level?: number | null
          name: string
          nsns?: boolean
          rules?: Json[]
        }
        Update: {
          created_at?: string
          description?: string | null
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
      product_final_pricing: {
        Row: {
          created_at: string
          final_pricing: number
          id: number
          product: number
          quantity: number
        }
        Insert: {
          created_at?: string
          final_pricing: number
          id?: number
          product: number
          quantity: number
        }
        Update: {
          created_at?: string
          final_pricing?: number
          id?: number
          product?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_product_final_pricing_product_fkey"
            columns: ["product"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      product_labor_minutes: {
        Row: {
          created_at: string
          id: number
          labor_minutes: number
          product: number
        }
        Insert: {
          created_at?: string
          id?: number
          labor_minutes: number
          product: number
        }
        Update: {
          created_at?: string
          id?: number
          labor_minutes?: number
          product?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_product_labor_minutes_product_fkey"
            columns: ["product"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      product_purchasing: {
        Row: {
          created_at: string
          id: number
          lead_time: number
          material_cost: number
          product: number
        }
        Insert: {
          created_at?: string
          id?: number
          lead_time: number
          material_cost: number
          product: number
        }
        Update: {
          created_at?: string
          id?: number
          lead_time?: number
          material_cost?: number
          product?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_product_purchasing_product_fkey"
            columns: ["product"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          active: boolean
          created_at: string
          cross_reference: string | null
          description: string | null
          firm: string | null
          id: number
          labor_minutes: number | null
          material_cost: number | null
          nsn: number | null
          number: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          cross_reference?: string | null
          description?: string | null
          firm?: string | null
          id?: number
          labor_minutes?: number | null
          material_cost?: number | null
          nsn?: number | null
          number: string
        }
        Update: {
          active?: boolean
          created_at?: string
          cross_reference?: string | null
          description?: string | null
          firm?: string | null
          id?: number
          labor_minutes?: number | null
          material_cost?: number | null
          nsn?: number | null
          number?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_products_firm_fkey"
            columns: ["firm"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_products_nsn_fkey"
            columns: ["nsn"]
            isOneToOne: false
            referencedRelation: "nsns"
            referencedColumns: ["id"]
          }
        ]
      }
      removed_options: {
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
      rfqs: {
        Row: {
          created_at: string
          customer: string
          deleted: boolean
          firm: string
          id: number
          notes: string | null
          quote_number: string | null
          received_at: string
          requested_return_date: string | null
          resale: boolean
          response_timestamp: string | null
          status: string[]
        }
        Insert: {
          created_at?: string
          customer: string
          deleted?: boolean
          firm: string
          id?: number
          notes?: string | null
          quote_number?: string | null
          received_at: string
          requested_return_date?: string | null
          resale?: boolean
          response_timestamp?: string | null
          status?: string[]
        }
        Update: {
          created_at?: string
          customer?: string
          deleted?: boolean
          firm?: string
          id?: number
          notes?: string | null
          quote_number?: string | null
          received_at?: string
          requested_return_date?: string | null
          resale?: boolean
          response_timestamp?: string | null
          status?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "public_rfqs_customer_fkey"
            columns: ["customer"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_rfqs_firm_fkey"
            columns: ["firm"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          }
        ]
      }
      rfqs_comments: {
        Row: {
          created_at: string
          form: number | null
          id: number
          message: string
          rfq: number
          user: string
        }
        Insert: {
          created_at?: string
          form?: number | null
          id?: number
          message: string
          rfq: number
          user: string
        }
        Update: {
          created_at?: string
          form?: number | null
          id?: number
          message?: string
          rfq?: number
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_rfqs_comments_form_fkey"
            columns: ["form"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_rfqs_comments_rfq_fkey"
            columns: ["rfq"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_rfqs_comments_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      rfqs_products: {
        Row: {
          created_at: string
          id: number
          product: number
          product_labor_minutes: number | null
          rfq: number
        }
        Insert: {
          created_at?: string
          id?: number
          product: number
          product_labor_minutes?: number | null
          rfq: number
        }
        Update: {
          created_at?: string
          id?: number
          product?: number
          product_labor_minutes?: number | null
          rfq?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_rfqs_products_product_fkey"
            columns: ["product"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_rfqs_products_product_labor_minutes_fkey"
            columns: ["product_labor_minutes"]
            isOneToOne: false
            referencedRelation: "product_labor_minutes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_rfqs_products_rfq_fkey"
            columns: ["rfq"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          }
        ]
      }
      rfqs_products_quantities: {
        Row: {
          created_at: string
          id: number
          lead_time: number | null
          material_cost: number | null
          product_final_pricing: number | null
          quantity: number
          rfqs_product: number
        }
        Insert: {
          created_at?: string
          id?: number
          lead_time?: number | null
          material_cost?: number | null
          product_final_pricing?: number | null
          quantity: number
          rfqs_product: number
        }
        Update: {
          created_at?: string
          id?: number
          lead_time?: number | null
          material_cost?: number | null
          product_final_pricing?: number | null
          quantity?: number
          rfqs_product?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_rfqs_products_quantities_product_final_pricing_fkey"
            columns: ["product_final_pricing"]
            isOneToOne: false
            referencedRelation: "product_final_pricing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_rfqs_products_quantities_rfqs_product_fkey"
            columns: ["rfqs_product"]
            isOneToOne: false
            referencedRelation: "rfqs_products"
            referencedColumns: ["id"]
          }
        ]
      }
      rfqs_uploaded: {
        Row: {
          created_at: string
          error: Json | null
          id: number
          public: boolean
          rfq: number | null
          success: boolean
          user: string | null
          values: Json
        }
        Insert: {
          created_at?: string
          error?: Json | null
          id?: number
          public?: boolean
          rfq?: number | null
          success?: boolean
          user?: string | null
          values: Json
        }
        Update: {
          created_at?: string
          error?: Json | null
          id?: number
          public?: boolean
          rfq?: number | null
          success?: boolean
          user?: string | null
          values?: Json
        }
        Relationships: [
          {
            foreignKeyName: "public_rfqs_uploaded_rfq_fkey"
            columns: ["rfq"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_rfqs_uploaded_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      solicitations: {
        Row: {
          ael: Json[] | null
          amsc: string | null
          apl: Json[] | null
          availability: Json[] | null
          award_history: Json[] | null
          batch: string
          bid_link: string | null
          bsm: Json[] | null
          company_awarded: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          contract_status: string | null
          created_at: string
          date_awarded: string | null
          days_to_deliver: number | null
          description: string | null
          dla_forecast: Json | null
          estimated_value: number | null
          expires_on: string
          first_article: boolean
          fob: string | null
          freight: Json[] | null
          general: Json[] | null
          gsaproc: Json[] | null
          higher_quality: boolean | null
          historical: Json[] | null
          iands: Json[] | null
          id: string
          inspection_location: string | null
          is_duplicate: boolean
          is_duplicate_fixed: boolean
          issued_on: string
          line_number: string | null
          line_number_niin: string | null
          mcrl: Json[] | null
          mlc: Json[] | null
          moe: Json[] | null
          nsn: number
          nsn_id: Json[] | null
          packaging: Json[] | null
          pb_matching_details: string | null
          phrase_data: Json[] | null
          pid: string | null
          price_won_at: number | null
          purchase_request_number: string | null
          quantity: number
          quantity_units: string | null
          request_number: string | null
          set_aside: Database["public"]["Enums"]["set_aside"] | null
          shipping_address: string | null
          solicitation_url: string | null
          source: string | null
          tech_docs: string | null
          technical_characteristics: Json[] | null
          vendors: Json[] | null
          weapon_systems: Json[] | null
        }
        Insert: {
          ael?: Json[] | null
          amsc?: string | null
          apl?: Json[] | null
          availability?: Json[] | null
          award_history?: Json[] | null
          batch: string
          bid_link?: string | null
          bsm?: Json[] | null
          company_awarded?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contract_status?: string | null
          created_at?: string
          date_awarded?: string | null
          days_to_deliver?: number | null
          description?: string | null
          dla_forecast?: Json | null
          estimated_value?: number | null
          expires_on: string
          first_article?: boolean
          fob?: string | null
          freight?: Json[] | null
          general?: Json[] | null
          gsaproc?: Json[] | null
          higher_quality?: boolean | null
          historical?: Json[] | null
          iands?: Json[] | null
          id: string
          inspection_location?: string | null
          is_duplicate?: boolean
          is_duplicate_fixed?: boolean
          issued_on: string
          line_number?: string | null
          line_number_niin?: string | null
          mcrl?: Json[] | null
          mlc?: Json[] | null
          moe?: Json[] | null
          nsn: number
          nsn_id?: Json[] | null
          packaging?: Json[] | null
          pb_matching_details?: string | null
          phrase_data?: Json[] | null
          pid?: string | null
          price_won_at?: number | null
          purchase_request_number?: string | null
          quantity: number
          quantity_units?: string | null
          request_number?: string | null
          set_aside?: Database["public"]["Enums"]["set_aside"] | null
          shipping_address?: string | null
          solicitation_url?: string | null
          source?: string | null
          tech_docs?: string | null
          technical_characteristics?: Json[] | null
          vendors?: Json[] | null
          weapon_systems?: Json[] | null
        }
        Update: {
          ael?: Json[] | null
          amsc?: string | null
          apl?: Json[] | null
          availability?: Json[] | null
          award_history?: Json[] | null
          batch?: string
          bid_link?: string | null
          bsm?: Json[] | null
          company_awarded?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contract_status?: string | null
          created_at?: string
          date_awarded?: string | null
          days_to_deliver?: number | null
          description?: string | null
          dla_forecast?: Json | null
          estimated_value?: number | null
          expires_on?: string
          first_article?: boolean
          fob?: string | null
          freight?: Json[] | null
          general?: Json[] | null
          gsaproc?: Json[] | null
          higher_quality?: boolean | null
          historical?: Json[] | null
          iands?: Json[] | null
          id?: string
          inspection_location?: string | null
          is_duplicate?: boolean
          is_duplicate_fixed?: boolean
          issued_on?: string
          line_number?: string | null
          line_number_niin?: string | null
          mcrl?: Json[] | null
          mlc?: Json[] | null
          moe?: Json[] | null
          nsn?: number
          nsn_id?: Json[] | null
          packaging?: Json[] | null
          pb_matching_details?: string | null
          phrase_data?: Json[] | null
          pid?: string | null
          price_won_at?: number | null
          purchase_request_number?: string | null
          quantity?: number
          quantity_units?: string | null
          request_number?: string | null
          set_aside?: Database["public"]["Enums"]["set_aside"] | null
          shipping_address?: string | null
          solicitation_url?: string | null
          source?: string | null
          tech_docs?: string | null
          technical_characteristics?: Json[] | null
          vendors?: Json[] | null
          weapon_systems?: Json[] | null
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
          auto_removed: boolean
          bid_exception: boolean | null
          bid_partners: string[]
          bid_timestamp: string | null
          bom_url: string | null
          company_awarded: string | null
          created_at: string
          date_awarded: string | null
          estimated_labor_minutes: number | null
          estimated_material_cost: number | null
          estimated_purchasing_days: number | null
          exception_notes: string | null
          familiarity_status: string
          firm: string
          first_article_lead_time: number | null
          first_article_price: number | null
          first_article_waive_request_honored: boolean | null
          first_article_waive_requested: boolean | null
          flagged: boolean
          id: string
          matching_rule: string
          no_bid_reason: string | null
          price_won_at: number | null
          quote_number: string | null
          removed: boolean
          removed_option: string | null
          requires_special_equipment: boolean | null
          skip_engineering: boolean
          solicitation: string
          special_equipment_notes: string | null
          status: string[]
          unit_price: number | null
        }
        Insert: {
          auto_removed?: boolean
          bid_exception?: boolean | null
          bid_partners?: string[]
          bid_timestamp?: string | null
          bom_url?: string | null
          company_awarded?: string | null
          created_at?: string
          date_awarded?: string | null
          estimated_labor_minutes?: number | null
          estimated_material_cost?: number | null
          estimated_purchasing_days?: number | null
          exception_notes?: string | null
          familiarity_status?: string
          firm: string
          first_article_lead_time?: number | null
          first_article_price?: number | null
          first_article_waive_request_honored?: boolean | null
          first_article_waive_requested?: boolean | null
          flagged?: boolean
          id?: string
          matching_rule: string
          no_bid_reason?: string | null
          price_won_at?: number | null
          quote_number?: string | null
          removed?: boolean
          removed_option?: string | null
          requires_special_equipment?: boolean | null
          skip_engineering?: boolean
          solicitation: string
          special_equipment_notes?: string | null
          status?: string[]
          unit_price?: number | null
        }
        Update: {
          auto_removed?: boolean
          bid_exception?: boolean | null
          bid_partners?: string[]
          bid_timestamp?: string | null
          bom_url?: string | null
          company_awarded?: string | null
          created_at?: string
          date_awarded?: string | null
          estimated_labor_minutes?: number | null
          estimated_material_cost?: number | null
          estimated_purchasing_days?: number | null
          exception_notes?: string | null
          familiarity_status?: string
          firm?: string
          first_article_lead_time?: number | null
          first_article_price?: number | null
          first_article_waive_request_honored?: boolean | null
          first_article_waive_requested?: boolean | null
          flagged?: boolean
          id?: string
          matching_rule?: string
          no_bid_reason?: string | null
          price_won_at?: number | null
          quote_number?: string | null
          removed?: boolean
          removed_option?: string | null
          requires_special_equipment?: boolean | null
          skip_engineering?: boolean
          solicitation?: string
          special_equipment_notes?: string | null
          status?: string[]
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_solicitations_matched_removed_option_fkey"
            columns: ["removed_option"]
            isOneToOne: false
            referencedRelation: "removed_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_solicitations_matched_solicitation_fkey"
            columns: ["solicitation"]
            isOneToOne: false
            referencedRelation: "solicitations"
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
            foreignKeyName: "solicitations_matched_matching_rule_fkey"
            columns: ["matching_rule"]
            isOneToOne: false
            referencedRelation: "matching_rules"
            referencedColumns: ["id"]
          }
        ]
      }
      solicitations_matched_comments: {
        Row: {
          created_at: string
          form: number | null
          id: string
          message: string
          solicitation_matched: string
          user: string
        }
        Insert: {
          created_at?: string
          form?: number | null
          id?: string
          message: string
          solicitation_matched: string
          user: string
        }
        Update: {
          created_at?: string
          form?: number | null
          id?: string
          message?: string
          solicitation_matched?: string
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_solicitations_matched_comments_form_fkey"
            columns: ["form"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_solicitations_matched_comments_solicitation_matched_fkey"
            columns: ["solicitation_matched"]
            isOneToOne: false
            referencedRelation: "solicitations_matched"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_solicitations_matched_comments_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          admin: boolean
          created_at: string
          email: string
          firm: string
          id: string
          name: string
        }
        Insert: {
          admin: boolean
          created_at?: string
          email: string
          firm?: string
          id: string
          name: string
        }
        Update: {
          admin?: boolean
          created_at?: string
          email?: string
          firm?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_users_firm_fkey"
            columns: ["firm"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
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
        | "enter_quote"
        | "bid"
        | "final_pricing"
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
