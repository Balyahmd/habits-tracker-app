import { useEffect, useState } from 'react'

const RADIUS = 60
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// Satu persen tiap 20ms. Perubahan 25 persen memakan setengah detik, jadi
// terasa merangkak seperti loader, bukan melompat.
const STEP_DURATION_IN_MS = 20

type ProgressRingProps = {
  percent: number
}

/**
 * Cincin progress SVG buatan sendiri, bukan library, sesuai panduan desain
 * bagian 7.4.
 *
 * Cara kerjanya: garis lingkaran dibuat putus-putus sepanjang kelilingnya
 * sendiri, lalu digeser dengan stroke-dashoffset. Offset nol berarti penuh,
 * offset sepanjang keliling berarti kosong.
 */
function ProgressRing({ percent }: ProgressRingProps) {
  // Angka yang sedang ditampilkan, merangkak menuju angka yang sebenarnya
  const [shownPercent, setShownPercent] = useState(percent)

  // Tiap langkah menjadwalkan langkah berikutnya, dan berhenti sendiri begitu
  // angkanya sampai. Tidak ada timer yang terus berjalan saat sudah diam.
  useEffect(() => {
    if (shownPercent === percent) {
      return
    }

    const step = shownPercent < percent ? 1 : -1
    const timer = setTimeout(
      () => setShownPercent(shownPercent + step),
      STEP_DURATION_IN_MS
    )

    return () => clearTimeout(timer)
  }, [percent, shownPercent])

  const offset = CIRCUMFERENCE - (CIRCUMFERENCE * shownPercent) / 100

  return (
    <div className="relative shrink-0">
      <svg
        width="132"
        height="132"
        viewBox="0 0 132 132"
        className="-rotate-90"
        role="img"
        aria-label={`${percent} percent complete`}
      >
        <circle
          cx="66"
          cy="66"
          r={RADIUS}
          fill="none"
          strokeWidth="12"
          className="stroke-ring-track"
        />
        <circle
          cx="66"
          cy="66"
          r={RADIUS}
          fill="none"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          // Transisi pendek ini cuma menghaluskan jarak antar langkah, supaya
          // busurnya mengalir dan tidak terlihat mematah tiap satu persen
          className="stroke-lime transition-[stroke-dashoffset] duration-100 ease-linear"
        />
      </svg>

      <div className="absolute inset-0 grid place-items-center">
        <span className="text-[32px] font-bold tracking-[-0.02em]">
          {shownPercent}
          <span className="text-[18px]">%</span>
        </span>
      </div>
    </div>
  )
}

export default ProgressRing