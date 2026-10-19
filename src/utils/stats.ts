import type { Habit } from '../types/habit'
import { getLastSevenDates } from './date'

export type HabitWeekStats = {
  habit: Habit
  doneDays: number
  possibleDays: number
  percent: number
}

/**
 * Rekap tujuh hari terakhir untuk satu habit.
 *
 * Habit yang dibuat kurang dari tujuh hari lalu dihitung sejak tanggal
 * dibuatnya, sesuai PRD bagian 7. Tanpa aturan itu, habit yang baru dibuat
 * kemarin selalu tampil di bawah lima belas persen, dan angkanya menyesatkan.
 */
export function getHabitWeekStats(habit: Habit): HabitWeekStats {
  // Perbandingan string cukup, karena YYYY-MM-DD sudah urut secara alfabet
  const possibleDates = getLastSevenDates().filter(
    (date) => date >= habit.createdAt
  )

  const doneDays = possibleDates.filter((date) =>
    habit.checkIns.includes(date)
  ).length

  const possibleDays = possibleDates.length

  return {
    habit,
    doneDays,
    possibleDays,
    percent:
      possibleDays === 0 ? 0 : Math.round((doneDays / possibleDays) * 100)
  }
}

export type WeekTotals = {
  doneDays: number
  possibleDays: number
  percent: number
}

/**
 * Persentase keseluruhan minggu ini.
 *
 * Dihitung dari total hari tercentang dibagi total hari yang mungkin, bukan
 * dari rata-rata persentase tiap habit. Rata-rata persentase memberi bobot
 * yang sama pada habit yang baru dibuat kemarin dan habit yang sudah sebulan.
 */
export function getWeekTotals(statsList: HabitWeekStats[]): WeekTotals {
  let doneDays = 0
  let possibleDays = 0

  for (const stats of statsList) {
    doneDays = doneDays + stats.doneDays
    possibleDays = possibleDays + stats.possibleDays
  }

  return {
    doneDays,
    possibleDays,
    percent:
      possibleDays === 0 ? 0 : Math.round((doneDays / possibleDays) * 100)
  }
}
