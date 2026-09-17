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
      menu_items: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          short_description: string | null
          price: number
          category: string
          image_url: string | null
          is_sold_out: boolean
          variants: Json | null
          extras: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          short_description?: string | null
          price: number
          category: string
          image_url?: string | null
          is_sold_out?: boolean
          variants?: Json | null
          extras?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          short_description?: string | null
          price?: number
          category?: string
          image_url?: string | null
          is_sold_out?: boolean
          variants?: Json | null
          extras?: Json | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_token: string
          customer_name: string
          customer_phone: string
          customer_email: string | null
          delivery_address: string
          items: Json
          subtotal: number
          paystack_reference: string | null
          payment_status: string
          order_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_token: string
          customer_name: string
          customer_phone: string
          customer_email?: string | null
          delivery_address: string
          items: Json
          subtotal: number
          paystack_reference?: string | null
          payment_status?: string
          order_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_token?: string
          customer_name?: string
          customer_phone?: string
          customer_email?: string | null
          delivery_address?: string
          items?: Json
          subtotal?: number
          paystack_reference?: string | null
          payment_status?: string
          order_status?: string
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          menu_item_id: string
          customer_name: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          menu_item_id: string
          customer_name: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          menu_item_id?: string
          customer_name?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
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
