import type { ReactNode } from "react";

type ChoiceChipProps = {
  name: string;
  value: string;
  isSelected: boolean;
  onSelect: () => void;
  children: ReactNode;
};

/**
 * Chip untuk memilih satu dari beberapa nilai, sesuai panduan desain bagian
 * 7.6. Sengaja tanpa warna aksen, karena aksen di aplikasi ini sudah punya
 * arti lain dan artinya akan bertabrakan.
 *
 * Di dalamnya radio sungguhan yang disembunyikan secara visual, bukan tombol
 * biasa. Panduan desain cuma mengatur rupanya, dan radio memberi hal yang
 * tidak bisa ditiru tombol: berpindah pilihan dengan tombol panah, dan
 * pembaca layar yang menyebut "pilihan 1 dari 4".
 */
function ChoiceChip({
  name,
  value,
  isSelected,
  onSelect,
  children,
}: ChoiceChipProps) {
  return (
    <label
      className={`flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border-2 text-[14px] font-semibold has-focus-visible:ring-2 has-focus-visible:ring-offset-2 ${
        isSelected
          ? "bg-ink border-ink dark:bg-ink-dark dark:border-ink-dark dark:text-ink ring-ink dark:ring-ink-dark text-white"
          : "bg-surface border-line text-ink dark:bg-surface-dark dark:border-line-dark dark:text-ink-dark ring-ink dark:ring-ink-dark"
      }`}
    >
      {/* sr-only menyembunyikan radionya dari mata, tapi dia tetap bisa
          difokus dan tetap terbaca pembaca layar */}
      <input
        type="radio"
        name={name}
        value={value}
        checked={isSelected}
        onChange={onSelect}
        className="sr-only"
      />
      {children}
    </label>
  );
}

export default ChoiceChip;
