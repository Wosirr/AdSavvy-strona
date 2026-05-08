import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useClients } from '../hooks/useClients'
import { useEvents } from '../hooks/useEvents'

const STATUS_DOT: Record<string, string> = {
  active: '#4ade80',
  paused: '#fbbf24',
  inactive: 'rgba(255,255,255,0.2)',
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
const SERVICE_LABELS: Record<string, string> = {
  google_ads: 'Google', meta_ads: 'Meta', allegro_ads: 'Allegro',
  social_media: 'Social', web_design: 'Web', audit: 'Audyt',
}
const SERVICE_COLORS: Record<string, { bg: string; text: string }> = {
  google_ads:   { bg: 'rgba(96,165,250,0.15)',  text: '#60a5fa' },
  meta_ads:     { bg: 'rgba(244,114,182,0.15)', text: '#f472b6' },
  allegro_ads:  { bg: 'rgba(251,191,36,0.15)',  text: '#fbbf24' },
  social_media: { bg: 'rgba(103,232,249,0.15)', text: '#67e8f9' },
  web_design:   { bg: 'rgba(167,139,250,0.15)', text: '#a78bfa' },
  audit:        { bg: 'rgba(129,140,248,0.15)', text: '#818cf8' },
}

export default function ClientsPage() {
  const { clients, loading } = useClients()
  const [search, setSearch] = useState('')

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase())
  )

  const active = clients.filter((c) => c.status === 'active').length
  const paused = clients.filter((c) => c.status === 'paused').length

  const { events } = useEvents()
  const todayStr = new Date().toISOString().split('T')[0]
  const upcoming = events.filter(e => e.date >= todayStr).slice(0, 4)
  const overdueCount = events.filter(e => e.date < todayStr).length

  return (
    <div className="px-4 pt-14 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 anim-fade-up">
        <div>
          <img src="/logo.png" alt="AdSavvy" className="h-5 mb-2 object-contain object-left" />
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-1)' }}>Klienci</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
            {clients.length > 0 ? `${active} aktywnych · ${paused} na pauzie` : 'Brak klientów'}
          </p>
        </div>
        <Link
          to="/clients/new"
          className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-transform active:scale-90"
          style={{ background: 'var(--pink)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-5 anim-fade-up anim-d1">
        <input
          type="text"
          placeholder="Szukaj klienta..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 anim-scale-in">
          <p className="font-semibold text-base mb-1" style={{ color: 'var(--text-2)' }}>
            {search ? 'Brak wyników' : 'Brak klientów'}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>
            {search ? 'Spróbuj innej frazy' : 'Dodaj pierwszego klienta'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden anim-fade-up anim-d2" style={{ background: 'var(--surface)' }}>
          {filtered.map((client, i) => {
            const grad = AVATAR_GRADIENTS[client.name.charCodeAt(0) % AVATAR_GRADIENTS.length]
            const clientEvents = events
              .filter(e => e.client_id === client.id && e.date >= todayStr)
              .slice(0, 1)
            const nextEvent = clientEvents[0]
            const isToday = nextEvent?.date === todayStr
            const eventColor = nextEvent ? (EVENT_COLORS[nextEvent.type] ?? '#a78bfa') : ''
            const eventDate = nextEvent
              ? isToday ? 'Dziś' : new Date(nextEvent.date + 'T12:00:00').toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })
              : ''

            return (
              <Link
                key={client.id}
                to={`/clients/${client.id}`}
                className="flex items-start gap-4 px-4 py-4 transition-colors active:bg-[var(--surface-2)]"
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 mt-0.5"
                  style={{ background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})` }}
                >
                  {client.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {/* Name + status */}
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-base truncate" style={{ color: 'var(--text-1)' }}>
                      {client.name}
                    </p>
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: STATUS_DOT[client.status] }} />
                  </div>

                  {/* Company */}
                  {client.company && (
                    <p className="text-sm truncate mb-2" style={{ color: 'var(--text-3)' }}>
                      {client.company}
                    </p>
                  )}

                  {/* Services */}
                  {client.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {client.services.map(s => {
                        const sc = SERVICE_COLORS[s]
                        if (!sc) return null
                        return (
                          <span key={s} className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>
                            {SERVICE_LABELS[s] ?? s}
                          </span>
                        )
                      })}
                    </div>
                  )}

                  {/* Next event */}
                  {nextEvent && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-3.5 rounded-full flex-shrink-0" style={{ background: eventColor }} />
                      <p className="text-xs truncate" style={{ color: isToday ? eventColor : 'var(--text-3)', fontWeight: isToday ? 600 : 400 }}>
                        {eventDate}{nextEvent.time ? ` ${nextEvent.time.slice(0, 5)}` : ''} · {nextEvent.title}
                      </p>
                    </div>
                  )}
                </div>

                {/* Budget */}
                {client.monthly_budget ? (
                  <div className="text-right flex-shrink-0 mt-0.5">
                    <p className="font-mono font-bold text-base" style={{ color: 'var(--text-1)' }}>
                      {client.monthly_budget >= 1000 ? `${(client.monthly_budget / 1000).toFixed(0)}k` : client.monthly_budget}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>zł/mies</p>
                  </div>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mt-1" style={{ color: 'var(--text-3)' }}>
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                )}
              </Link>
            )
          })}
        </div>
      )}

      {/* Upcoming events */}
      {(upcoming.length > 0 || overdueCount > 0) && (
        <div className="mt-7 anim-fade-up anim-d5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>Nadchodzące</p>
              {overdueCount > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}>
                  {overdueCount} zaległe
                </span>
              )}
            </div>
            <Link to="/calendar" className="text-sm font-semibold" style={{ color: 'var(--teal)' }}>
              Kalendarz →
            </Link>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)' }}>
            {upcoming.map((e, i) => {
              const color = EVENT_COLORS[e.type] ?? '#a78bfa'
              const isToday = e.date === todayStr
              const dateLabel = isToday ? 'Dziś' : new Date(e.date + 'T12:00:00').toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })
              return (
                <div
                  key={e.id}
                  className="px-4 py-4 flex items-center gap-3"
                  style={{ borderBottom: i < upcoming.length - 1 ? '1px solid var(--border)' : 'none' }}
                >
                  <div className="w-1.5 h-10 rounded-full flex-shrink-0" style={{ background: color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold truncate" style={{ color: 'var(--text-1)' }}>{e.title}</p>
                    <p className="text-sm mt-0.5" style={{ color: isToday ? color : 'var(--text-3)', fontWeight: isToday ? 600 : 400 }}>
                      {dateLabel}{e.time ? ` · ${e.time.slice(0, 5)}` : ''}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
