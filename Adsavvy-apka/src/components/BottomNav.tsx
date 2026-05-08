import { NavLink } from 'react-router-dom'

const tabs = [
  {
    to: '/clients',
    label: 'Klienci',
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: '/calendar',
    label: 'Kalendarz',
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    to: '/activity',
    label: 'Historia',
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto pointer-events-none"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
    >
      <nav
        className="pointer-events-auto flex"
        style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
        }}
      >
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className="flex-1 flex flex-col items-center py-3 gap-1 relative transition-all"
          >
            {({ isActive }) => (
              <>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 32,
                    borderRadius: 20,
                    background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                    transition: 'background 0.2s',
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {tab.icon(isActive)}
                </span>
                <span
                  className="text-[10px] font-semibold"
                  style={{
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.3)',
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: '0.02em',
                  }}
                >
                  {tab.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
