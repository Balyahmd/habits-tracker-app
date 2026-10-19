import { useState } from 'react'
import { Outlet } from 'react-router'
import BottomNav from './BottomNav'
import Banner from './Banner'
import type { Flash } from '../types/flash'

const DATA_RESET_MESSAGE =
  'Your saved data was cleared because the app data format changed. You can start again from an empty list.'

type LayoutProps = {
  dataWasCleared: boolean
  flash: Flash | null
  onDismissFlash: () => void
}

function Layout({ dataWasCleared, flash, onDismissFlash }: LayoutProps) {
  // Pemberitahuan data dibuang muncul sekali di layar lalu bisa ditutup, sesuai
  // US-23. Dia tidak hilang sendiri seperti flash, karena isinya penting.
  const [isResetNoticeVisible, setIsResetNoticeVisible] =
    useState(dataWasCleared)

  return (
    <div className="min-h-dvh">
      {/* pb-28 menyediakan 112px ruang bawah supaya navigasi mengambang tidak
          menutupi isi halaman */}
      <div className="mx-auto w-full max-w-120 px-5 pt-6 pb-28 sm:px-6 lg:max-w-295 lg:pt-8 lg:pr-10 lg:pb-12 lg:pl-35">
        {isResetNoticeVisible && (
          <Banner
            tone="warning"
            message={DATA_RESET_MESSAGE}
            onDismiss={() => setIsResetNoticeVisible(false)}
          />
        )}

        {flash !== null && (
          <Banner
            tone={flash.tone}
            message={flash.message}
            onDismiss={onDismissFlash}
          />
        )}

        <Outlet />
      </div>

      <BottomNav />
    </div>
  )
}

export default Layout
