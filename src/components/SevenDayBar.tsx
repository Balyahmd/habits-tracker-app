import { getDayInitial, getLastSevenDates } from '../utils/date'

type SevenDayBarProps = {
  checkIns: string[]
}

function SevenDayBar({ checkIns }: SevenDayBarProps) {
  // Urut menaik, jadi hari ini selalu jatuh di kotak paling kanan
  const dates = getLastSevenDates()

  return (
    <div className="flex gap-1.5">
      {dates.map((date) => (
        <div key={date} className="flex-1">
          <div
            className={`h-9 rounded-day ${
              checkIns.includes(date)
                ? 'bg-lime'
                : 'bg-line dark:bg-line-dark'
            }`}
          />
          <p className="text-ink-soft dark:text-ink-soft-dark mt-1 text-center text-[11px] font-medium">
            {getDayInitial(date)}
          </p>
        </div>
      ))}
    </div>
  )
}

export default SevenDayBar
