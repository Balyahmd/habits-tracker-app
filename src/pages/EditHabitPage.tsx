import { useParams } from "react-router";

function EditHabitPage() {
  const params = useParams();

  return (
    <>
      <h1 className="text-[28px] font-bold tracking-[-0.02em]">Edit Habit</h1>
      <p className="text-ink-soft dark:text-ink-soft-dark mt-4 text-[15px]">
        The form for editing habit {params.id} will live here
      </p>
    </>
  );
}

export default EditHabitPage;
