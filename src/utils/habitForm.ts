import type { Habit, HabitCategory } from '../types/habit'

export const MAX_DESCRIPTION_LENGTH = 120

export type HabitFormValues = {
  name: string
  description: string
  category: HabitCategory | ''
}

export type HabitFormErrors = {
  name?: string
  description?: string
  category?: string
}

/**
 * Aturan validasi PRD bagian 9, dipakai form tambah maupun form edit.
 *
 * `currentHabitId` berisi id habit yang sedang diedit, atau null kalau ini
 * habit baru. Tanpa itu, menyimpan habit tanpa mengubah namanya akan ditolak
 * karena namanya bentrok dengan dirinya sendiri.
 */
export function validateHabitForm(
  values: HabitFormValues,
  habits: Habit[],
  currentHabitId: string | null
): HabitFormErrors {
  const errors: HabitFormErrors = {}
  const name = values.name.trim()

  if (name === '') {
    errors.name = 'Enter a habit name.'
  } else if (name.length < 3) {
    errors.name = 'Use at least 3 characters so you can recognise it later.'
  } else if (name.length > 40) {
    errors.name = 'Use 40 characters or fewer.'
  } else if (
    // Perbandingan tanpa membedakan huruf besar kecil, sesuai PRD bagian 9
    habits.some(
      (habit) =>
        habit.id !== currentHabitId &&
        habit.name.toLowerCase() === name.toLowerCase()
    )
  ) {
    errors.name = 'You already have a habit with this name. Pick another one.'
  }

  if (values.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = 'Use 120 characters or fewer.'
  }

  if (values.category === '') {
    errors.category = 'Choose a category.'
  }

  return errors
}
