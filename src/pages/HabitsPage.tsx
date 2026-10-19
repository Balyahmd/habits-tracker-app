import { Link, useSearchParams } from 'react-router'
import { Inbox, Plus, Search } from 'lucide-react'
import type { Habit, HabitCategory } from '../types/habit'
import { CATEGORIES, getCategoryStyle } from '../utils/habitCategory'
import HabitCard from '../components/HabitCard'

// 'all' bukan kategori, tapi pilihan chip pertama yang berarti tanpa saringan
type CategoryFilter = HabitCategory | 'all'

/**
 * Isi alamat bisa diketik siapa saja, jadi nilainya diperiksa dulu. Apa pun
 * yang tidak dikenali dianggap 'all', bukan membuat halamannya kosong.
 */
function toCategoryFilter(value: string): CategoryFilter {
  if (
    value === 'health' ||
    value === 'learning' ||
    value === 'work' ||
    value === 'other'
  ) {
    return value
  }

  return 'all'
}

type FilterChipProps = {
  label: string
  count: number
  countClass: string
  isActive: boolean
  onSelect: () => void
}

/** Chip filter berhitungan, panduan desain bagian 7.5. */
function FilterChip({
  label,
  count,
  countClass,
  isActive,
  onSelect
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={`focus-visible:ring-ink dark:focus-visible:ring-ink-dark flex h-11 shrink-0 items-center gap-2 rounded-full pr-5 pl-2.5 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        isActive
          ? 'bg-ink dark:bg-ink-dark dark:text-ink text-white'
          : 'bg-surface dark:bg-surface-dark shadow-card'
      }`}
    >
      <span
        className={`grid h-7 w-7 place-items-center rounded-full text-[13px] font-bold ${
          isActive ? 'bg-white/15' : countClass
        }`}
      >
        {count}
      </span>
      <span className="text-[14px] font-semibold">{label}</span>
    </button>
  )
}

type HabitsPageProps = {
  habits: Habit[]
}

function HabitsPage({ habits }: HabitsPageProps) {
  // Pencarian dan filter tinggal di alamat, bukan di state. Halamannya jadi
  // bisa dibagikan apa adanya, dan pilihannya tidak hilang saat di-refresh.
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q') ?? ''

  const category = toCategoryFilter(searchParams.get('category') ?? 'all')

  function updateFilters(nextQuery: string, nextCategory: CategoryFilter) {
    const next = new URLSearchParams()

    // Nilai bawaan tidak ditulis ke alamat, supaya alamatnya tetap pendek
    if (nextQuery !== '') {
      next.set('q', nextQuery)
    }

    if (nextCategory !== 'all') {
      next.set('category', nextCategory)
    }

    // replace supaya tiap huruf yang diketik tidak menumpuk jadi riwayat
    // sendiri, dan tombol kembali browser tetap masuk akal
    setSearchParams(next, { replace: true })
  }

  const trimmedQuery = query.trim().toLowerCase()

  const visibleHabits = habits.filter((habit) => {
    const matchesCategory = category === 'all' || habit.category === category
    const matchesQuery =
      trimmedQuery === '' || habit.name.toLowerCase().includes(trimmedQuery)

    return matchesCategory && matchesQuery
  })

  return (
    <>
      <header className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold tracking-[-0.02em]">Habits</h1>
        <Link
          to="/habits/new"
          aria-label="Add a new habit"
          className="bg-ink dark:bg-ink-dark dark:text-ink grid h-12 w-12 place-items-center rounded-full text-white"
        >
          <Plus className="h-5 w-5" />
        </Link>
      </header>

      {habits.length === 0 ? (
        <div className="bg-surface dark:bg-surface-dark dark:border-line-dark shadow-card rounded-card mt-6 p-8 text-center dark:border">
          <Inbox className="text-ink-soft dark:text-ink-soft-dark mx-auto h-10 w-10" />
          <p className="text-ink-soft dark:text-ink-soft-dark mt-3 text-[15px] font-medium">
            No habits here yet. Add one and it will show up on your Today
            screen.
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
          <div className="relative mt-5">
            <Search className="text-ink-soft dark:text-ink-soft-dark pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(event) => updateFilters(event.target.value, category)}
              placeholder="Search habits"
              aria-label="Search habits"
              className="bg-surface dark:bg-surface-dark shadow-card rounded-input focus:ring-ink dark:focus:ring-ink-dark h-14 w-full pr-4 pl-12 text-[15px] outline-none focus:ring-2"
            />
          </div>

          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto py-1">
            <FilterChip
              label="All"
              count={habits.length}
              countClass="bg-line dark:bg-line-dark"
              isActive={category === 'all'}
              onSelect={() => updateFilters(query, 'all')}
            />

            {CATEGORIES.map((item) => {
              const style = getCategoryStyle(item)
              const count = habits.filter(
                (habit) => habit.category === item
              ).length

              // Kategori kosong tidak ditampilkan, mengikuti mockup. Kecuali
              // kategori itu yang sedang menyaring, karena chipnya yang hilang
              // membuat pengguna tidak tahu apa yang sedang menyaring daftarnya.
              if (count === 0 && category !== item) {
                return null
              }

              return (
                <FilterChip
                  key={item}
                  label={style.label}
                  count={count}
                  countClass={style.tint}
                  isActive={category === item}
                  onSelect={() => updateFilters(query, item)}
                />
              )
            })}
          </div>

          <p className="text-ink-soft dark:text-ink-soft-dark mt-5 text-[13px] font-medium">
            Showing {visibleHabits.length} of {habits.length} habits
          </p>

          {visibleHabits.length === 0 ? (
            <div className="bg-surface dark:bg-surface-dark dark:border-line-dark shadow-card rounded-card mt-3 p-8 text-center dark:border">
              <Inbox className="text-ink-soft dark:text-ink-soft-dark mx-auto h-10 w-10" />
              <p className="text-ink-soft dark:text-ink-soft-dark mt-3 text-[15px] font-medium">
                {trimmedQuery === ''
                  ? 'No habits in this category yet.'
                  : `No habits match “${query.trim()}”. Try another word.`}
              </p>
              <button
                type="button"
                onClick={() => updateFilters('', 'all')}
                className="bg-ink dark:bg-ink-dark dark:text-ink mt-4 inline-flex h-12 items-center rounded-full px-6 text-[14px] font-semibold text-white"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {visibleHabits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}

export default HabitsPage
