import { useState } from 'react'
import type { CalendarEvent } from '../hooks/useEvents'

const DAYS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd']
const MONTHS = ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień']

const TYPE_COLORS: Record<string, string> = {
  meeting:  '#0DE5E6',
  deadline: '#E6006E',
  campaign: '#4285f4',
  reminder: '#f59e0b',
  other:    '#a78bfa',
}

interface Props {
  events: CalendarEvent[]
  clientColors?: Record<string, string>
  onDaySelect?: (date: string) => void
  selectedDate?: string | null
}

export default function CalendarGrid({ events, clientColors = {}, onDaySelect, selectedDate }: Props) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const firstDay = new Date(year, month, 1)
  // Monday-based: 0=Mon … 6=Sun
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7

  const todayStr = today.toISOString().split('T')[0]

  const eventsByDate: Record<string, CalendarEvent[]> = {}
  for (const e of events) {
    if (!eventsByDate[e.date]) eventsByDate[e.date] = []
    eventsByDate[e.date].push(e)
  }

  const cells: (number | null)[] = []
  for (let i = 0; i < totalCells; i++) {
    const day = i - startOffset + 1
    cells.push(day >= 1 && day <= daysInMonth ? day : null)
  }

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  return (
    <div>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="w-9 h-9 rounded-xl flex items-center justify-center active:opacity-60" style={{ color: 'var(--text-2)', background: 'var(--surface-2)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <p className="font-semibold text-base" style={{ color: 'var(--text-1)' }}>
          {MONTHS[month]} {year}
        </p>
        <button onClick={next} className="w-9 h-9 rounded-xl flex items-center justify-center active:opacity-60" style={{ color: 'var(--text-2)', background: 'var(--surface-2)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold py-1" style={{ color: 'var(--text-3)', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayEvents = eventsByDate[dateStr] ?? []
          const isToday = dateStr === todayStr
          const isSelected = dateStr === selectedDate
          const isPast = dateStr < todayStr

          return (
            <button
              key={i}
              onClick={() => onDaySelect?.(dateStr)}
              className="aspect-square flex flex-col items-center justify-start pt-1.5 rounded-xl relative transition-all active:scale-95"
              style={{
                background: isSelected ? 'var(--pink)' : isToday ? 'rgba(13,229,230,0.1)' : 'transparent',
                border: isToday && !isSelected ? '1px solid rgba(13,229,230,0.3)' : '1px solid transparent',
              }}
            >
              <span
                className="text-xs font-semibold leading-none"
                style={{
                  color: isSelected ? '#fff' : isToday ? 'var(--teal)' : isPast ? 'var(--text-3)' : 'var(--text-1)',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {day}
              </span>
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5 mt-1 flex-wrap justify-center px-1">
                  {dayEvents.slice(0, 3).map((e, ei) => (
                    <span
                      key={ei}
                      className="w-1 h-1 rounded-full flex-shrink-0"
                      style={{
                        background: isSelected ? 'rgba(255,255,255,0.7)'
                          : clientColors[e.client_id ?? ''] ?? TYPE_COLORS[e.type] ?? '#a78bfa'
                      }}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
