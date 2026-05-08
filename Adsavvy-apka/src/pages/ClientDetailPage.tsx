import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useClient } from '../hooks/useClients'
import { useCampaigns } from '../hooks/useCampaigns'
import { useEvents } from '../hooks/useEvents'
import CalendarGrid from '../components/CalendarGrid'

const TYPE_LABELS: Record<string, string> = {
  google_ads: 'Google Ads', meta_ads: 'Meta Ads', allegro_ads: 'Allegro Ads',
  social_media: 'Social Media', web_design: 'Web Design', audit: 'Audyt', other: 'Inne',
}
const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  google_ads:   { bg: 'rgba(96,165,250,0.15)',  text: '#60a5fa' },
  meta_ads:     { bg: 'rgba(244,114,182,0.15)', text: '#f472b6' },
  allegro_ads:  { bg: 'rgba(251,191,36,0.15)',  text: '#fbbf24' },
  social_media: { bg: 'rgba(103,232,249,0.15)', text: '#67e8f9' },
  web_design:   { bg: 'rgba(167,139,250,0.15)', text: '#a78bfa' },
  audit:        { bg: 'rgba(129,140,248,0.15)', text: '#818cf8' },
  other:        { bg: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.4)' },
}
const STATUS_LABELS: Record<string, string> = {
  planned: 'Planowane', in_progress: 'W toku', done: 'Gotowe',
}
const STATUS_COLORS: Record<string, string> = {
  planned: '#fbbf24', in_progress: '#67e8f9', done: '#4ade80',
}
const CLIENT_STATUS_LABEL: Record<string, string> = {
  active: 'Aktywny', paused: 'Pauza', inactive: 'Nieaktywny',
}
const CLIENT_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active:   { bg: 'rgba(74,222,128,0.15)',  text: '#4ade80' },
  paused:   { bg: 'rgba(251,191,36,0.15)',  text: '#fbbf24' },
  inactive: { bg: 'rgba(255,255,255,0.07)', text: 'rgba(255,255,255,0.3)' },
}
const AVATAR_GRADIENTS = [
  ['#818cf8', '#6366f1'],
  ['#6366f1', '#93c5fd'],
  ['#93c5fd', '#67e8f9'],
  ['#a78bfa', '#818cf8'],
  ['#60a5fa', '#818cf8'],
]
const EVENT_COLORS: Record<string, string> = {
  meeting: '#67e8f9', deadline: '#f472b6', campaign: '#818cf8', reminder: '#fbbf24', other: '#a78bfa',
}
const EVENT_LABELS: Record<string, string> = {
  meeting: 'Spotkanie', deadline: 'Deadline', campaign: 'Kampania', reminder: 'Przypomnienie', other: 'Inne',
}

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <p className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>{title}</p>
      {action}
    </div>
  )
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { client, loading, updateClient } = useClient(id!)
  const { campaigns, loading: cLoading } = useCampaigns(id!)
  const { events, deleteEvent } = useEvents(id!)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [editingStatus, setEditingStatus] = useState(false)

  const dayEvents = selectedDate ? events.filter(e => e.date === selectedDate) : []

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }} />
    </div>
  )
  if (!client) return (
    <div className="flex items-center justify-center h-screen">
      <p style={{ color: 'var(--text-3)' }}>Nie znaleziono klienta</p>
    </div>
  )

  const grad = AVATAR_GRADIENTS[client.name.charCodeAt(0) % AVATAR_GRADIENTS.length]
  const statusStyle = CLIENT_STATUS_COLORS[client.status]

  return (
    <div className="pb-10">
      {/* Back + Hero */}
      <div className="px-4 pt-12 pb-6 anim-fade-up">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium mb-6 active:opacity-60"
          style={{ color: 'var(--text-2)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Klienci
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4"
            style={{ background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})` }}
          >
            {client.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-1)' }}>{client.name}</h1>
          {client.company && <p className="text-sm mb-2" style={{ color: 'var(--text-3)' }}>{client.company}</p>}
          <button
            onClick={() => setEditingStatus(v => !v)}
            className="text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-opacity active:opacity-70"
            style={{ background: statusStyle.bg, color: statusStyle.text }}
          >
            {CLIENT_STATUS_LABEL[client.status]}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          {editingStatus && (
            <div className="flex gap-2 mt-3">
              {(['active', 'paused', 'inactive'] as const).map(s => {
                const sc = CLIENT_STATUS_COLORS[s]
                const isCurrent = client.status === s
                return (
                  <button
                    key={s}
                    onClick={async () => {
                      await updateClient({ status: s })
                      setEditingStatus(false)
                    }}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
                    style={{
                      background: isCurrent ? sc.bg : 'var(--surface-2)',
                      color: isCurrent ? sc.text : 'var(--text-3)',
                      border: `1px solid ${isCurrent ? sc.text : 'transparent'}`,
                    }}
                  >
                    {CLIENT_STATUS_LABEL[s]}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Info cards */}
      <div className="px-4 mb-6 anim-fade-up anim-d1">
        <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {client.monthly_budget && (
            <div className="flex-shrink-0 rounded-2xl p-4" style={{ background: 'var(--surface)', minWidth: 150 }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>Budżet / mies.</p>
              <p className="font-mono text-xl font-bold" style={{ color: 'var(--teal)' }}>
                {client.monthly_budget.toLocaleString('pl')} <span className="text-sm font-normal" style={{ color: 'var(--text-3)' }}>zł</span>
              </p>
            </div>
          )}
          {client.email && (
            <a href={`mailto:${client.email}`} className="flex-shrink-0 rounded-2xl p-4 active:opacity-70" style={{ background: 'var(--surface)', minWidth: 150 }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>Email</p>
              <p className="text-sm font-medium truncate" style={{ color: 'var(--teal)' }}>{client.email}</p>
            </a>
          )}
          {client.phone && (
            <a href={`tel:${client.phone}`} className="flex-shrink-0 rounded-2xl p-4 active:opacity-70" style={{ background: 'var(--surface)', minWidth: 150 }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>Telefon</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>{client.phone}</p>
            </a>
          )}
          {client.website && (
            <a href={client.website} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 rounded-2xl p-4 active:opacity-70" style={{ background: 'var(--surface)', minWidth: 150 }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>Strona</p>
              <p className="text-sm font-medium truncate" style={{ color: 'var(--teal)' }}>{client.website.replace(/^https?:\/\//, '')}</p>
            </a>
          )}
        </div>
      </div>

      {/* Services */}
      {client.services.length > 0 && (
        <div className="px-4 mb-6 anim-fade-up anim-d2">
          <SectionHeader title="Usługi" />
          <div className="flex flex-wrap gap-2">
            {client.services.map(s => {
              const c = TYPE_COLORS[s] ?? TYPE_COLORS.other
              return (
                <span key={s} className="text-sm font-semibold px-4 py-2 rounded-full" style={{ background: c.bg, color: c.text }}>
                  {TYPE_LABELS[s] ?? s}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Notes */}
      {client.notes && (
        <div className="px-4 mb-6 anim-fade-up anim-d3">
          <SectionHeader title="Notatki" />
          <div className="rounded-2xl p-4" style={{ background: 'var(--surface)' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{client.notes}</p>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="px-4 mb-6 anim-fade-up anim-d4">
        <SectionHeader
          title="Kalendarz"
          action={
            <Link to={`/event/new?clientId=${id}${selectedDate ? `&date=${selectedDate}` : ''}`} className="text-sm font-semibold" style={{ color: 'var(--pink)' }}>
              + Dodaj
            </Link>
          }
        />
        <div className="rounded-2xl p-4" style={{ background: 'var(--surface)' }}>
          <CalendarGrid events={events} selectedDate={selectedDate} onDaySelect={d => setSelectedDate(prev => prev === d ? null : d)} />
        </div>
        {selectedDate && dayEvents.length > 0 && (
          <div className="rounded-2xl overflow-hidden mt-3" style={{ background: 'var(--surface)' }}>
            {dayEvents.map((e, idx) => {
              const color = EVENT_COLORS[e.type] ?? '#a78bfa'
              return (
                <div key={e.id} className="px-4 py-4 flex items-center gap-3" style={{ borderBottom: idx < dayEvents.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div className="w-1.5 h-10 rounded-full flex-shrink-0" style={{ background: color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>{e.title}</p>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-3)' }}>
                      {EVENT_LABELS[e.type]}{e.time ? ` · ${e.time.slice(0, 5)}` : ''}
                    </p>
                  </div>
                  <button onClick={() => deleteEvent(e.id)} className="w-8 h-8 flex items-center justify-center rounded-lg active:opacity-50" style={{ color: 'var(--text-3)' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Campaigns */}
      <div className="px-4 anim-fade-up anim-d4">
        <SectionHeader
          title="Kampanie"
          action={
            <Link to={`/clients/${id}/campaign/new`} className="text-sm font-semibold" style={{ color: 'var(--pink)' }}>+ Dodaj</Link>
          }
        />
        {cLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }} />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--surface)' }}>
            <p className="text-sm mb-3" style={{ color: 'var(--text-3)' }}>Brak kampanii</p>
            <Link to={`/clients/${id}/campaign/new`} className="text-sm font-semibold" style={{ color: 'var(--pink)' }}>Dodaj pierwszą →</Link>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)' }}>
            {campaigns.map((camp, i) => {
              const typeStyle = TYPE_COLORS[camp.type] ?? TYPE_COLORS.other
              return (
                <div key={camp.id} className="px-4 py-4" style={{ borderBottom: i < campaigns.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-base truncate" style={{ color: 'var(--text-1)' }}>{camp.title}</p>
                      <p className="text-sm mt-0.5" style={{ color: 'var(--text-3)' }}>
                        {new Date(camp.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: typeStyle.bg, color: typeStyle.text }}>
                        {TYPE_LABELS[camp.type]}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: STATUS_COLORS[camp.status] }}>
                        {STATUS_LABELS[camp.status]}
                      </span>
                    </div>
                  </div>
                  {camp.description && (
                    <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-2)' }}>{camp.description}</p>
                  )}
                  {(camp.roas || camp.budget_spent || camp.conversions) && (
                    <div className="flex gap-6 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                      {camp.roas && <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-3)' }}>ROAS</p>
                        <p className="font-mono font-bold text-base" style={{ color: '#4ade80' }}>{camp.roas}%</p>
                      </div>}
                      {camp.budget_spent && <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-3)' }}>Budżet</p>
                        <p className="font-mono font-bold text-base" style={{ color: 'var(--text-1)' }}>{camp.budget_spent.toLocaleString('pl')} zł</p>
                      </div>}
                      {camp.conversions && <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-3)' }}>Konwersje</p>
                        <p className="font-mono font-bold text-base" style={{ color: 'var(--teal)' }}>{camp.conversions}</p>
                      </div>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
