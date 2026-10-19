import { Link } from 'react-router'
import { ArrowUpRight, Calendar, Flame } from 'lucide-react'
import type { Habit } from '../types/habit'
import { countDoneInLastSevenDays, getCurrentStreak } from '../utils/streak'
import { getCategoryStyle } from '../utils/habitCategory'
import SevenDayBar from './SevenDayBar'

type HabitCardProps = {
  habit: Habit
}

function HabitCard({ habit }: HabitCardProps) {
  const style = getCategoryStyle(habit.category)
  const streak = getCurrentStreak(habit.checkIns)

  const doneThisWeek = countDoneInLastSevenDays(habit.checkIns)

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

          <h3 className="mt-2 text-[17px] font-semibold tracking-[-0.01em]">
            {habit.name}
          </h3>

          {habit.description !== undefined && habit.description !== '' && (
            <p className="text-ink-soft dark:text-ink-soft-dark mt-1 text-[13px]">
              {habit.description}
            </p>
          )}
        </div>

        <Link
          to={`/habits/${habit.id}`}
          aria-label={`Open ${habit.name}`}
          className="bg-line dark:bg-line-dark grid h-11 w-11 shrink-0 place-items-center rounded-full"
        >
          <ArrowUpRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="mt-4">
        <SevenDayBar checkIns={habit.checkIns} />
      </div>

      <div className="border-line dark:border-line-dark text-ink-soft dark:text-ink-soft-dark mt-4 flex items-center gap-4 border-t pt-3 text-[12px] font-medium">
        <span className="flex items-center gap-1.5">
          <Flame className="h-4 w-4" />
          {streak} day streak
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          {doneThisWeek} of 7 days
        </span>
      </div>
    </article>
  )
}

export default HabitCard
