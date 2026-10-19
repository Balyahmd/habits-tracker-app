import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Theme } from '../types/theme'
import { ThemeContext } from '../hooks/useTheme'
import { readTheme, writeTheme } from '../utils/storage'

type ThemeProviderProps = {
  children: ReactNode
}

function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(readTheme())

  // Tailwind membaca class dark di elemen akar. Menyentuh elemen di luar React
  // seperti ini memang tugas useEffect.
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  function setTheme(nextTheme: Theme) {
    setThemeState(nextTheme)
    writeTheme(nextTheme)
  }

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>
}

export default ThemeProvider
