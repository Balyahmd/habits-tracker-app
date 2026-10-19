import { createContext, useContext } from 'react'
import type { Theme } from '../types/theme'

export type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

// Context-nya tinggal di sini, bukan di ThemeProvider.tsx, karena berkas
// komponen yang juga mengekspor benda lain mematahkan fast refresh.
// Nilai bawaannya null supaya pemakaian di luar provider ketahuan langsung.
export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const value = useContext(ThemeContext)

  // Diperiksa dulu sebelum dipakai. Sesudah pemeriksaan ini TypeScript tahu
  // isinya pasti ada.
  if (value === null) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }

  return value
}
