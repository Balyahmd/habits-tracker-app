import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import Layout from './components/Layout'
import TodayPage from './pages/TodayPage'
import HabitsPage from './pages/HabitsPage'
import NewHabitPage from './pages/NewHabitPage'
import HabitDetailPage from './pages/HabitDetailPage'
import EditHabitPage from './pages/EditHabitPage'
import StatsPage from './pages/StatsPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'
import type { Flash } from './types/flash'
import type { Habit } from './types/habit'
import type { Profile } from './types/profile'
import { getTodayDate } from './utils/date'
import { useProfile } from './hooks/useProfile'
import { useHabits } from './hooks/useHabits'

const FLASH_DURATION_IN_MS = 4000

const STORAGE_ERROR_MESSAGE =
  'We could not save your changes. Your browser storage may be full or blocked.'

type AppProps = {
  dataWasCleared: boolean
}

function App({ dataWasCleared }: AppProps) {
  // Dipanggil sekali di sini, lalu dikirim ke bawah lewat props. Kalau tiap
  // halaman memanggil hook-nya sendiri, keduanya punya state terpisah dan
  // perubahan di satu halaman tidak terlihat di halaman lain.
  const { profile, saveProfile } = useProfile()
  const { habits, saveHabits } = useHabits()

  const [flash, setFlash] = useState<Flash | null>(null)

  // Pesan hilang sendiri sesudah beberapa detik. Timer-nya dibersihkan supaya
  // pesan lama tidak menutup pesan baru yang muncul lebih dulu.
  useEffect(() => {
    if (flash === null) {
      return
    }

    const timer = setTimeout(() => setFlash(null), FLASH_DURATION_IN_MS)

    return () => clearTimeout(timer)
  }, [flash])

  function handleSaveProfile(nextProfile: Profile) {
    if (saveProfile(nextProfile)) {
      setFlash({ tone: 'success', message: 'Your profile is saved.' })
    } else {
      setFlash({ tone: 'error', message: STORAGE_ERROR_MESSAGE })
    }
  }

  /**
   * Menandai atau membatalkan check in untuk hari ini.
   *
   * Yang disentuh cuma tanggal hari ini, jadi check in mundur mustahil terjadi
   * dan satu habit tidak bisa punya dua check in di hari yang sama.
   */
  function handleToggleCheckIn(habitId: string) {
    const today = getTodayDate()

    const nextHabits = habits.map((habit) => {
      if (habit.id !== habitId) {
        return habit
      }

      if (habit.checkIns.includes(today)) {
        return {
          ...habit,
          checkIns: habit.checkIns.filter((date) => date !== today)
        }
      }

      // Disalin dulu sebelum diurutkan, karena sort mengubah array aslinya
      return { ...habit, checkIns: [...habit.checkIns, today].sort() }
    })

    // Tanpa pesan berhasil. Tombolnya sendiri yang berubah warna, dan banner
    // di tiap ketukan justru jadi gangguan.
    if (!saveHabits(nextHabits)) {
      setFlash({ tone: 'error', message: STORAGE_ERROR_MESSAGE })
    }
  }

  function handleSaveHabits(nextHabits: Habit[], successMessage: string) {
    if (saveHabits(nextHabits)) {
      setFlash({ tone: 'success', message: successMessage })
    } else {
      setFlash({ tone: 'error', message: STORAGE_ERROR_MESSAGE })
    }
  }

  return (
    <Routes>
      {/* Seluruh halaman duduk di dalam satu layout bersama, jadi header dan
          navigasi bawah tidak ditulis ulang di tiap halaman */}
      <Route
        element={
          <Layout
            dataWasCleared={dataWasCleared}
            flash={flash}
            onDismissFlash={() => setFlash(null)}
          />
        }
      >
        <Route
          index
          element={
            <TodayPage
              profile={profile}
              habits={habits}
              onToggleCheckIn={handleToggleCheckIn}
            />
          }
        />
        <Route path="habits" element={<HabitsPage habits={habits} />} />
        <Route
          path="habits/new"
          element={<NewHabitPage habits={habits} onSave={handleSaveHabits} />}
        />
        <Route
          path="habits/:id"
          element={<HabitDetailPage habits={habits} />}
        />
        <Route
          path="habits/:id/edit"
          element={<EditHabitPage habits={habits} onSave={handleSaveHabits} />}
        />
        <Route path="stats" element={<StatsPage habits={habits} />} />
        <Route
          path="profile"
          element={<ProfilePage profile={profile} onSave={handleSaveProfile} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
