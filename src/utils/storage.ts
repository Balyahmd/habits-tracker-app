import { parse } from "path";
import type { Habit } from "../types/habit";
import type { Profile } from "../types/profile";

const VERSION_KEY = "habits-tracker:version";
const PROFILE_KEY = "habits-tracker:profile";
const HABITS_KEY = "habits-tracker:habits";
const THEME_KEY = "habits-tracker:theme";

const CURRENT_VERSION = "1";

export function clearDataIfVersionChanged(): boolean {
  const storedVersion = localStorage.getItem(VERSION_KEY);

  if (storedVersion === CURRENT_VERSION) {
    return false;
  }

  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(HABITS_KEY);
  localStorage.removeItem(THEME_KEY);
  localStorage.removeItem(VERSION_KEY);

  return storedVersion !== null;
}

export function readHabits(): Habit[] {
  const raw = localStorage.getItem(HABITS_KEY);

  if (raw === null) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch (error) {
    return [];
  }
}

export function writeHabits(habits: Habit[]): void {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export function readProfile(): Profile | null {
  const raw = localStorage.getItem(PROFILE_KEY);

  if (raw === null) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);

    if (parsed === null || typeof parsed !== "object") {
      return null;
    }
    return parsed;
  } catch (error) {
    return null;
  }
}

export function writeProfile(profile: Profile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
