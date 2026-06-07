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
      admin_logs: {
        Row: {
          action: string
          admin_email: string | null
          created_at: string | null
          details: Json | null
          id: string
        }
        Insert: {
          action: string
          admin_email?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
        }
        Update: {
          action?: string
          admin_email?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
        }
        Relationships: []
      }
      fabric_partners: {
        Row: {
          address: string | null
          commission_percent: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          phone: string | null
          shop_name: string
        }
        Insert: {
          address?: string | null
          commission_percent?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          shop_name: string
        }
        Update: {
          address?: string | null
          commission_percent?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          shop_name?: string
        }
        Relationships: []
      }
      fabrics: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          partner_id: string
          price_per_meter: number
          type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
          partner_id: string
          price_per_meter: number
          type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          partner_id?: string
          price_per_meter?: number
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fabrics_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "fabric_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          commission: number | null
          created_at: string | null
          customer_address: string | null
          customer_name: string
          customer_phone: string
          delivery_date: string | null
          fabric_description: string | null
          fabric_provided: boolean | null
          garment_type: string
          id: string
          measurement_notes: string | null
          order_number: string
          price: number
          status: string | null
          tailor_id: string | null
          updated_at: string | null
        }
        Insert: {
          commission?: number | null
          created_at?: string | null
          customer_address?: string | null
          customer_name: string
          customer_phone: string
          delivery_date?: string | null
          fabric_description?: string | null
          fabric_provided?: boolean | null
          garment_type: string
          id?: string
          measurement_notes?: string | null
          order_number?: string
          price: number
          status?: string | null
          tailor_id?: string | null
          updated_at?: string | null
        }
        Update: {
          commission?: number | null
          created_at?: string | null
          customer_address?: string | null
          customer_name?: string
          customer_phone?: string
          delivery_date?: string | null
          fabric_description?: string | null
          fabric_provided?: boolean | null
          garment_type?: string
          id?: string
          measurement_notes?: string | null
          order_number?: string
          price?: number
          status?: string | null
          tailor_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_tailor_id_fkey"
            columns: ["tailor_id"]
            isOneToOne: false
            referencedRelation: "tailors"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          customer_phone: string
          id: string
          order_id: string
          rating: number
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          customer_phone: string
          id?: string
          order_id: string
          rating: number
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          customer_phone?: string
          id?: string
          order_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      tailors: {
        Row: {
          address: string | null
          base_price_pant: number | null
          base_price_shirt: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          lat: number | null
          lng: number | null
          name: string
          phone: string
          photos: string[] | null
          rating: number | null
          shop_name: string | null
          specialties: string[] | null
          subscription_status: string | null
          total_orders: number | null
        }
        Insert: {
          address?: string | null
          base_price_pant?: number | null
          base_price_shirt?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          lat?: number | null
          lng?: number | null
          name: string
          phone: string
          photos?: string[] | null
          rating?: number | null
          shop_name?: string | null
          specialties?: string[] | null
          subscription_status?: string | null
          total_orders?: number | null
        }
        Update: {
          address?: string | null
          base_price_pant?: number | null
          base_price_shirt?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          lat?: number | null
          lng?: number | null
          name?: string
          phone?: string
          photos?: string[] | null
          rating?: number | null
          shop_name?: string | null
          specialties?: string[] | null
          subscription_status?: string | null
          total_orders?: number | null
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
  }
}
