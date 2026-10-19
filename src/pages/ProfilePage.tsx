import { useState } from 'react'
import type { FormEvent } from 'react'
import { Moon, Sun, TriangleAlert } from 'lucide-react'
import type { Gender, Profile } from '../types/profile'
import { useTheme } from '../hooks/useTheme'
import { formatDisplayDate, getDateYearsAgo, getTodayDate } from '../utils/date'
import Avatar from '../components/Avatar'
import ChoiceChip from '../components/ChoiceChip'

// Enam foto tetap, sesuai panduan desain bagian 9. Tanpa unggah berkas dan
// tanpa menempel URL sendiri.
const PHOTO_CHOICES = [
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces'
]

const MAX_AGE_IN_YEARS = 120

type ProfileForm = {
  name: string
  birthDate: string
  gender: Gender | ''
  photo: string
}

type ProfileErrors = {
  name?: string
  birthDate?: string
  gender?: string
}

type TouchedField = 'name' | 'birthDate'

function validateProfile(form: ProfileForm): ProfileErrors {
  const errors: ProfileErrors = {}
  const name = form.name.trim()

  if (name === '') {
    errors.name = 'Enter your name.'
  } else if (name.length < 2) {
    errors.name = 'Use at least 2 characters so we know what to call you.'
  } else if (name.length > 40) {
    errors.name = 'Use 40 characters or fewer.'
  }

  if (form.birthDate === '') {
    errors.birthDate = 'Enter your birth date.'
  } else if (form.birthDate > getTodayDate()) {
    // Perbandingan string cukup, karena YYYY-MM-DD sudah urut secara alfabet
    errors.birthDate = 'Choose a date in the past.'
  } else if (form.birthDate < getDateYearsAgo(MAX_AGE_IN_YEARS)) {
    errors.birthDate = 'Enter a date within the last 120 years.'
  }

  if (form.gender === '') {
    errors.gender = 'Choose a gender.'
  }

  return errors
}

type ProfilePageProps = {
  profile: Profile | null
  onSave: (profile: Profile) => void
}

function ProfilePage({ profile, onSave }: ProfilePageProps) {
  const { theme, setTheme } = useTheme()

  const [form, setForm] = useState<ProfileForm>({
    name: profile?.name ?? '',
    birthDate: profile?.birthDate ?? '',
    gender: profile?.gender ?? '',
    photo: profile?.photo ?? ''
  })
  const [errors, setErrors] = useState<ProfileErrors>({})

  function handleBlur(field: TouchedField) {
    const nextErrors = validateProfile(form)

    if (field === 'name') {
      setErrors({ ...errors, name: nextErrors.name })
    } else {
      setErrors({ ...errors, birthDate: nextErrors.birthDate })
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateProfile(form)
    setErrors(nextErrors)

    // Pemeriksaan ini sekaligus memberi tahu TypeScript bahwa gender sudah
    // pasti terisi di baris berikutnya
    if (form.gender === '') {
      return
    }

    if (nextErrors.name !== undefined || nextErrors.birthDate !== undefined) {
      return
    }

    onSave({
      name: form.name.trim(),
      birthDate: form.birthDate,
      gender: form.gender,
      photo: form.photo === '' ? undefined : form.photo
    })
  }

  return (
    <>
      <h1 className="text-[28px] font-bold tracking-[-0.02em]">Profile</h1>

      <form onSubmit={handleSubmit} className="mt-6">
        <p className="text-ink-soft dark:text-ink-soft-dark text-[13px] font-medium">
          Profile photo
        </p>
        {/* p-2 memberi ruang untuk cincin penanda pilihan, dan -mx-2 menarik
            wadahnya balik supaya deretan foto tetap sejajar dengan konten lain */}
        <div className="no-scrollbar -mx-2 mt-1 flex gap-3 overflow-x-auto p-2">
          {PHOTO_CHOICES.map((photo, index) => (
            <button
              key={photo}
              type="button"
              onClick={() => setForm({ ...form, photo })}
              aria-label={`Use profile photo ${index + 1}`}
              className={`shrink-0 rounded-full ${
                form.photo === photo
                  ? 'ring-ink dark:ring-ink-dark ring-3 ring-offset-2'
                  : ''
              }`}
            >
              <img
                src={photo}
                alt=""
                className="h-14 w-14 rounded-full object-cover"
              />
            </button>
          ))}
        </div>

        <label
          htmlFor="name"
          className="text-ink-soft dark:text-ink-soft-dark mt-6 block text-[13px] font-medium"
        >
          Your name
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          onBlur={() => handleBlur('name')}
          placeholder="Your Name"
          aria-invalid={errors.name !== undefined}
          className={`bg-surface dark:bg-surface-dark shadow-card mt-2 h-14 w-full rounded-input px-4 text-[15px] font-medium outline-none ${
            errors.name === undefined
              ? 'focus:ring-ink dark:focus:ring-ink-dark focus:ring-2'
              : 'ring-rose ring-2'
          }`}
        />
        {errors.name !== undefined && (
          <p className="text-rose mt-1.5 flex items-center gap-1.5 text-[12px] font-medium">
            <TriangleAlert className="h-4 w-4 shrink-0" />
            {errors.name}
          </p>
        )}

        <label
          htmlFor="birthDate"
          className="text-ink-soft dark:text-ink-soft-dark mt-5 block text-[13px] font-medium"
        >
          Birth date
        </label>
        <input
          id="birthDate"
          type="date"
          value={form.birthDate}
          onChange={(event) =>
            setForm({ ...form, birthDate: event.target.value })
          }
          onBlur={() => handleBlur('birthDate')}
          aria-invalid={errors.birthDate !== undefined}
          className={`bg-surface dark:bg-surface-dark shadow-card mt-2 h-14 w-full rounded-input px-4 text-[15px] font-medium outline-none ${
            errors.birthDate === undefined
              ? 'focus:ring-ink dark:focus:ring-ink-dark focus:ring-2'
              : 'ring-rose ring-2'
          }`}
        />
        {errors.birthDate !== undefined && (
          <p className="text-rose mt-1.5 flex items-center gap-1.5 text-[12px] font-medium">
            <TriangleAlert className="h-4 w-4 shrink-0" />
            {errors.birthDate}
          </p>
        )}

        {/* fieldset dan legend membuat pembaca layar mengumumkan kedua pilihan
            sebagai satu kelompok bernama Gender */}
        <fieldset className="mt-5">
          <legend className="text-ink-soft dark:text-ink-soft-dark text-[13px] font-medium">
            Gender
          </legend>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <ChoiceChip
              name="gender"
              value="male"
              isSelected={form.gender === 'male'}
              onSelect={() => {
                setForm({ ...form, gender: 'male' })
                setErrors({ ...errors, gender: undefined })
              }}
            >
              Male
            </ChoiceChip>
            <ChoiceChip
              name="gender"
              value="female"
              isSelected={form.gender === 'female'}
              onSelect={() => {
                setForm({ ...form, gender: 'female' })
                setErrors({ ...errors, gender: undefined })
              }}
            >
              Female
            </ChoiceChip>
          </div>
        </fieldset>
        {errors.gender !== undefined && (
          <p className="text-rose mt-1.5 flex items-center gap-1.5 text-[12px] font-medium">
            <TriangleAlert className="h-4 w-4 shrink-0" />
            {errors.gender}
          </p>
        )}

        <button
          type="submit"
          className="bg-ink dark:bg-ink-dark dark:text-ink mt-6 h-14 w-full rounded-full text-[15px] font-semibold text-white"
        >
          Save Profile
        </button>
      </form>

      <fieldset className="mt-8">
        <legend className="text-[17px] font-semibold tracking-[-0.01em]">
          Appearance
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <ChoiceChip
            name="theme"
            value="light"
            isSelected={theme === 'light'}
            onSelect={() => setTheme('light')}
          >
            <Sun className="h-5 w-5" />
            Light
          </ChoiceChip>
          <ChoiceChip
            name="theme"
            value="dark"
            isSelected={theme === 'dark'}
            onSelect={() => setTheme('dark')}
          >
            <Moon className="h-5 w-5" />
            Dark
          </ChoiceChip>
        </div>
      </fieldset>

      {profile !== null && (
        <div className="bg-surface dark:bg-surface-dark dark:border-line-dark shadow-card rounded-card mt-8 flex items-center gap-3 p-5 dark:border">
          <Avatar name={profile.name} photo={profile.photo} />
          <div className="min-w-0">
            <p className="truncate text-[17px] font-semibold">{profile.name}</p>
            <p className="text-ink-soft dark:text-ink-soft-dark text-[12px] font-medium">
              Born {formatDisplayDate(profile.birthDate)}
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfilePage
