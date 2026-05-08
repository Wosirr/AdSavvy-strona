import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Client } from '../types'

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name')

    if (!error && data) setClients(data)
    setLoading(false)
  }

  async function addClient(client: Omit<Client, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single()

    if (!error && data) {
      setClients((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
    }
    return { data, error }
  }

  async function updateClient(id: string, updates: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setClients((prev) => prev.map((c) => (c.id === id ? data : c)))
    }
    return { data, error }
  }

  async function deleteClient(id: string) {
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (!error) setClients((prev) => prev.filter((c) => c.id !== id))
    return { error }
  }

  return { clients, loading, addClient, updateClient, deleteClient, refetch: fetchClients }
}

export function useClient(id: string) {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('clients').select('*').eq('id', id).single()
      .then(({ data, error }) => {
        if (!error && data) setClient(data)
        setLoading(false)
      })
  }, [id])

  async function updateClient(updates: Partial<Client>) {
    setClient(prev => prev ? { ...prev, ...updates } : prev) // optimistic
    const { data, error } = await supabase.from('clients').update(updates).eq('id', id).select().single()
    if (!error && data) setClient(data)
    return { error }
  }

  return { client, loading, updateClient }
}
