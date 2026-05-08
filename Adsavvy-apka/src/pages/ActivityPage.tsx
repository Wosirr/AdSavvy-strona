import { useActivityLog } from '../hooks/useActivityLog'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (d > 0) return `${d}d temu`
  if (h > 0) return `${h}h temu`
  if (m > 0) return `${m}min temu`
  return 'teraz'
}

function fileShort(path: string | null): string {
  if (!path) return ''
  return path.replace(/\\/g, '/').split('/').pop() ?? path
}

const PROJECT_COLORS: Record<string, string> = {}
const PALETTE = ['#E6006E', '#0DE5E6', '#a78bfa', '#f59e0b', '#4285f4', '#22c55e']
let colorIdx = 0
function projectColor(name: string): string {
  if (!PROJECT_COLORS[name]) {
    PROJECT_COLORS[name] = PALETTE[colorIdx % PALETTE.length]
    colorIdx++
  }
  return PROJECT_COLORS[name]
}

export default function ActivityPage() {
  const { entries, loading } = useActivityLog()

  const grouped: Record<string, typeof entries> = {}
  for (const e of entries) {
    const day = new Date(e.created_at).toLocaleDateString('pl-PL', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
    if (!grouped[day]) grouped[day] = []
    grouped[day].push(e)
  }

  return (
    <div className="px-4 pt-14 pb-4">
      {/* Header */}
      <div className="mb-7 anim-fade-up">
        <img src="/logo.png" alt="AdSavvy" className="h-6 mb-1.5 object-contain object-left" />
        <h1 className="text-3xl font-bold leading-none" style={{ color: 'var(--text-1)' }}>
          Aktywność
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>
          Zmiany wprowadzone przez Claude Code
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }}
          />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 anim-scale-in">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--surface)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: 'var(--text-3)' }}>
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <p className="font-semibold mb-1" style={{ color: 'var(--text-2)' }}>
            Brak aktywności
          </p>
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>
            Pojawi się tu kiedy Claude Code coś zmieni w innym projekcie
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([day, dayEntries], gi) => (
            <div key={day} className={`anim-fade-up`} style={{ animationDelay: `${gi * 0.06}s` }}>
              <p
                className="text-xs font-semibold mb-3"
                style={{ color: 'var(--text-2)' }}
              >
                {day}
              </p>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: 'var(--surface)' }}
              >
                {dayEntries.map((entry, i) => {
                  const color = projectColor(entry.project)
                  const fileName = fileShort(entry.file_path)
                  return (
                    <div
                      key={entry.id}
                      className="px-4 py-3.5 flex items-start gap-3 anim-fade-up"
                      style={{
                        animationDelay: `${gi * 0.06 + i * 0.03}s`,
                        borderBottom: i < dayEntries.length - 1 ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      {/* Project dot */}
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                        style={{ background: color }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span
                            className="text-sm font-semibold"
                            style={{ color }}
                          >
                            {entry.project}
                          </span>
                          {fileName && (
                            <span
                              className="font-mono text-xs truncate max-w-[160px]"
                              style={{ color: 'var(--text-2)' }}
                            >
                              {fileName}
                            </span>
                          )}
                        </div>
                        {entry.file_path && entry.file_path !== fileName && (
                          <p
                            className="text-[10px] mt-0.5 truncate"
                            style={{ color: 'var(--text-3)', fontFamily: 'monospace' }}
                          >
                            {entry.file_path.replace(/\\/g, '/').split('/').slice(-3).join('/')}
                          </p>
                        )}
                      </div>

                      <span
                        className="text-[10px] font-medium flex-shrink-0 mt-0.5"
                        style={{ color: 'var(--text-3)' }}
                      >
                        {timeAgo(entry.created_at)}
                      </span>
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
