import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEvents } from '../hooks/useEvents'
import { useClients } from '../hooks/useClients'
import CalendarGrid from '../components/CalendarGrid'

const TYPE_LABELS: Record<string, string> = {
  meeting:  'Spotkanie',
  deadline: 'Deadline',
  campaign: 'Kampania',
  reminder: 'Przypomnienie',
  other:    'Inne',
}
const TYPE_COLORS: Record<string, string> = {
  meeting:  '#0DE5E6',
  deadline: '#E6006E',
  campaign: '#4285f4',
  reminder: '#f59e0b',
  other:    '#a78bfa',
}

const CLIENT_PALETTE = ['#E6006E','#0DE5E6','#a78bfa','#f59e0b','#4285f4','#22c55e','#f472b6']

export default function CalendarPage() {
  const { events, loading, deleteEvent } = useEvents()
  const { clients } = useClients()
  const [selected, setSelected] = useState<string | null>(new Date().toISOString().split('T')[0])

  const clientColors: Record<string, string> = {}
  clients.forEach((c, i) => { clientColors[c.id] = CLIENT_PALETTE[i % CLIENT_PALETTE.length] })

  const clientMap: Record<string, string> = {}
  clients.forEach(c => { clientMap[c.id] = c.name })

  const dayEvents = selected ? events.filter(e => e.date === selected) : []
  const upcomingEvents = events
    .filter(e => e.date >= new Date().toISOString().split('T')[0])
    .slice(0, 5)

  const formatDate = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })

  return (
    <div className="px-4 pt-14 pb-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 anim-fade-up">
        <div>
          <img src="/logo.png" alt="AdSavvy" className="h-6 mb-1.5 object-contain object-left" />
          <h1 className="text-3xl font-bold leading-none" style={{ color: 'var(--text-1)' }}>
            Kalendarz
          </h1>
        </div>
        <Link
          to={`/event/new${selected ? `?date=${selected}` : ''}`}
          className="w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5 transition-transform active:scale-90"
          style={{ background: 'linear-gradient(135deg, var(--pink), #c0005a)', boxShadow: '0 6px 20px var(--pink-glow)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </Link>
      </div>

      {/* Calendar */}
      <div className="rounded-2xl p-4 mb-5 anim-fade-up anim-d1" style={{ background: 'var(--surface)' }}>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-7 h-7 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <CalendarGrid
            events={events}
            clientColors={clientColors}
            selectedDate={selected}
            onDaySelect={d => setSelected(prev => prev === d ? null : d)}
          />
        )}
      </div>

      {/* Selected day events */}
      {selected && (
        <div className="mb-5 anim-fade-up">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold" style={{ color: 'var(--text-2)' }}>
              {formatDate(selected)}
            </p>
            <Link
              to={`/event/new?date=${selected}`}
              className="text-xs font-semibold" style={{ color: 'var(--pink)' }}
            >
              + Dodaj
            </Link>
          </div>

          {dayEvents.length === 0 ? (
            <div className="rounded-2xl p-5 text-center" style={{ background: 'var(--surface)' }}>
              <p className="text-sm" style={{ color: 'var(--text-3)' }}>Brak terminów</p>
            </div>
          ) : (
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: 'var(--surface)' }}
            >
              {dayEvents.map((e, idx) => (
                <div
                  key={e.id}
                  style={{ borderBottom: idx < dayEvents.length - 1 ? '1px solid var(--border)' : 'none' }}
                >
                  <EventCard
                    event={e}
                    clientName={e.client_id ? clientMap[e.client_id] : undefined}
                    clientColor={e.client_id ? clientColors[e.client_id] : undefined}
                    onDelete={() => deleteEvent(e.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upcoming */}
      {!selected && upcomingEvents.length > 0 && (
        <div className="anim-fade-up anim-d2">
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-2)' }}>
            Najbliższe terminy
          </p>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--surface)' }}
          >
            {upcomingEvents.map((e, idx) => (
              <div
                key={e.id}
                style={{ borderBottom: idx < upcomingEvents.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <EventCard
                  event={e}
                  showDate
                  clientName={e.client_id ? clientMap[e.client_id] : undefined}
                  clientColor={e.client_id ? clientColors[e.client_id] : undefined}
                  onDelete={() => deleteEvent(e.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EventCard({ event, clientName, clientColor, onDelete, showDate }: {
  event: ReturnType<typeof useEvents>['events'][0]
  clientName?: string
  clientColor?: string
  onDelete: () => void
  showDate?: boolean
}) {
  const color = clientColor ?? TYPE_COLORS[event.type] ?? '#a78bfa'
  const formatTime = (t: string | null | undefined) => t ? t.slice(0, 5) : ''

  return (
    <div className="px-4 py-3.5 flex items-start gap-3">
      <div className="w-1 self-stretch rounded-full flex-shrink-0 mt-0.5" style={{ background: color, minHeight: 20 }} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-snug" style={{ color: 'var(--text-1)' }}>
          {event.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {showDate && (
            <span className="text-xs" style={{ color: 'var(--text-3)' }}>
              {new Date(event.date + 'T12:00:00').toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}
            </span>
          )}
          {event.time && (
            <span className="font-mono text-xs" style={{ color }}>{formatTime(event.time)}</span>
          )}
          {clientName && (
            <span className="text-xs font-semibold" style={{ color }}>{clientName}</span>
          )}
          <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>
            {TYPE_LABELS[event.type] ?? event.type}
          </span>
          {event.recurrence && event.recurrence !== 'none' && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ color: 'var(--text-3)', flexShrink: 0 }}>
              <path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
          )}
        </div>
        {event.description && (
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-3)' }}>{event.description}</p>
        )}
      </div>
      <button
        onClick={onDelete}
        className="w-7 h-7 flex items-center justify-center rounded-lg active:opacity-50 flex-shrink-0 transition-opacity"
        style={{ color: 'var(--text-3)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  )
}
