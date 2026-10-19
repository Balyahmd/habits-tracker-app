import {
  getDateDaysAgo,
  getLastSevenDates,
  getNextDate,
  getPreviousDate,
  getTodayDate
} from './date'

/**
 * Jumlah hari berturut-turut sampai sekarang, sesuai aturan PRD bagian 6.
 *
 * Kalau belum check in hari ini tapi kemarin sudah, streak-nya masih hidup dan
 * dihitung mundur dari kemarin. Tanpa aturan itu, orang yang membuka aplikasi
 * pagi hari melihat streak-nya jatuh ke nol sebelum sempat mencentang apa pun.
 */
export function getCurrentStreak(checkIns: string[]): number {
  const today = getTodayDate()
  const yesterday = getDateDaysAgo(1)

  let cursor = today

  if (!checkIns.includes(today)) {
    cursor = yesterday

    if (!checkIns.includes(yesterday)) {
      return 0
    }
  }

  let streak = 0

  while (checkIns.includes(cursor)) {
    streak = streak + 1
    cursor = getPreviousDate(cursor)
  }

  return streak
}

/**
 * Deret hari berurutan terpanjang sepanjang riwayat, tanpa memandang kapan
 * terjadinya. Aturan PRD bagian 6.
 */
export function getLongestStreak(checkIns: string[]): number {
  if (checkIns.length === 0) {
    return 0
  }

  // Disalin dulu sebelum diurutkan, karena sort mengubah array aslinya
  const dates = [...checkIns].sort()

  let longest = 1
  let current = 1

  for (let index = 1; index < dates.length; index++) {
    if (dates[index] === getNextDate(dates[index - 1])) {
      current = current + 1
    } else {
      current = 1
    }

    if (current > longest) {
      longest = current
    }
  }

  return longest
}

/** Berapa dari tujuh hari terakhir yang tercentang. */
export function countDoneInLastSevenDays(checkIns: string[]): number {
  return getLastSevenDates().filter((date) => checkIns.includes(date)).length
}
