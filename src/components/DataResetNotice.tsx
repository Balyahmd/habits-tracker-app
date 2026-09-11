import { TriangleAlert, X } from "lucide-react";

type DataResetNoticeProps = {
  onDismiss: () => void;
};

function DataResetNotice({ onDismiss }: DataResetNoticeProps) {
  return (
    <div className="bg-surface dark:bg-surface-dark dark:border-line-dark shadow-card rounded-card mb-6 flex items-start gap-3 p-5 dark:border">
      <span className="bg-amber-tint grid h-10 w-10 shrink-0 place-items-center rounded-full">
        <TriangleAlert className="text-amber h-5 w-5" />
      </span>

      <p className="text-ink-soft dark:text-ink-soft-dark flex-1 text-[15px]">
        Your saved data was cleared because the app data format changed. You can
        start again from an empty list.
      </p>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss the data reset notice"
        className="text-ink-soft dark:text-ink-soft-dark grid h-8 w-8 shrink-0 place-items-center rounded-full"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

export default DataResetNotice;
