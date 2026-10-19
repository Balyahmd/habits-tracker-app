import type { Habit } from '../types/habit'
import type { Profile } from '../types/profile'
import type { Theme } from '../types/theme'
import { isDateString } from './date'

// Empat kunci dari PRD bagian 10. Ditulis sekali di sini supaya tidak ada
// kunci yang salah ketik di tempat lain.
const VERSION_KEY = 'habits-tracker:version'
const PROFILE_KEY = 'habits-tracker:profile'
const HABITS_KEY = 'habits-tracker:habits'
const THEME_KEY = 'habits-tracker:theme'

const CURRENT_VERSION = '1'

export function clearDataIfVersionChanged(): boolean {
  const storedVersion = localStorage.getItem(VERSION_KEY)

  if (storedVersion === CURRENT_VERSION) {
    return false
  }

  localStorage.removeItem(PROFILE_KEY)
  localStorage.removeItem(HABITS_KEY)
  localStorage.removeItem(THEME_KEY)
  localStorage.setItem(VERSION_KEY, CURRENT_VERSION)

  return storedVersion !== null
}

export function readHabits(): Habit[] {
  const raw = localStorage.getItem(HABITS_KEY)

  if (raw === null) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)

    // JSON.parse tidak tahu bentuk datanya, jadi bentuknya diperiksa sendiri.
    // Isi localStorage bisa disunting tangan siapa saja.
    if (!Array.isArray(parsed)) {
      return []
    }

    const habits: Habit[] = []

    // Elemen yang bentuknya tidak utuh dilewati, bukan membuat seluruh daftar
    // dibuang. Satu habit rusak tidak boleh menghilangkan yang lain.
    for (const item of parsed) {
      if (item === null || typeof item !== 'object') {
        continue
      }

      if (typeof item.id !== 'string' || typeof item.name !== 'string') {
        continue
      }

      if (typeof item.createdAt !== 'string' || !isDateString(item.createdAt)) {
        continue
      }

      if (
        item.category !== 'health' &&
        item.category !== 'learning' &&
        item.category !== 'work' &&
        item.category !== 'other'
      ) {
        continue
      }

      if (!Array.isArray(item.checkIns)) {
        continue
      }

      const checkIns: string[] = []

      for (const date of item.checkIns) {
        // Tanggal yang bentuknya bukan YYYY-MM-DD dilewati, begitu juga tanggal
        // ganda, sesuai invarian PRD bagian 3.2
        if (
          typeof date === 'string' &&
          isDateString(date) &&
          !checkIns.includes(date)
        ) {
          checkIns.push(date)
        }
      }

      // Urut menaik. Bentuk YYYY-MM-DD sudah urut secara alfabet, jadi sort
      // biasa sudah benar tanpa fungsi pembanding.
      checkIns.sort()

      habits.push({
        id: item.id,
        name: item.name,
        description:
          typeof item.description === 'string' ? item.description : undefined,
        category: item.category,
        createdAt: item.createdAt,
        checkIns
      })
    }

    return habits
  } catch {
    // Teksnya bukan JSON yang sah. Diperlakukan sebagai data kosong supaya
    // aplikasinya tetap terbuka, sesuai PRD bagian 10.
    return []
  }
}

/**
 * Mengembalikan false kalau penyimpanan menolak.
 *
 * localStorage bisa gagal walaupun datanya benar, misalnya kuotanya penuh atau
 * browsernya sedang di mode private. Tanpa penanganan ini, satu penolakan
 * menjatuhkan seluruh aplikasi.
 */
export function writeHabits(habits: Habit[]): boolean {
  try {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits))
    return true
  } catch {
    return false
  }
}

export function readProfile(): Profile | null {
  const raw = localStorage.getItem(PROFILE_KEY)

  if (raw === null) {
    return null
  }

  try {
    const parsed = JSON.parse(raw)

    if (parsed === null || typeof parsed !== 'object') {
      return null
    }

    // Bentuknya diperiksa satu per satu. Object yang sah menurut JSON belum
    // tentu berbentuk Profile, dan halaman yang membaca profile.name akan
    // pecah kalau field-nya ternyata tidak ada.
    if (typeof parsed.name !== 'string') {
      return null
    }

    if (typeof parsed.birthDate !== 'string' || !isDateString(parsed.birthDate)) {
      return null
    }

    if (parsed.gender !== 'male' && parsed.gender !== 'female') {
      return null
    }

    return {
      name: parsed.name,
      birthDate: parsed.birthDate,
      gender: parsed.gender,
      photo: typeof parsed.photo === 'string' ? parsed.photo : undefined
    }
  } catch {
    return null
  }
}

export function writeProfile(profile: Profile): boolean {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    return true
  } catch {
    return false
  }
}

// Tema cuma dua kata, jadi tidak perlu JSON. Apa pun selain 'dark' dianggap
// terang, termasuk kalau isinya sudah rusak.
export function readTheme(): Theme {
  return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'
}

export function writeTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // Tema yang gagal tersimpan tidak perlu diberitahukan. Temanya tetap
    // berubah di layar, cuma tidak bertahan sesudah browser ditutup.
  }
}
