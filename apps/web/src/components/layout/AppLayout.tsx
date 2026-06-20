import { CirclePlus, Home, User, UserRound } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/create', label: 'Create', icon: CirclePlus },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/login', label: 'Account', icon: UserRound },
]

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f8f4ef] text-[#211a16]">
      <header className="sticky top-0 z-20 border-b border-[#e2d6ca] bg-[#fffaf5]/95 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <NavLink to="/" className="text-lg font-black tracking-tight">
            BadShot
          </NavLink>

          <div className="hidden gap-1 sm:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold transition',
                    isActive
                      ? 'bg-[#211a16] text-white'
                      : 'text-[#5f4a3f] hover:bg-[#efe5dc]',
                  ].join(' ')
                }
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 pb-28 pt-8 sm:pb-10 sm:pt-10">
        <Outlet />
      </main>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-10 border-t border-[#e2d6ca] bg-[#fffaf5] px-3 py-2 shadow-[0_-8px_24px_rgba(33,26,22,0.08)] sm:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex min-h-14 flex-col items-center justify-center rounded text-xs font-bold transition',
                  isActive
                    ? 'bg-[#211a16] text-white'
                    : 'text-[#6f5b50] hover:bg-[#efe5dc]',
                ].join(' ')
              }
            >
              <item.icon className="mb-1 h-5 w-5" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
