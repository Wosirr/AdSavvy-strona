import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Campaign } from '../types'

export function useCampaigns(clientId: string) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('campaigns')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setCampaigns(data)
        setLoading(false)
      })
  }, [clientId])

  async function addCampaign(campaign: Omit<Campaign, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('campaigns')
      .insert(campaign)
      .select()
      .single()

    if (!error && data) setCampaigns((prev) => [data, ...prev])
    return { data, error }
  }

  return { campaigns, loading, addCampaign }
}
