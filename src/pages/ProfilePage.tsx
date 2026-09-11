import { useState, type FormEvent } from "react";
import type { Gender, Profile } from "../types/profile";
import { getDateYearsAgo, getTodayDate } from "../utils/date";
import Avatar from "../components/Avatar";

const PHOTO_CHOICES = [
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces",
];

const MAX_AGE_IN_YEARS = 120;

type ProfileForm = {
  name: string;
  birthDate: string;
  gender: Gender | "";
  photo: string;
};

type ProfileErrors = {
  name?: string;
  birthDate?: string;
  gender?: string;
};

type TouchedField = "name" | "birthDate";

function validateProfile(form: ProfileForm): ProfileErrors {
  const errors: ProfileErrors = {};
  const name = form.name.trim();

  if (name === "") {
    errors.name = "Enter your name.";
  } else if (name.length < 2) {
    errors.name = "Use at least 2 carackters so we know what to call you";
  } else if (name.length > 40) {
    errors.name = "Use 40 characters or fewer";
  }

  if (form.birthDate == "") {
    errors.birthDate = "Enter your birth date.";
  } else if (form.birthDate > getTodayDate()) {
    errors.birthDate = "Choose a date in the past";
  } else if (form.birthDate < getDateYearsAgo(MAX_AGE_IN_YEARS)) {
    errors.birthDate = "Enter a date within the last 120 years.";
  }

  if (form.gender === "") {
    errors.gender = "Choose a gender.";
  }

  return errors;
}

function chipClass(isSelected: boolean): string {
  const base =
    "flex h-12 items-center justify-center gap-2 rounded-full border-2 text-[15px] font-medium";

  if (isSelected) {
    return `${base} bg-ink border-ink text-white dark:bg-ink-dark dark:border-ink-dark dark:text-ink`;
  }

  return `${base} bg-surface border-line text-ink dark:bg-surface-dark dark:border-line-dark dark:text-ink-dark`;
}

type ProfilePageProps = {
  profile: Profile | null;
  onSave: (profile: Profile) => void;
};

function ProfilePage({ profile, onSave }: ProfilePageProps) {
  const [form, setForm] = useState<ProfileForm>({
    name: profile?.name ?? "",
    birthDate: profile?.birthDate ?? "",
    gender: profile?.gender ?? "",
    photo: profile?.photo ?? "",
  });

  const [errors, setErrors] = useState<ProfileErrors>({});

  function handleBlur(field: TouchedField) {
    const nextErrors = validateProfile(form);

    if (field === "name") {
      setErrors({ ...errors, name: nextErrors.name });
    } else {
      setErrors({ ...errors, birthDate: nextErrors.birthDate });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateProfile(form);
    setErrors(nextErrors);

    if (form.gender === "") {
      return;
    }

    if (nextErrors.name !== undefined || nextErrors.birthDate != undefined) {
      return;
    }

    onSave({
      name: form.name.trim(),
      birthDate: form.birthDate,
      gender: form.gender,
      photo: form.photo === "" ? undefined : form.photo,
    });
  }

  return (
    <>
      <h1 className="text-[28px] font-bold tracking-[-0.02em]">Profile</h1>
      <form onSubmit={handleSubmit} className="mt-6">
        <p className="text-ink-soft dark:text-ink-soft-dark text-[13px] font-medium">
          Profile photo
        </p>
        <div className="no-scrollbar mt-2 flex gap-3 overflow-x-auto pb-1">
          {PHOTO_CHOICES.map((photo, index) => (
            <button
              key={photo}
              type="button"
              onClick={() => setForm({ ...form, photo })}
              aria-label={`Use profile photo ${index + 1}`}
              className={`shrink-0 rounded-full ${form.photo === photo ? "ring-ink dark:ring-ink-dark ring-3 ring-offset-2" : ""} `}
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
          onBlur={() => handleBlur("name")}
          placeholder="Input your name please"
          className={`bg-surface dark:bg-surface-dark rounded-input mt-2 w-full p-4 text-[15px] outline-none ${
            errors.name === undefined
              ? "focus:border-ink dark:focus:border-ink-dark border-2 border-transparent"
              : "border-rose border-2"
          }`}
        />

        {errors.name !== undefined && (
          <p className="text-ink-soft dark:text-ink-soft-dark mt-5 block text-[13px] font-medium">
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
          type="text"
          value={form.birthDate}
          onChange={(event) =>
            setForm({ ...form, birthDate: event.target.value })
          }
          onBlur={() => handleBlur("birthDate")}
          className={`bg-surface dark:bg-surface-dark rounded-input mt-2 w-full p-4 text-[15px] outline-none ${
            errors.birthDate === undefined
              ? "focus:border-ink dark:focus:border-ink-dark border-2 border-transparent"
              : "border-rose border-2"
          }`}
        />

        {errors.birthDate !== undefined && (
          <p className="text-ink-soft dark:text-ink-soft-dark mt-5 block text-[13px] font-medium">
            {errors.birthDate}
          </p>
        )}

        <p className="text-ink-soft dark:text-ink-soft-dark mt-5 text-[13px] font-medium">
          Gender
        </p>

        <div className="mt-2 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setForm({ ...form, gender: "male" });
              setErrors({ ...errors, gender: undefined });
            }}
            className={chipClass(form.gender === "male")}
          >
            Male
          </button>

          <button
            type="button"
            onClick={() => {
              setForm({ ...form, gender: "female" });
              setErrors({ ...errors, gender: undefined });
            }}
            className={chipClass(form.gender === "female")}
          >
            Female
          </button>

          {errors.gender !== undefined && (
            <p className="text-rose mt-2 text-[12px]">{errors.gender}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-ink dark:bg-ink-dark dark:text-ink mt-6 h-14 w-full rounded-full text-[15px] font-semibold text-white"
        >
          Save Profile
        </button>

        <h2 className="mt-8 text-[17px] font-semibold tracking-[-0.01em]">
          Appearance
        </h2>

        {profile !== null && (
          <div className="bg-surface dark:bg-surface-dark dark:border-line-dark shadow-card rounded-card">
            <Avatar name={profile.name} photo={profile.photo} />
            <div className="min-w-0">
              <p className="truncate text-[17px] font-semibold">
                {profile.name}
              </p>
              <p className="text-ink-soft dark:text-ink-soft-dark text-[12px] font-medium">
                Born {profile.birthDate}
              </p>
            </div>
          </div>
        )}
      </form>
    </>
  );
}

export default ProfilePage;
