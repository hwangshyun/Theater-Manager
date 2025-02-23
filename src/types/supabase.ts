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
      locations: {
        Row: {
          id: string
          max_posters: number
          name: string
          order_num: number
          type: string
          user_id: string
        }
        Insert: {
          id?: string
          max_posters: number
          name: string
          order_num: number
          type: string
          user_id: string
        }
        Update: {
          id?: string
          max_posters?: number
          name?: string
          order_num?: number
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      movies: {
        Row: {
          count: string | null
          date: string | null
          id: string
          posterurl: string | null
          rating: number | null
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          count?: string | null
          date?: string | null
          id: string
          posterurl?: string | null
          rating?: number | null
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          count?: string | null
          date?: string | null
          id?: string
          posterurl?: string | null
          rating?: number | null
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      notice: {
        Row: {
          created_at: string
          id: number
          title: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          title?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      offers: {
        Row: {
          content: string | null
          id: string
          images: Json | null
          methods: Json | null
          movieId: string
          period: string | null
          user_id: string | null
          week: string | null
        }
        Insert: {
          content?: string | null
          id?: string
          images?: Json | null
          methods?: Json | null
          movieId: string
          period?: string | null
          user_id?: string | null
          week?: string | null
        }
        Update: {
          content?: string | null
          id?: string
          images?: Json | null
          methods?: Json | null
          movieId?: string
          period?: string | null
          user_id?: string | null
          week?: string | null
        }
        Relationships: []
      }
      posterlocations: {
        Row: {
          id: string
          location: string | null
          order_num: number | null
          poster_url: string | null
          title: string | null
          type: string | null
          user_id: string
          location_name: string | null
        }
        Insert: {
          id?: string
          location?: string | null
          order_num?: number | null
          poster_url?: string | null
          title?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          id?: string
          location?: string | null
          order_num?: number | null
          poster_url?: string | null
          title?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ratings: {
        Row: {
          id: string
          movie_id: string
          rating: number
        }
        Insert: {
          id: string
          movie_id: string
          rating: number
        }
        Update: {
          id?: string
          movie_id?: string
          rating?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          nickname: string | null
          password: string | null
          username: string
        }
        Insert: {
          id?: string
          nickname?: string | null
          password?: string | null
          username: string
        }
        Update: {
          id?: string
          nickname?: string | null
          password?: string | null
          username?: string
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
