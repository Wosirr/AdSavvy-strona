import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClients } from '../hooks/useClients'

const SERVICES = [
  { value: 'google_ads', label: 'Google Ads', color: '#4285f4', bg: 'rgba(66,133,244,0.15)' },
  { value: 'meta_ads', label: 'Meta Ads', color: '#E6006E', bg: 'rgba(230,0,110,0.12)' },
  { value: 'allegro_ads', label: 'Allegro Ads', color: '#ff6600', bg: 'rgba(255,102,0,0.12)' },
  { value: 'social_media', label: 'Social Media', color: '#0DE5E6', bg: 'rgba(13,229,230,0.12)' },
  { value: 'web_design', label: 'Web Design', color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
  { value: 'audit', label: 'Audyt', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Aktywny', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  { value: 'paused', label: 'Pauza', color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
  { value: 'inactive', label: 'Nieaktywny', color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.06)' },
] as const

export default function AddClientPage() {
  const navigate = useNavigate()
  const { addClient } = useClients()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    monthly_budget: '',
    services: [] as string[],
    notes: '',
    status: 'active' as 'active' | 'inactive' | 'paused',
  })

  const toggleService = (s: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(s)
        ? prev.services.filter((x) => x !== s)
        : [...prev.services, s],
    }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    const { error } = await addClient({
      ...form,
      monthly_budget: form.monthly_budget ? Number(form.monthly_budget) : undefined,
    })
    setSaving(false)
    if (!error) navigate('/clients')
  }

  return (
    <div className="px-4 pt-12 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-7 anim-fade-up">
        <button
          onClick={() => navigate(-1)}
          className="transition-opacity active:opacity-60 flex-shrink-0"
          style={{ color: 'var(--text-2)' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1
          className="text-2xl font-extrabold"
          style={{ color: 'var(--text-1)' }}
        >
          Nowy klient
        </h1>
      </div>

      <div className="flex flex-col gap-5">
        {/* Name */}
        <div className="anim-fade-up anim-d1">
          <label className="label">Imię i nazwisko *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Jan Kowalski"
            className="input"
          />
        </div>

        {/* Company */}
        <div className="anim-fade-up anim-d2">
          <label className="label">Firma</label>
          <input
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="Nazwa firmy"
            className="input"
          />
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-2 gap-3 anim-fade-up anim-d2">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="jan@firma.pl"
              className="input"
            />
          </div>
          <div>
            <label className="label">Telefon</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+48 000 000 000"
              className="input"
            />
          </div>
        </div>

        {/* Website + Budget */}
        <div className="grid grid-cols-2 gap-3 anim-fade-up anim-d3">
          <div>
            <label className="label">Strona www</label>
            <input
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://..."
              className="input"
            />
          </div>
          <div>
            <label className="label">Budżet / mies.</label>
            <div className="relative">
              <input
                type="number"
                value={form.monthly_budget}
                onChange={(e) => setForm({ ...form, monthly_budget: e.target.value })}
                placeholder="5000"
                className="input pr-10"
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-mono font-medium"
                style={{ color: 'var(--text-3)' }}
              >
                zł
              </span>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="anim-fade-up anim-d3">
          <label className="label">Usługi</label>
          <div className="grid grid-cols-2 gap-2">
            {SERVICES.map((s) => {
              const active = form.services.includes(s.value)
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => toggleService(s.value)}
                  className="py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95"
                  style={{
                    background: active ? s.bg : 'var(--surface-2)',
                    border: active ? `1px solid ${s.color}` : '1px solid transparent',
                    color: active ? s.color : 'var(--text-3)',
                  }}
                >
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Status */}
        <div className="anim-fade-up anim-d4">
          <label className="label">Status</label>
          <div className="grid grid-cols-3 gap-2">
            {STATUS_OPTIONS.map((s) => {
              const active = form.status === s.value
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setForm({ ...form, status: s.value })}
                  className="py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95"
                  style={{
                    background: active ? s.bg : 'var(--surface-2)',
                    border: active ? `1px solid ${s.color}` : '1px solid transparent',
                    color: active ? s.color : 'var(--text-3)',
                  }}
                >
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="anim-fade-up anim-d4">
          <label className="label">Notatki</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Dodatkowe informacje..."
            rows={3}
            className="input resize-none"
          />
        </div>

        {/* Submit */}
        <div className="anim-fade-up anim-d5 mt-2">
          <button
            onClick={handleSubmit}
            disabled={!form.name.trim() || saving}
            className="btn-primary"
          >
            {saving ? 'Zapisywanie...' : 'Dodaj klienta'}
          </button>
        </div>
      </div>
    </div>
  )
}
