import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface CalendarEvent {
  id: string
  client_id: string | null
  title: string
  description?: string | null
  date: string
  time?: string | null
  type: string
  recurrence: 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly'
  recurrence_end?: string | null
  created_at: string
}

// Expand recurring events into instances up to 1 year ahead
function expandRecurring(events: CalendarEvent[]): CalendarEvent[] {
  const result: CalendarEvent[] = []
  const limit = new Date()
  limit.setFullYear(limit.getFullYear() + 1)

  for (const event of events) {
    result.push(event)
    if (!event.recurrence || event.recurrence === 'none') continue

    const base = new Date(event.date + 'T12:00:00')
    const end = event.recurrence_end
      ? new Date(event.recurrence_end + 'T12:00:00')
      : limit

    const current = new Date(base)
    let iterations = 0

    while (iterations < 730) {
      iterations++
      switch (event.recurrence) {
        case 'daily':    current.setDate(current.getDate() + 1); break
        case 'weekly':   current.setDate(current.getDate() + 7); break
        case 'biweekly': current.setDate(current.getDate() + 14); break
        case 'monthly':  current.setMonth(current.getMonth() + 1); break
        case 'yearly':   current.setFullYear(current.getFullYear() + 1); break
      }
      if (current > end || current > limit) break

      const dateStr = current.toISOString().split('T')[0]
      result.push({ ...event, date: dateStr, id: `${event.id}__${dateStr}` })
    }
  }

  return result
}

export function useEvents(clientId?: string) {
  const [rawEvents, setRawEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    let q = supabase.from('events').select('*').order('date').order('time', { nullsFirst: true })
    if (clientId) q = q.eq('client_id', clientId)
    const { data } = await q
    if (data) setRawEvents(data)
    setLoading(false)
  }

  useEffect(() => {
    fetch()
    const channel = supabase
      .channel(`events-${clientId ?? 'all'}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetch)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [clientId])

  const addEvent = async (data: Omit<CalendarEvent, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('events').insert(data)
    return { error }
  }

  // Handles both regular and recurring instances (id__date format)
  const deleteEvent = async (id: string) => {
    const baseId = id.includes('__') ? id.split('__')[0] : id
    // Optimistic update
    setRawEvents(prev => prev.filter(e => e.id !== baseId))
    const { error } = await supabase.from('events').delete().eq('id', baseId)
    if (error) {
      console.error('Delete error:', error)
      fetch() // revert on error
    }
    return { error }
  }

  const events = expandRecurring(rawEvents)

  return { events, rawEvents, loading, addEvent, deleteEvent }
}
