import { useParams } from "react-router";

function HabitDetailPage() {
  const params = useParams();

  return (
    <>
      <h1 className="text-[28px] font-bold tracking-[-0.02em]">Habit Detail</h1>
      <p className="text-ink-soft dark:text-ink-soft-dark mt-4 text-[15px]">
        History and staraks for habit {params.id} will show up here.
      </p>
    </>
  );
}

export default HabitDetailPage;
