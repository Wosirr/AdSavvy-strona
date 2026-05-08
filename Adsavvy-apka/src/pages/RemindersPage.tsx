import { Link } from 'react-router-dom'
import { useEvents } from '../hooks/useEvents'
import { useClients } from '../hooks/useClients'

const TYPE_COLORS: Record<string, string> = {
  meeting:  '#0DE5E6',
  deadline: '#E6006E',
  campaign: '#4285f4',
  reminder: '#f59e0b',
  other:    '#a78bfa',
}
const TYPE_LABELS: Record<string, string> = {
  meeting: 'Spotkanie', deadline: 'Deadline', campaign: 'Kampania', reminder: 'Przypomnienie', other: 'Inne',
}
const RECURRENCE_LABELS: Record<string, string> = {
  daily: 'codziennie', weekly: 'co tydzień', biweekly: 'co 2 tyg.', monthly: 'co miesiąc', yearly: 'co rok',
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function groupEvents(events: ReturnType<typeof useEvents>['events']) {
  const now = startOfDay(new Date())
  const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1)
  const nextWeekEnd = new Date(now); nextWeekEnd.setDate(now.getDate() + 7)
  const laterEnd = new Date(now); laterEnd.setDate(now.getDate() + 30)

  const overdue: typeof events = []
  const today: typeof events = []
  const tomorrowArr: typeof events = []
  const thisWeek: typeof events = []
  const later: typeof events = []

  for (const e of events) {
    const d = startOfDay(new Date(e.date + 'T12:00:00'))
    if (d < now) overdue.push(e)
    else if (d.getTime() === now.getTime()) today.push(e)
    else if (d.getTime() === tomorrow.getTime()) tomorrowArr.push(e)
    else if (d < nextWeekEnd) thisWeek.push(e)
    else if (d <= laterEnd) later.push(e)
  }

  return { overdue, today, tomorrow: tomorrowArr, thisWeek, later }
}

export default function RemindersPage() {
  const { events, loading, deleteEvent } = useEvents()
  const { clients } = useClients()

  const clientMap: Record<string, string> = {}
  clients.forEach(c => { clientMap[c.id] = c.name })

  const CLIENT_PALETTE = ['#E6006E','#0DE5E6','#a78bfa','#f59e0b','#4285f4','#22c55e','#f472b6']
  const clientColors: Record<string, string> = {}
  clients.forEach((c, i) => { clientColors[c.id] = CLIENT_PALETTE[i % CLIENT_PALETTE.length] })

  const upcoming = events.filter(e => {
    const d = startOfDay(new Date(e.date + 'T12:00:00'))
    const limit = new Date(); limit.setDate(limit.getDate() + 30)
    return d <= limit
  })

  const grouped = groupEvents(upcoming)

  const sections = [
    { key: 'overdue',   label: 'Zaległe',       events: grouped.overdue,   accent: '#ef4444' },
    { key: 'today',     label: 'Dziś',           events: grouped.today,     accent: '#E6006E' },
    { key: 'tomorrow',  label: 'Jutro',          events: grouped.tomorrow,  accent: '#f59e0b' },
    { key: 'thisWeek',  label: 'Ten tydzień',    events: grouped.thisWeek,  accent: '#0DE5E6' },
    { key: 'later',     label: 'Najbliższe 30 dni', events: grouped.later,  accent: 'var(--text-3)' },
  ].filter(s => s.events.length > 0)

  const urgentCount = grouped.overdue.length + grouped.today.length

  return (
    <div className="px-4 pt-14 pb-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 anim-fade-up">
        <div>
          <img src="/logo.png" alt="AdSavvy" className="h-6 mb-1.5 object-contain object-left" />
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold leading-none" style={{ color: 'var(--text-1)' }}>
              Przypomnienia
            </h1>
            {urgentCount > 0 && (
              <span
                className="font-mono text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(230,0,110,0.2)', color: '#E6006E' }}
              >
                {urgentCount}
              </span>
            )}
          </div>
        </div>
        <Link
          to="/event/new"
          className="w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5 active:scale-90 transition-transform"
          style={{ background: 'linear-gradient(135deg, var(--pink), #c0005a)', boxShadow: '0 6px 20px var(--pink-glow)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }} />
        </div>
      ) : sections.length === 0 ? (
        <div className="text-center py-16 anim-scale-in">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--surface)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: 'var(--text-3)' }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <p className="font-semibold mb-1" style={{ color: 'var(--text-2)' }}>Brak nadchodzących terminów</p>
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>Dodaj terminy w kalendarzu</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {sections.map((section, si) => (
            <div key={section.key} className="anim-fade-up" style={{ animationDelay: `${si * 0.06}s` }}>
              {/* Section header */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: section.accent }}
                />
                <p
                  className="text-xs font-semibold"
                  style={{ color: section.accent }}
                >
                  {section.label}
                </p>
                <span className="font-mono text-xs" style={{ color: 'var(--text-3)' }}>
                  {section.events.length}
                </span>
              </div>

              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: 'var(--surface)' }}
              >
                {section.events.map((e, i) => {
                  const typeColor = clientColors[e.client_id ?? ''] ?? TYPE_COLORS[e.type] ?? '#a78bfa'
                  const isOverdue = section.key === 'overdue'
                  const dateLabel = new Date(e.date + 'T12:00:00').toLocaleDateString('pl-PL', {
                    weekday: 'short', day: 'numeric', month: 'short',
                  })

                  return (
                    <div
                      key={e.id}
                      className="px-4 py-3.5 flex items-start gap-3 anim-fade-up"
                      style={{
                        animationDelay: `${si * 0.06 + i * 0.03}s`,
                        borderBottom: i < section.events.length - 1 ? '1px solid var(--border)' : 'none',
                        borderLeft: isOverdue ? '2px solid rgba(239,68,68,0.4)' : 'none',
                      }}
                    >
                      <div
                        className="w-1 self-stretch rounded-full flex-shrink-0"
                        style={{ background: isOverdue ? '#ef4444' : typeColor, minHeight: 20 }}
                      />

                      <div className="flex-1 min-w-0">
                        <p
                          className="font-semibold text-sm leading-snug"
                          style={{ color: isOverdue ? '#ef4444' : 'var(--text-1)' }}
                        >
                          {e.title}
                        </p>

                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs" style={{ color: 'var(--text-3)' }}>{dateLabel}</span>
                          {e.time && (
                            <span className="font-mono text-xs font-medium" style={{ color: isOverdue ? '#ef4444' : typeColor }}>
                              {e.time.slice(0, 5)}
                            </span>
                          )}
                          {e.client_id && clientMap[e.client_id] && (
                            <span className="text-xs font-semibold" style={{ color: typeColor }}>
                              {clientMap[e.client_id]}
                            </span>
                          )}
                          <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>
                            {TYPE_LABELS[e.type]}
                          </span>
                          {e.recurrence && e.recurrence !== 'none' && (
                            <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-3)' }}>
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                              </svg>
                              {RECURRENCE_LABELS[e.recurrence]}
                            </span>
                          )}
                        </div>

                        {e.description && (
                          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-3)' }}>{e.description}</p>
                        )}
                      </div>

                      <button
                        onClick={() => deleteEvent(e.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg active:opacity-50 flex-shrink-0"
                        style={{ color: 'var(--text-3)' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M18 6 6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
