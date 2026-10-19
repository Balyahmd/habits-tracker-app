import type { HabitCategory } from '../types/habit'

export const CATEGORIES: HabitCategory[] = [
  'health',
  'learning',
  'work',
  'other'
]

export function getCategoryLabel(category: HabitCategory): string {
  if (category === 'health') {
    return 'Health'
  }

  if (category === 'learning') {
    return 'Learning'
  }

  if (category === 'work') {
    return 'Work'
  }

  return 'Other'
}

export type CategoryStyle = {
  label: string
  badge: string
  dot: string
  /** Latar lingkaran kecil berisi angka di chip filter, panduan desain 7.5 */
  tint: string
}

export function getCategoryStyle(category: HabitCategory): CategoryStyle {
  if (category === 'health') {
    return {
      label: 'Health',
      badge: 'bg-lime-tint text-lime-ink',
      dot: 'bg-lime',
      tint: 'bg-lime-tint'
    }
  }

  if (category === 'learning') {
    return {
      label: 'Learning',
      badge: 'bg-violet-tint text-violet-ink',
      dot: 'bg-violet',
      tint: 'bg-violet-tint'
    }
  }

  if (category === 'work') {
    return {
      label: 'Work',
      badge: 'bg-amber-tint text-amber-ink',
      dot: 'bg-amber',
      tint: 'bg-amber-tint'
    }
  }

  // Other sengaja netral. Tiga aksen sisanya sudah punya arti sendiri di
  // aplikasi ini, dan rose berarti hapus.
  return {
    label: 'Other',
    badge: 'bg-line text-ink-soft dark:bg-line-dark dark:text-ink-soft-dark',
    dot: 'bg-ink-soft dark:bg-ink-soft-dark',
    tint: 'bg-line dark:bg-line-dark'
  }
}
