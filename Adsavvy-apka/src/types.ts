export interface Client {
  id: string
  name: string
  company?: string
  email?: string
  phone?: string
  website?: string
  services: string[]
  notes?: string
  status: 'active' | 'inactive' | 'paused'
  monthly_budget?: number
  created_at: string
}

export interface Campaign {
  id: string
  client_id: string
  title: string
  description?: string
  type: 'google_ads' | 'meta_ads' | 'allegro_ads' | 'social_media' | 'web_design' | 'audit' | 'other'
  status: 'planned' | 'in_progress' | 'done'
  date: string
  roas?: number
  budget_spent?: number
  conversions?: number
  notes?: string
  created_at: string
}
