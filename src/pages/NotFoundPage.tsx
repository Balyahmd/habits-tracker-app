import { Link } from 'react-router'
import { TriangleAlert } from 'lucide-react'

function NotFoundPage() {
  return (
    <div className="bg-surface dark:bg-surface-dark dark:border-line-dark shadow-card rounded-card p-5 text-center dark:border">
      {/* Panduan desain bagian 12 cuma meminta ikon, satu kalimat, dan tombol
          kembali. Judulnya disembunyikan dari mata supaya tampilannya tetap
          sama, tapi halaman ini tetap punya judul untuk pembaca layar. */}
      <h1 className="sr-only">Page not found</h1>

      <TriangleAlert className="text-ink-soft dark:text-ink-soft-dark mx-auto h-10 w-10" />

      <p className="text-ink-soft dark:text-ink-soft-dark mt-4 text-[15px]">
        We could not find that page. It may have been removed, or the address
        may be misspelled.
      </p>

      <Link
        to="/"
        className="bg-ink dark:bg-ink-dark dark:text-ink mt-5 inline-flex h-14 w-full items-center justify-center rounded-full font-semibold text-white"
      >
        Back to Today
      </Link>
    </div>
  )
}

export default NotFoundPage
