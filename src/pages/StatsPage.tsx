import { Link } from 'react-router'
import { CalendarCheck, ChartColumn } from 'lucide-react'
import type { Habit } from '../types/habit'
import { getHabitWeekStats, getWeekTotals } from '../utils/stats'
import ProgressRing from '../components/ProgressRing'

type StatsPageProps = {
  habits: Habit[]
}

function StatsPage({ habits }: StatsPageProps) {
  const statsList = habits.map((habit) => getHabitWeekStats(habit))
  const totals = getWeekTotals(statsList)

  // Yang paling jarang ditaruh di atas, supaya yang butuh perhatian terlihat
  // lebih dulu. Disalin dulu, karena sort mengubah array aslinya.
  const sortedStats = [...statsList].sort((a, b) => a.percent - b.percent)

  return (
    <>
      <h1 className="text-[28px] font-bold tracking-[-0.02em]">Stats</h1>

      {habits.length === 0 ? (
        <div className="bg-surface dark:bg-surface-dark dark:border-line-dark shadow-card rounded-card mt-6 p-8 text-center dark:border">
          <ChartColumn className="text-ink-soft dark:text-ink-soft-dark mx-auto h-10 w-10" />
          <p className="text-ink-soft dark:text-ink-soft-dark mt-3 text-[15px] font-medium">
            Nothing to measure yet. Add a habit and your first week will show up
            here.
          </p>
          <Link
            to="/habits/new"
            className="bg-ink dark:bg-ink-dark dark:text-ink mt-4 inline-flex h-12 items-center rounded-full px-6 text-[14px] font-semibold text-white"
          >
            Add Your First Habit
          </Link>
        </div>
      ) : (
        <>
          {/* Satu kartu gelap per halaman, panduan desain bagian 7.3 */}
          <section className="bg-ink shadow-nav rounded-card mt-6 p-5 text-white">
            <p className="text-[15px] font-semibold">This Week</p>

            <div className="mt-4 flex items-center gap-5">
              <ProgressRing percent={totals.percent} />

              <div className="flex-1 space-y-3 border-l border-white/10 pl-5">
                <div className="flex items-center gap-3">
                  <span className="bg-lime/20 text-lime grid h-9 w-9 shrink-0 place-items-center rounded-xl">
                    <CalendarCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[17px] leading-none font-bold">
                      {totals.doneDays}
                    </p>
                    <p className="mt-1 text-[12px] font-medium text-white/60">
                      Days checked in
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10">
                    <ChartColumn className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[17px] leading-none font-bold">
                      {totals.possibleDays}
                    </p>
                    <p className="mt-1 text-[12px] font-medium text-white/60">
                      Days possible
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <h2 className="mt-7 text-[17px] font-semibold tracking-[-0.01em]">
            Habit by Habit
          </h2>
          <p className="text-ink-soft dark:text-ink-soft-dark mt-1 text-[13px] font-medium">
            The ones that need attention are at the top.
          </p>

          <div className="mt-4 space-y-3">
            {sortedStats.map((stats) => (
              <article
                key={stats.habit.id}
                className="bg-surface dark:bg-surface-dark dark:border-line-dark shadow-card rounded-card p-4 dark:border"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="min-w-0 truncate text-[15px] font-semibold">
                    {stats.habit.name}
                  </h3>
                  <p className="text-ink-soft dark:text-ink-soft-dark shrink-0 text-[12px] font-medium">
                    {stats.doneDays} of {stats.possibleDays}{' '}
                    {stats.possibleDays === 1 ? 'day' : 'days'}
                  </p>
                </div>

                {/* Bar kemajuan mendatar, panduan desain bagian 10. Lebarnya
                    ditulis lewat style karena nilainya baru diketahui saat
                    render, dan Tailwind tidak bisa membuat class dari angka
                    yang berubah-ubah. */}
                <div className="bg-line dark:bg-line-dark mt-3 h-2 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-lime h-2 rounded-full transition-[width] duration-300"
                    style={{ width: `${stats.percent}%` }}
                  />
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default StatsPage
