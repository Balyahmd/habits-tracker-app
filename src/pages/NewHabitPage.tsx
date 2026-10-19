import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { Check, TriangleAlert, X } from 'lucide-react'
import type { Habit } from '../types/habit'
import { getTodayDate } from '../utils/date'
import { MAX_DESCRIPTION_LENGTH, validateHabitForm } from '../utils/habitForm'
import { CATEGORIES, getCategoryLabel } from '../utils/habitCategory'
import type { HabitFormErrors, HabitFormValues } from '../utils/habitForm'
import ChoiceChip from '../components/ChoiceChip'

// Kategori dipilih lewat chip, jadi yang punya keadaan "ditinggalkan" cuma dua
// field ini
type TouchedField = 'name' | 'description'

type NewHabitPageProps = {
  habits: Habit[]
  onSave: (habits: Habit[], successMessage: string) => void
}

function NewHabitPage({ habits, onSave }: NewHabitPageProps) {
  const navigate = useNavigate()

  const [form, setForm] = useState<HabitFormValues>({
    name: '',
    description: '',
    category: ''
  })
  const [errors, setErrors] = useState<HabitFormErrors>({})

  // ref menunjuk ke elemen input yang sesungguhnya, bukan ke nilainya
  const nameInputRef = useRef<HTMLInputElement>(null)

  // Halaman ini dibuka karena pengguna menekan tombol tambah, jadi dia sudah
  // pasti mau mengetik. Memfokuskan input adalah menyentuh elemen di luar
  // React, dan itu memang tugas useEffect.
  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  function handleBlur(field: TouchedField) {
    const nextErrors = validateHabitForm(form, habits, null)

    if (field === 'name') {
      setErrors({ ...errors, name: nextErrors.name })
    } else {
      setErrors({ ...errors, description: nextErrors.description })
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateHabitForm(form, habits, null)
    setErrors(nextErrors)

    // Pemeriksaan ini sekaligus memberi tahu TypeScript bahwa category sudah
    // pasti terisi di bawah
    if (form.category === '') {
      return
    }

    if (
      nextErrors.name !== undefined ||
      nextErrors.description !== undefined
    ) {
      return
    }

    const description = form.description.trim()

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      description: description === '' ? undefined : description,
      category: form.category,
      createdAt: getTodayDate(),
      checkIns: []
    }

    // Pesannya muncul di halaman daftar, karena US-04 memang mengantar ke sana
    onSave([...habits, newHabit], `${newHabit.name} is now on your list.`)
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
          New Habit
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
          ref={nameInputRef}
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          onBlur={() => handleBlur('name')}
          placeholder="e.g. Morning Workout"
          aria-invalid={errors.name !== undefined}
          className={`bg-surface dark:bg-surface-dark shadow-card mt-2 h-14 w-full rounded-input px-4 text-[15px] font-medium outline-none ${
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
          className={`bg-surface dark:bg-surface-dark shadow-card mt-2 min-h-24 w-full resize-none rounded-input p-4 text-[15px] outline-none ${
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
    </form>
  )
}

export default NewHabitPage
