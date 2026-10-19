/** Menyusun YYYY-MM-DD dari komponen waktu lokal sebuah Date. */
function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * Tanggal hari ini dalam bentuk YYYY-MM-DD menurut waktu lokal.
 *
 * Jangan memakai toISOString() untuk ini. Method itu mengembalikan waktu UTC,
 * jadi untuk pengguna di Indonesia hasilnya mundur satu hari sepanjang pukul
 * 00.00 sampai 07.00. Bug seperti itu cuma muncul di pagi hari dan hampir
 * mustahil ditemukan sendiri.
 */
export function getTodayDate(): string {
  return formatLocalDate(new Date())
}

/** Tanggal sekian tahun yang lalu, dipakai untuk membatasi tanggal lahir. */
export function getDateYearsAgo(years: number): string {
  const date = new Date()
  date.setFullYear(date.getFullYear() - years)

  return formatLocalDate(date)
}

/** Tanggal sekian hari yang lalu dari hari ini. */
export function getDateDaysAgo(days: number): string {
  const now = new Date()
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days)

  return formatLocalDate(date)
}

/**
 * Sehari sebelum tanggal yang diberikan.
 *
 * Tanggalnya dipecah sendiri, bukan lewat new Date('2026-08-09'), karena bentuk
 * itu dibaca sebagai UTC dan bisa meleset satu hari.
 */
export function getPreviousDate(date: string): string {
  const parts = date.split('-')
  const year = Number(parts[0])
  const month = Number(parts[1])
  const day = Number(parts[2])

  return formatLocalDate(new Date(year, month - 1, day - 1))
}

/**
 * Memeriksa sebuah teks benar-benar berbentuk YYYY-MM-DD.
 *
 * Isi localStorage bisa disunting tangan, dan teks apa pun lolos pemeriksaan
 * `typeof value === 'string'`. Tanpa pemeriksaan bentuk, teks seperti `halo`
 * akan sampai ke layar sebagai `NaN undefined halo`.
 */
export function isDateString(value: string): boolean {
  const parts = value.split('-')

  if (parts.length !== 3) {
    return false
  }

  if (parts[0].length !== 4 || parts[1].length !== 2 || parts[2].length !== 2) {
    return false
  }

  const year = Number(parts[0])
  const month = Number(parts[1])
  const day = Number(parts[2])

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return false
  }

  return month >= 1 && month <= 12 && day >= 1 && day <= 31
}

/** Sehari sesudah tanggal yang diberikan. */
export function getNextDate(date: string): string {
  const parts = date.split('-')
  const year = Number(parts[0])
  const month = Number(parts[1])
  const day = Number(parts[2])

  return formatLocalDate(new Date(year, month - 1, day + 1))
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

/**
 * Bentuk tanggal yang enak dibaca, misalnya 9 August 2026.
 *
 * Ditulis sendiri dari daftar nama bulan, bukan lewat Intl, supaya hasilnya
 * sama di semua komputer tanpa bergantung pada setelan bahasa.
 */
export function formatDisplayDate(date: string): string {
  const parts = date.split('-')
  const monthName = MONTH_NAMES[Number(parts[1]) - 1]

  return `${Number(parts[2])} ${monthName} ${parts[0]}`
}

/** Tujuh tanggal terakhir, urut menaik, dengan hari ini di posisi terakhir. */
export function getLastSevenDates(): string[] {
  const dates: string[] = []

  for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
    dates.push(getDateDaysAgo(daysAgo))
  }

  return dates
}

/** Huruf pertama nama hari, dipakai di bawah bar tujuh hari. */
export function getDayInitial(date: string): string {
  const parts = date.split('-')
  const year = Number(parts[0])
  const month = Number(parts[1])
  const day = Number(parts[2])

  const initials = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return initials[new Date(year, month - 1, day).getDay()]
}
