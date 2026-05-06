export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface OpeningHoursDay {
  open: boolean
  start: string
  end: string
}

export type OpeningHours = Record<string, OpeningHoursDay>

export interface Service {
  title: string
  description?: string
  price?: string
}

export interface Database {
  public: {
    Tables: {
      businesses: {
        Relationships: []
        Row: {
          id: string
          slug: string | null
          name: string
          owner_name: string | null
          owner_id: string | null
          pending_email: string | null
          categories: string[]
          description: string
          tagline: string | null
          founding_year: number | null
          location: string
          postcode: string
          phone: string | null
          email: string | null
          website: string | null
          social_facebook: string | null
          social_twitter: string | null
          social_tiktok: string | null
          social_instagram: string | null
          social_linkedin: string | null
          image_url: string | null
          logo_url: string | null
          photos: string[]
          opening_hours: OpeningHours | null
          services: Service[] | null
          is_women_owned: boolean
          is_home_based: boolean
          is_startup: boolean
          is_featured: boolean
          status: 'live' | 'paused' | 'draft' | 'pending'
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug?: string | null
          name: string
          owner_name?: string | null
          owner_id?: string | null
          pending_email?: string | null
          categories?: string[]
          description: string
          tagline?: string | null
          founding_year?: number | null
          location: string
          postcode: string
          phone?: string | null
          email?: string | null
          website?: string | null
          social_facebook?: string | null
          social_twitter?: string | null
          social_tiktok?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          image_url?: string | null
          logo_url?: string | null
          photos?: string[]
          opening_hours?: OpeningHours | null
          services?: Service[] | null
          is_women_owned?: boolean
          is_home_based?: boolean
          is_startup?: boolean
          is_featured?: boolean
          status?: 'live' | 'paused' | 'draft' | 'pending'
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string | null
          name?: string
          owner_name?: string | null
          owner_id?: string | null
          pending_email?: string | null
          categories?: string[]
          description?: string
          tagline?: string | null
          founding_year?: number | null
          location?: string
          postcode?: string
          phone?: string | null
          email?: string | null
          website?: string | null
          social_facebook?: string | null
          social_twitter?: string | null
          social_tiktok?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          image_url?: string | null
          logo_url?: string | null
          photos?: string[]
          opening_hours?: OpeningHours | null
          services?: Service[] | null
          is_women_owned?: boolean
          is_home_based?: boolean
          is_startup?: boolean
          is_featured?: boolean
          status?: 'live' | 'paused' | 'draft' | 'pending'
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      service_inquiries: {
        Relationships: []
        Row: {
          id: string
          created_at: string
          status: 'new' | 'contacted' | 'closed'
          name: string
          email: string
          phone: string | null
          business_name: string | null
          business_stage: string[]
          services_interested: string[]
          brief: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          status?: 'new' | 'contacted' | 'closed'
          name: string
          email: string
          phone?: string | null
          business_name?: string | null
          business_stage?: string[]
          services_interested?: string[]
          brief?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          status?: 'new' | 'contacted' | 'closed'
          name?: string
          email?: string
          phone?: string | null
          business_name?: string | null
          business_stage?: string[]
          services_interested?: string[]
          brief?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}

export type Business = Database['public']['Tables']['businesses']['Row']
export type BusinessInsert = Database['public']['Tables']['businesses']['Insert']
export type BusinessUpdate = Database['public']['Tables']['businesses']['Update']
export type ServiceInquiry = Database['public']['Tables']['service_inquiries']['Row']
export type ServiceInquiryInsert = Database['public']['Tables']['service_inquiries']['Insert']
