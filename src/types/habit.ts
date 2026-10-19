export type HabitCategory = "health" | "learning" | "work" | "other";

export type Habit = {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  createdAt: string;

  // Tanggal check in dalam bentuk YYYY-MM-DD, selalu urut menaik dan tidak
  // pernah punya tanggal ganda
  checkIns: string[];
};
