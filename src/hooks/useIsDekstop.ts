import { useSyncExternalStore } from 'react'
const DESKTOP_QUERY = '(min-width: 1024px)'

/**
 * Mengembalikan true kalau lebar layar sudah masuk ukuran desktop.
 *
 * Dipakai untuk logika yang tidak bisa diatur lewat class `lg:`, misalnya
 * animasi yang dihitung di JavaScript. Untuk urusan tampilan biasa, cukup
 * pakai class `lg:` di Tailwind.
 */
export function useIsDesktop(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(DESKTOP_QUERY)
      media.addEventListener('change', onChange)

      return () => media.removeEventListener('change', onChange)
    },
    () => window.matchMedia(DESKTOP_QUERY).matches,
    // Nilai awal untuk server rendering. Proyek ini murni client, tapi
    // argumen ini tetap aman dibiarkan ada.
    () => false
  )
}