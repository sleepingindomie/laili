export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          address: string | null
          joined_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          joined_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          joined_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: number
          name: string
          price: number
          description: string | null
          image_url: string | null
          category: string | null
          stock_status: 'available' | 'limited' | 'out_of_stock'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          price: number
          description?: string | null
          image_url?: string | null
          category?: string | null
          stock_status?: 'available' | 'limited' | 'out_of_stock'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          price?: number
          description?: string | null
          image_url?: string | null
          category?: string | null
          stock_status?: 'available' | 'limited' | 'out_of_stock'
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: number
          title: string
          instructor: string
          duration: string
          type: string
          status: 'available' | 'coming_soon'
          description: string | null
          video_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          instructor: string
          duration: string
          type: string
          status?: 'available' | 'coming_soon'
          description?: string | null
          video_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          instructor?: string
          duration?: string
          type?: string
          status?: 'available' | 'coming_soon'
          description?: string | null
          video_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      coaching_sessions: {
        Row: {
          id: number
          title: string
          date: string
          time: string
          coach: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          date: string
          time: string
          coach: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          date?: string
          time?: string
          coach?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sales: {
        Row: {
          id: number
          user_id: string
          total_amount: number
          month: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          total_amount: number
          month: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          total_amount?: number
          month?: string
          created_at?: string
        }
      }
      points: {
        Row: {
          id: number
          user_id: string
          total_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          total_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          total_points?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: number
          user_id: string
          status: 'active' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          status?: 'active' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          status?: 'active' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
