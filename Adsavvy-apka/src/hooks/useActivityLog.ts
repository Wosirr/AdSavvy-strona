import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface ActivityEntry {
  id: string
  project: string
  tool: string
  file_path: string | null
  created_at: string
}

export function useActivityLog() {
  const [entries, setEntries] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    if (data) setEntries(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchEntries()

    const channel = supabase
      .channel('activity_log')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, (payload) => {
        setEntries((prev) => [payload.new as ActivityEntry, ...prev].slice(0, 50))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return { entries, loading }
}
