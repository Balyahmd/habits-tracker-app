import { Check, TriangleAlert, X } from 'lucide-react'
import type { FlashTone } from '../types/flash'

type BannerProps = {
  tone: FlashTone
  message: string
  onDismiss: () => void
}

function Banner({ tone, message, onDismiss }: BannerProps) {
  const isSuccess = tone === 'success'
  const isError = tone === 'error'

  let circleClass = 'bg-amber-tint'
  if (isSuccess) {
    circleClass = 'bg-lime-tint'
  } else if (isError) {
    circleClass = 'bg-rose-tint'
  }

  let iconClass = 'text-amber'
  if (isSuccess) {
    iconClass = 'text-lime-ink'
  } else if (isError) {
    iconClass = 'text-rose'
  }

  return (
    // role status supaya pembaca layar mengumumkan pesannya tanpa memindahkan
    // fokus pengguna
    <div
      role="status"
      className="bg-surface dark:bg-surface-dark dark:border-line-dark shadow-card rounded-card mb-6 flex items-center gap-3 p-5 dark:border"
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${circleClass}`}
      >
        {isSuccess ? (
          <Check className={`h-5 w-5 ${iconClass}`} />
        ) : (
          <TriangleAlert className={`h-5 w-5 ${iconClass}`} />
        )}
      </span>

      <p className="text-ink-soft dark:text-ink-soft-dark flex-1 text-[15px]">
        {message}
      </p>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss this message"
        className="text-ink-soft dark:text-ink-soft-dark focus-visible:ring-ink dark:focus-visible:ring-ink-dark grid h-8 w-8 shrink-0 place-items-center rounded-full outline-none focus-visible:ring-2"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

export default Banner
