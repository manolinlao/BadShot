import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/create', label: 'Create' },
  { to: '/profile', label: 'Profile' },
  { to: '/login', label: 'Log in' },
]

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f8f4ef] text-[#211a16]">
      <header className="border-b border-[#e2d6ca] bg-[#fffaf5]">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <NavLink to="/" className="text-lg font-black tracking-none">
            BadShot
          </NavLink>

          <div className="flex gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'rounded px-3 py-2 text-sm font-semibold transition',
                    isActive
                      ? 'bg-[#211a16] text-white'
                      : 'text-[#5f4a3f] hover:bg-[#efe5dc]',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-10">
        <Outlet />
      </main>
    </div>
  )
}
