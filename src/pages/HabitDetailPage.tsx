import { Link, useParams } from 'react-router'
import { ChevronLeft, Flame, Pencil, Trophy, TriangleAlert } from 'lucide-react'
import type { Habit } from '../types/habit'
import { formatDisplayDate } from '../utils/date'
import {
  countDoneInLastSevenDays,
  getCurrentStreak,
  getLongestStreak
} from '../utils/streak'
import { getCategoryStyle } from '../utils/habitCategory'
import SevenDayBar from '../components/SevenDayBar'

type HabitDetailPageProps = {
  habits: Habit[]
}

function HabitDetailPage({ habits }: HabitDetailPageProps) {
  const params = useParams()
  const habit = habits.find((item) => item.id === params.id)

  // Kasus nyata, bukan jaga-jaga: pengguna bisa menghapus habit lalu menekan
  // tombol kembali browser. Diminta PRD bagian 8.
  if (habit === undefined) {
    return (
      <div className="bg-surface dark:bg-surface-dark dark:border-line-dark shadow-card rounded-card p-5 text-center dark:border">
        {/* Disembunyikan dari mata supaya kartunya tetap seperti yang
            disetujui, tapi halamannya tetap punya judul untuk pembaca layar */}
        <h1 className="sr-only">Habit not found</h1>

        <TriangleAlert className="text-ink-soft dark:text-ink-soft-dark mx-auto h-10 w-10" />
        <p className="text-ink-soft dark:text-ink-soft-dark mt-4 text-[15px]">
          We could not find that habit. It may have been deleted already.
        </p>
        <Link
          to="/habits"
          className="bg-ink dark:bg-ink-dark dark:text-ink mt-5 inline-flex h-14 w-full items-center justify-center rounded-full text-[15px] font-semibold text-white"
        >
          Back to Habits
        </Link>
      </div>
    )
  }

  const style = getCategoryStyle(habit.category)
  const currentStreak = getCurrentStreak(habit.checkIns)
  const longestStreak = getLongestStreak(habit.checkIns)

  const doneThisWeek = countDoneInLastSevenDays(habit.checkIns)

  // Riwayat ditampilkan dari yang paling baru, karena itu yang paling dicari.
  // Disalin dulu, karena reverse mengubah array aslinya.
  const checkInHistory = [...habit.checkIns].reverse()

  return (
    <>
      <header className="flex items-center gap-3">
        <Link
          to="/habits"
          aria-label="Back to habits"
          className="bg-surface dark:bg-surface-dark shadow-card grid h-12 w-12 shrink-0 place-items-center rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <span
          className={`inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold ${style.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
          {style.label}
        </span>
      </header>

      <h1 className="mt-5 text-[28px] font-bold tracking-[-0.02em]">
        {habit.name}
      </h1>

      {habit.description !== undefined && habit.description !== '' && (
        <p className="text-ink-soft dark:text-ink-soft-dark mt-2 text-[15px]">
          {habit.description}
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="bg-surface dark:bg-surface-dark dark:border-line-dark shadow-card rounded-card p-5 dark:border">
          <Flame className="text-ink-soft dark:text-ink-soft-dark h-5 w-5" />
          <p className="mt-3 text-[28px] font-bold tracking-[-0.02em]">
            {currentStreak}
          </p>
          <p className="text-ink-soft dark:text-ink-soft-dark text-[12px] font-medium">
            Current streak
          </p>
        </div>

        <div className="bg-surface dark:bg-surface-dark dark:border-line-dark shadow-card rounded-card p-5 dark:border">
          <Trophy className="text-ink-soft dark:text-ink-soft-dark h-5 w-5" />
          <p className="mt-3 text-[28px] font-bold tracking-[-0.02em]">
            {longestStreak}
          </p>
          <p className="text-ink-soft dark:text-ink-soft-dark text-[12px] font-medium">
            Longest streak
          </p>
        </div>
      </div>

      <div className="bg-surface dark:bg-surface-dark dark:border-line-dark shadow-card rounded-card mt-3 p-5 dark:border">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[17px] font-semibold tracking-[-0.01em]">
            Last 7 days
          </h2>
          <p className="text-ink-soft dark:text-ink-soft-dark text-[12px] font-medium">
            {doneThisWeek} of 7 days
          </p>
        </div>
        <div className="mt-4">
          <SevenDayBar checkIns={habit.checkIns} />
        </div>
      </div>

      <div className="bg-surface dark:bg-surface-dark dark:border-line-dark shadow-card rounded-card mt-3 p-5 dark:border">
        <h2 className="text-[17px] font-semibold tracking-[-0.01em]">
          Check in history
        </h2>

        {checkInHistory.length === 0 ? (
          <p className="text-ink-soft dark:text-ink-soft-dark mt-3 text-[15px]">
            No check ins yet. Every day you tick this off will show up here.
          </p>
        ) : (
          <ul className="mt-3">
            {checkInHistory.map((date) => (
              <li
                key={date}
                className="border-line dark:border-line-dark flex items-center gap-3 border-b py-3 last:border-b-0 last:pb-0"
              >
                <span className="bg-lime h-2 w-2 shrink-0 rounded-full" />
                <span className="text-[15px]">{formatDisplayDate(date)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-ink-soft dark:text-ink-soft-dark mt-4 text-center text-[12px] font-medium">
        Started on {formatDisplayDate(habit.createdAt)}
      </p>

      <Link
        to={`/habits/${habit.id}/edit`}
        className="bg-ink dark:bg-ink-dark dark:text-ink mt-4 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white"
      >
        <Pencil className="h-5 w-5" />
        Edit Habit
      </Link>
    </>
  )
}

export default HabitDetailPage
