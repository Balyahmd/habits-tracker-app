import { NavLink } from 'react-router'
import { ChartColumn, House, ListChecks, User } from 'lucide-react'

// Dipisah jadi fungsi supaya empat tautan di bawah tidak mengulang class yang
// sama persis. NavLink mengirim isActive ke fungsi ini lewat className.
function navItemClass(isActive: boolean): string {
  const base =
    'flex w-[72px] flex-col items-center gap-1 rounded-full py-2 transition-colors lg:py-3'

  if (isActive) {
    return `${base} bg-ink text-white dark:bg-ink-dark dark:text-ink`
  }

  return `${base} text-ink-soft dark:text-ink-soft-dark`
}

function BottomNav() {
  // z-30 menjaga navigasi tetap di lapisan paling atas. Tanpa itu, kartu yang
  // sedang dianimasikan di halaman Today naik melewatinya.
  return (
    <nav className="bg-surface-blur dark:bg-surface-blur-dark shadow-nav fixed inset-x-0 bottom-4 z-30 mx-auto flex w-fit gap-1 rounded-full p-2 backdrop-blur-[16px] lg:inset-x-auto lg:top-6 lg:bottom-auto lg:left-6 lg:mx-0 lg:flex-col lg:gap-2 lg:rounded-[48px] lg:px-3 lg:py-4">
      <NavLink to="/" end className={({ isActive }) => navItemClass(isActive)}>
        <House className="h-5 w-5" />
        <span className="text-[11px] font-medium">Today</span>
      </NavLink>

      <NavLink
        to="/habits"
        className={({ isActive }) => navItemClass(isActive)}
      >
        <ListChecks className="h-5 w-5" />
        <span className="text-[11px] font-medium">Habits</span>
      </NavLink>

      <NavLink to="/stats" className={({ isActive }) => navItemClass(isActive)}>
        <ChartColumn className="h-5 w-5" />
        <span className="text-[11px] font-medium">Stats</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) => navItemClass(isActive)}
      >
        <User className="h-5 w-5" />
        <span className="text-[11px] font-medium">Profile</span>
      </NavLink>
    </nav>
  )
}

export default BottomNav
