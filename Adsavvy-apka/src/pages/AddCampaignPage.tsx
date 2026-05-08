import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCampaigns } from '../hooks/useCampaigns'

type CampaignType = 'google_ads' | 'meta_ads' | 'allegro_ads' | 'social_media' | 'web_design' | 'audit' | 'other'
type CampaignStatus = 'planned' | 'in_progress' | 'done'

const TYPES: { value: CampaignType; label: string; color: string; bg: string }[] = [
  { value: 'google_ads', label: 'Google Ads', color: '#4285f4', bg: 'rgba(66,133,244,0.15)' },
  { value: 'meta_ads', label: 'Meta Ads', color: '#E6006E', bg: 'rgba(230,0,110,0.12)' },
  { value: 'allegro_ads', label: 'Allegro Ads', color: '#ff6600', bg: 'rgba(255,102,0,0.12)' },
  { value: 'social_media', label: 'Social Media', color: '#0DE5E6', bg: 'rgba(13,229,230,0.12)' },
  { value: 'web_design', label: 'Web Design', color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
  { value: 'audit', label: 'Audyt', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { value: 'other', label: 'Inne', color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.06)' },
]

const STATUSES: { value: CampaignStatus; label: string; color: string; bg: string }[] = [
  { value: 'done', label: 'Gotowe', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  { value: 'in_progress', label: 'W toku', color: '#0DE5E6', bg: 'rgba(13,229,230,0.12)' },
  { value: 'planned', label: 'Planowane', color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
]

export default function AddCampaignPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addCampaign } = useCampaigns(id!)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'google_ads' as CampaignType,
    status: 'done' as CampaignStatus,
    date: new Date().toISOString().split('T')[0],
    roas: '',
    budget_spent: '',
    conversions: '',
    notes: '',
  })

  const handleSubmit = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    const { error } = await addCampaign({
      client_id: id!,
      ...form,
      roas: form.roas ? Number(form.roas) : undefined,
      budget_spent: form.budget_spent ? Number(form.budget_spent) : undefined,
      conversions: form.conversions ? Number(form.conversions) : undefined,
    })
    setSaving(false)
    if (!error) navigate(-1)
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
          Nowa kampania
        </h1>
      </div>

      <div className="flex flex-col gap-5">
        {/* Title */}
        <div className="anim-fade-up anim-d1">
          <label className="label">Tytuł *</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="np. Kampania Google Q1 2025"
            className="input"
          />
        </div>

        {/* Type */}
        <div className="anim-fade-up anim-d2">
          <label className="label">Typ kampanii</label>
          <div className="grid grid-cols-3 gap-2">
            {TYPES.map((t) => {
              const active = form.type === t.value
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm({ ...form, type: t.value })}
                  className="py-2.5 rounded-2xl text-xs font-semibold transition-all active:scale-95"
                  style={{
                    background: active ? t.bg : 'var(--surface-2)',
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

        {/* Status + Date */}
        <div className="anim-fade-up anim-d2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Status</label>
              <div className="flex flex-col gap-2">
                {STATUSES.map((s) => {
                  const active = form.status === s.value
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setForm({ ...form, status: s.value })}
                      className="w-full py-2.5 rounded-2xl text-xs font-semibold transition-all active:scale-95"
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
            <div>
              <label className="label">Data</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="anim-fade-up anim-d3">
          <label className="label">Wyniki (opcjonalnie)</label>
          <div className="grid grid-cols-3 gap-2">
            <div className="relative">
              <input
                type="number"
                value={form.roas}
                onChange={(e) => setForm({ ...form, roas: e.target.value })}
                placeholder="ROAS"
                className="input pr-7 text-center"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono" style={{ color: 'var(--text-3)' }}>%</span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={form.budget_spent}
                onChange={(e) => setForm({ ...form, budget_spent: e.target.value })}
                placeholder="Budżet"
                className="input pr-7 text-center"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono" style={{ color: 'var(--text-3)' }}>zł</span>
            </div>
            <div>
              <input
                type="number"
                value={form.conversions}
                onChange={(e) => setForm({ ...form, conversions: e.target.value })}
                placeholder="Konw."
                className="input text-center"
              />
            </div>
          </div>
          <p className="text-[10px] mt-2 font-medium" style={{ color: 'var(--text-3)' }}>
            ROAS % · Budżet zł · Konwersje
          </p>
        </div>

        {/* Description */}
        <div className="anim-fade-up anim-d4">
          <label className="label">Co zostało zrobione</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Opisz działania podjęte w ramach tej kampanii..."
            rows={4}
            className="input resize-none"
          />
        </div>

        {/* Submit */}
        <div className="anim-fade-up anim-d5 mt-2">
          <button
            onClick={handleSubmit}
            disabled={!form.title.trim() || saving}
            className="btn-primary"
          >
            {saving ? 'Zapisywanie...' : 'Zapisz kampanię'}
          </button>
        </div>
      </div>
    </div>
  )
}
