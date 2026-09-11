import { useState } from "react";
import type { Habit } from "../types/habit";
import { readHabits, writeHabits } from "../utils/storage";

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(readHabits());

  function saveHabits(nextHabits: Habit[]) {
    setHabits(nextHabits);
    writeHabits(nextHabits);
  }
  return { habits, saveHabits };
}
