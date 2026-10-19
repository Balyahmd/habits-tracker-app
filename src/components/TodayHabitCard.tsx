import { Check, CircleDashed, Flame } from 'lucide-react'
import type { Habit } from '../types/habit'
import { getCurrentStreak } from '../utils/streak'
import { getCategoryStyle } from '../utils/habitCategory'

type TodayHabitCardProps = {
  habit: Habit
  isDone: boolean
  onToggle: () => void
}

/**
 * Kartu habit versi halaman Today: tombol centang, tanpa bar tujuh hari.
 * Panduan desain bagian 14 sudah menutup keputusan itu.
 *
 * Tombol centangnya checkbox sungguhan yang disembunyikan, bukan tombol biasa.
 * Keadaan tercentang jadi diumumkan sendiri oleh pembaca layar, dan spasi
 * bekerja seperti yang diharapkan.
 */
function TodayHabitCard({ habit, isDone, onToggle }: TodayHabitCardProps) {
  const style = getCategoryStyle(habit.category)
  const streak = getCurrentStreak(habit.checkIns)

  return (
    <article className="bg-surface dark:bg-surface-dark dark:border-line-dark shadow-card rounded-card p-4 dark:border">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <span
            className={`inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold ${style.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {style.label}
          </span>

          {/* truncate menjaga namanya tetap satu baris, jadi tinggi tiap kartu
              selalu sama. Itu yang membuat animasi pemindahan di halaman Today
              cukup memakai translateY tanpa mengukur apa pun. */}
          <h3 className="mt-2 truncate text-[17px] font-semibold tracking-[-0.01em]">
            {habit.name}
          </h3>

          <p className="text-ink-soft dark:text-ink-soft-dark mt-1.5 flex items-center gap-1.5 text-[12px] font-medium">
            <Flame className="h-4 w-4 shrink-0" />
            {streak} day streak
          </p>
        </div>

        <label
          className={`grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full has-focus-visible:ring-2 has-focus-visible:ring-offset-2 ${
            isDone
              ? 'bg-lime text-ink ring-ink dark:ring-ink-dark'
              : 'bg-line text-ink-soft dark:bg-line-dark dark:text-ink-soft-dark ring-ink dark:ring-ink-dark'
          }`}
        >
          <input
            type="checkbox"
            checked={isDone}
            onChange={onToggle}
            aria-label={`${habit.name} done today`}
            className="sr-only"
          />
          {isDone ? (
            <Check className="h-5 w-5" />
          ) : (
            <CircleDashed className="h-5 w-5" />
          )}
        </label>
      </div>
    </article>
  )
}

export default TodayHabitCard
