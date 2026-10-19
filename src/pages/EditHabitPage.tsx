import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Check, TriangleAlert, X } from 'lucide-react'
import type { Habit } from '../types/habit'
import { MAX_DESCRIPTION_LENGTH, validateHabitForm } from '../utils/habitForm'
import { CATEGORIES, getCategoryLabel } from '../utils/habitCategory'
import type { HabitFormErrors, HabitFormValues } from '../utils/habitForm'
import ChoiceChip from '../components/ChoiceChip'

type TouchedField = 'name' | 'description'

/** Kalimat yang menyebut berapa check in ikut hilang, sesuai US-09. */
function getDeleteWarning(habit: Habit): string {
  if (habit.checkIns.length === 0) {
    return `${habit.name} has no check ins yet. Deleting it cannot be undone.`
  }

  if (habit.checkIns.length === 1) {
    return `Deleting ${habit.name} also removes its 1 check in. This cannot be undone.`
  }

  return `Deleting ${habit.name} also removes its ${habit.checkIns.length} check ins. This cannot be undone.`
}

type EditHabitPageProps = {
  habits: Habit[]
  onSave: (habits: Habit[], successMessage: string) => void
}

/**
 * Pembungkus tipis yang cuma menentukan key.
 *
 * Halaman ini tetap terpasang saat id di alamat berubah, misalnya lewat tombol
 * maju mundur browser. Tanpa key, form di dalamnya masih memegang habit yang
 * lama, dan menyimpan akan menimpa habit baru dengan isi habit lama.
 *
 * key yang berbeda berarti komponen yang berbeda bagi React, jadi state-nya
 * dimulai ulang dari habit yang benar.
 */
function EditHabitPage({ habits, onSave }: EditHabitPageProps) {
  const params = useParams()

  return (
    <EditHabitForm
      key={params.id}
      habitId={params.id ?? ''}
      habits={habits}
      onSave={onSave}
    />
  )
}

type EditHabitFormProps = {
  habitId: string
  habits: Habit[]
  onSave: (habits: Habit[], successMessage: string) => void
}

function EditHabitForm({ habitId, habits, onSave }: EditHabitFormProps) {
  const navigate = useNavigate()

  const habit = habits.find((item) => item.id === habitId)

  // Seluruh hook dipanggil lebih dulu, tanpa syarat, baru sesudahnya boleh ada
  // early return. Aturan hooks melarang urutan pemanggilan berubah antar render.
  const [form, setForm] = useState<HabitFormValues>({
    name: habit?.name ?? '',
    description: habit?.description ?? '',
    category: habit?.category ?? ''
  })
  const [errors, setErrors] = useState<HabitFormErrors>({})
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  if (habit === undefined) {
    return (
      <div className="bg-surface dark:bg-surface-dark dark:border-line-dark shadow-card rounded-card p-5 text-center dark:border">
        {/* Disembunyikan dari mata supaya kartunya tetap seperti yang
            disetujui, tapi halamannya tetap punya judul untuk pembaca layar */}
        <h1 className="sr-only">Habit not found</h1>

        <TriangleAlert className="text-ink-soft dark:text-ink-soft-dark mx-auto h-10 w-10" />
        <p className="text-ink-soft dark:text-ink-soft-dark mt-4 text-[15px]">
          We could not find that habit. It may have been deleted already.
        </p>
        <Link
          to="/habits"
          className="bg-ink dark:bg-ink-dark dark:text-ink mt-5 inline-flex h-14 w-full items-center justify-center rounded-full text-[15px] font-semibold text-white"
        >
          Back to Habits
        </Link>
      </div>
    )
  }

  function handleBlur(field: TouchedField) {
    const nextErrors = validateHabitForm(form, habits, habitId)

    if (field === 'name') {
      setErrors({ ...errors, name: nextErrors.name })
    } else {
      setErrors({ ...errors, description: nextErrors.description })
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateHabitForm(form, habits, habitId)
    setErrors(nextErrors)

    if (form.category === '') {
      return
    }

    if (nextErrors.name !== undefined || nextErrors.description !== undefined) {
      return
    }

    const description = form.description.trim()

    // Disimpan ke variabel dulu. Penyempitan tipe di atas tidak ikut masuk ke
    // dalam callback map, karena TypeScript tidak tahu kapan callback-nya jalan.
    const category = form.category

    const nextHabits = habits.map((item) => {
      if (item.id !== habitId) {
        return item
      }

      // id, createdAt, dan checkIns disalin apa adanya. US-08 menuntut riwayat
      // check in tetap utuh sesudah habit diubah.
      return {
        ...item,
        name: form.name.trim(),
        description: description === '' ? undefined : description,
        category
      }
    })

    onSave(nextHabits, `${form.name.trim()} is updated.`)
    navigate('/habits')
  }

  function handleDelete() {
    const nextHabits = habits.filter((item) => item.id !== habitId)

    onSave(nextHabits, `${form.name.trim()} is deleted.`)
    navigate('/habits')
  }

  return (
    <form onSubmit={handleSubmit}>
      <header className="flex items-center gap-3">
        <Link
          to="/habits"
          aria-label="Close without saving"
          className="bg-surface dark:bg-surface-dark shadow-card grid h-12 w-12 shrink-0 place-items-center rounded-full"
        >
          <X className="h-5 w-5" />
        </Link>

        <h1 className="flex-1 text-center text-[17px] font-semibold">
          Edit Habit
        </h1>

        <button
          type="submit"
          aria-label="Save habit"
          className="bg-ink dark:bg-ink-dark dark:text-ink grid h-12 w-12 shrink-0 place-items-center rounded-full text-white"
        >
          <Check className="h-5 w-5" />
        </button>
      </header>

      <div className="mt-8">
        <label
          htmlFor="name"
          className="text-ink-soft dark:text-ink-soft-dark text-[13px] font-medium"
        >
          Habit name
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          onBlur={() => handleBlur('name')}
          placeholder="e.g. Morning Workout"
          aria-invalid={errors.name !== undefined}
          className={`bg-surface dark:bg-surface-dark shadow-card rounded-input mt-2 h-14 w-full px-4 text-[15px] font-medium outline-none ${
            errors.name === undefined
              ? 'focus:ring-ink dark:focus:ring-ink-dark focus:ring-2'
              : 'ring-rose ring-2'
          }`}
        />
        {errors.name === undefined ? (
          <p className="text-ink-soft dark:text-ink-soft-dark mt-1.5 text-[12px] font-medium">
            Keep it short so it fits on your Today screen.
          </p>
        ) : (
          <p className="text-rose mt-1.5 flex items-center gap-1.5 text-[12px] font-medium">
            <TriangleAlert className="h-4 w-4 shrink-0" />
            {errors.name}
          </p>
        )}
      </div>

      <div className="mt-6">
        <label
          htmlFor="description"
          className="text-ink-soft dark:text-ink-soft-dark text-[13px] font-medium"
        >
          Description <span className="font-normal">(optional)</span>
        </label>
        <textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(event) =>
            setForm({ ...form, description: event.target.value })
          }
          onBlur={() => handleBlur('description')}
          placeholder="What does doing this actually look like?"
          aria-invalid={errors.description !== undefined}
          className={`bg-surface dark:bg-surface-dark shadow-card rounded-input mt-2 min-h-24 w-full resize-none p-4 text-[15px] outline-none ${
            errors.description === undefined
              ? 'focus:ring-ink dark:focus:ring-ink-dark focus:ring-2'
              : 'ring-rose ring-2'
          }`}
        />
        {errors.description === undefined ? (
          <p className="text-ink-soft dark:text-ink-soft-dark mt-1.5 text-right text-[12px] font-medium">
            {form.description.length} / {MAX_DESCRIPTION_LENGTH}
          </p>
        ) : (
          <p className="text-rose mt-1.5 flex items-center gap-1.5 text-[12px] font-medium">
            <TriangleAlert className="h-4 w-4 shrink-0" />
            {errors.description}
          </p>
        )}
      </div>

      <fieldset className="mt-6">
        <legend className="text-ink-soft dark:text-ink-soft-dark text-[13px] font-medium">
          Category
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATEGORIES.map((category) => (
            <ChoiceChip
              key={category}
              name="category"
              value={category}
              isSelected={form.category === category}
              onSelect={() => {
                setForm({ ...form, category })
                setErrors({ ...errors, category: undefined })
              }}
            >
              {getCategoryLabel(category)}
            </ChoiceChip>
          ))}
        </div>
        {errors.category !== undefined && (
          <p className="text-rose mt-1.5 flex items-center gap-1.5 text-[12px] font-medium">
            <TriangleAlert className="h-4 w-4 shrink-0" />
            {errors.category}
          </p>
        )}
      </fieldset>

      <button
        type="submit"
        className="bg-ink dark:bg-ink-dark dark:text-ink mt-8 h-14 w-full rounded-full text-[15px] font-semibold text-white"
      >
        Save Habit
      </button>

      {/* Konfirmasi di dalam halaman, bukan window.confirm. PRD bagian 9
          memilih ini supaya tampilannya bisa diatur dan supaya keadaan
          konfirmasinya jadi state yang terlihat. */}
      {isConfirmingDelete ? (
        <div className="bg-rose-tint rounded-card mt-3 p-5">
          <p className="text-rose text-[15px] font-medium">
            {getDeleteWarning(habit)}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(false)}
              className="bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark h-14 rounded-full text-[15px] font-semibold"
            >
              Keep It
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-rose h-14 rounded-full text-[15px] font-semibold text-white"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsConfirmingDelete(true)}
          className="bg-rose-tint text-rose mt-3 h-14 w-full rounded-full text-[15px] font-semibold"
        >
          Delete Habit
        </button>
      )}
    </form>
  )
}

export default EditHabitPage
