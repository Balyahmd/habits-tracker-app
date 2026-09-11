import { useHabits } from "../hooks/useHabits";

function TodayPage() {
  const { habits } = useHabits()
  return (
    <>
      <h1 className="text-[36px] leading-[1.05] font-extrabold trackig-[-0.03em] sm:text[44px]">
        Let&apos; s Make <br /> Today Count
      </h1>
      <p className="text-ink-soft dark:text-ink-soft-dark mt-4 text-[15px]">
        Your habits for today will show up here
      </p>

      <p>Stored on this device: {habits.length}</p>
    </>
  );
}

export default TodayPage;
