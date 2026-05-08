import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEvents } from '../hooks/useEvents'
import { useClients } from '../hooks/useClients'

const TYPES = [
  { value: 'meeting',  label: 'Spotkanie',      color: '#0DE5E6' },
  { value: 'deadline', label: 'Deadline',        color: '#E6006E' },
  { value: 'campaign', label: 'Kampania',        color: '#4285f4' },
  { value: 'reminder', label: 'Przypomnienie',   color: '#f59e0b' },
  { value: 'other',    label: 'Inne',            color: '#a78bfa' },
]

const RECURRENCE = [
  { value: 'none',      label: 'Raz' },
  { value: 'daily',     label: 'Codziennie' },
  { value: 'weekly',    label: 'Co tydzień' },
  { value: 'biweekly',  label: 'Co 2 tyg.' },
  { value: 'monthly',   label: 'Co miesiąc' },
  { value: 'yearly',    label: 'Co rok' },
] as const

export default function AddEventPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const presetClientId = params.get('clientId') ?? ''
  const presetDate = params.get('date') ?? new Date().toISOString().split('T')[0]

  const { addEvent } = useEvents()
  const { clients } = useClients()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: presetDate,
    time: '',
    type: 'other',
    client_id: presetClientId,
    recurrence: 'none' as typeof RECURRENCE[number]['value'],
    recurrence_end: '',
  })

  const handleSubmit = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    await addEvent({
      title: form.title,
      description: form.description || null,
      date: form.date,
      time: form.time || null,
      type: form.type,
      client_id: form.client_id || null,
      recurrence: form.recurrence,
      recurrence_end: form.recurrence_end || null,
    })
    setSaving(false)
    navigate(-1)
  }

  const showRecurrenceEnd = form.recurrence !== 'none'

  return (
    <div className="px-4 pt-12 pb-10">
      <div className="flex items-center gap-3 mb-7 anim-fade-up">
        <button
          onClick={() => navigate(-1)}
          className="transition-opacity active:opacity-60 flex-shrink-0"
          style={{ color: 'var(--text-2)' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-1)' }}>
          Nowy termin
        </h1>
      </div>

      <div className="flex flex-col gap-5">
        {/* Title */}
        <div className="anim-fade-up anim-d1">
          <label className="label">Tytuł *</label>
          <input
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="np. Spotkanie z klientem"
            className="input"
          />
        </div>

        {/* Type */}
        <div className="anim-fade-up anim-d1">
          <label className="label">Typ</label>
          <div className="grid grid-cols-3 gap-2">
            {TYPES.map(t => {
              const active = form.type === t.value
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm({ ...form, type: t.value })}
                  className="py-2.5 rounded-2xl text-xs font-semibold transition-all active:scale-95"
                  style={{
                    background: active ? `${t.color}20` : 'var(--surface-2)',
                    border: active ? `1px solid ${t.color}` : '1px solid transparent',
                    color: active ? t.color : 'var(--text-3)',
                  }}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Date + Time */}
        <div className="grid grid-cols-2 gap-3 anim-fade-up anim-d2">
          <div>
            <label className="label">Data</label>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input" style={{ colorScheme: 'dark' }} />
          </div>
          <div>
            <label className="label">Godzina</label>
            <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="input" style={{ colorScheme: 'dark' }} />
          </div>
        </div>

        {/* Recurrence */}
        <div className="anim-fade-up anim-d2">
          <label className="label">Powtarzanie</label>
          <div className="grid grid-cols-3 gap-2">
            {RECURRENCE.map(r => {
              const active = form.recurrence === r.value
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm({ ...form, recurrence: r.value })}
                  className="py-2.5 rounded-2xl text-xs font-semibold transition-all active:scale-95"
                  style={{
                    background: active ? 'rgba(13,229,230,0.12)' : 'var(--surface-2)',
                    border: active ? '1px solid var(--teal)' : '1px solid transparent',
                    color: active ? 'var(--teal)' : 'var(--text-3)',
                  }}
                >
                  {r.label}
                </button>
              )
            })}
          </div>

          {showRecurrenceEnd && (
            <div className="mt-3">
              <label className="label">Koniec powtarzania (opcjonalnie)</label>
              <input
                type="date"
                value={form.recurrence_end}
                onChange={e => setForm({ ...form, recurrence_end: e.target.value })}
                className="input"
                style={{ colorScheme: 'dark' }}
              />
              <p className="text-[10px] mt-1.5 font-medium" style={{ color: 'var(--text-3)' }}>
                Puste = powtarza przez rok
              </p>
            </div>
          )}
        </div>

        {/* Client */}
        <div className="anim-fade-up anim-d3">
          <label className="label">Klient (opcjonalnie)</label>
          <select
            value={form.client_id}
            onChange={e => setForm({ ...form, client_id: e.target.value })}
            className="input"
            style={{ colorScheme: 'dark' }}
          >
            <option value="">Ogólny / bez klienta</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ''}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="anim-fade-up anim-d3">
          <label className="label">Notatka</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Opcjonalne szczegóły..."
            rows={3}
            className="input resize-none"
          />
        </div>

        <div className="anim-fade-up anim-d4 mt-2">
          <button onClick={handleSubmit} disabled={!form.title.trim() || saving} className="btn-primary">
            {saving ? 'Zapisywanie...' : 'Dodaj termin'}
          </button>
        </div>
      </div>
    </div>
  )
}
