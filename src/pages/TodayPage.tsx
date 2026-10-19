import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  Bell,
  Check,
  CircleDashed,
  Gift,
  Inbox,
  ListChecks,
  User,
} from "lucide-react";
import type { Habit } from "../types/habit";
import type { Profile } from "../types/profile";
import { getTodayDate } from "../utils/date";
import Avatar from "../components/Avatar";
import ProgressRing from "../components/ProgressRing";
import TodayHabitCard from "../components/TodayHabitCard";
import { useIsDesktop } from "../hooks/useIsDekstop";

// Tinggi kartu tetap 119px karena nama habit dijaga satu baris, dan jarak
// antar kartu 12px. Keduanya digabung jadi jarak antar posisi.
const CARD_HEIGHT_IN_PX = 119;
const CARD_GAP_IN_PX = 12;
const ROW_HEIGHT_IN_PX = CARD_HEIGHT_IN_PX + CARD_GAP_IN_PX;

/**
 * Perjalanan kartu yang baru disentuh, tiga tahap:
 *
 * 1. `lift`   kartunya terbang ke atas sampai menutupi kartu ringkasan
 * 2. `settle` kartu lain menyusul naik ke posisi barunya
 * 3. `drop`   kartunya turun ke posisi barunya sambil mengecil, seperti
 *             dimasukkan ke dalam saku
 */
type FlightStage = "lift" | "settle" | "drop";

// Kartu ringkasan berpusat 179px di atas daftar, jadi segini cukup untuk
// menutupinya
const LIFT_OFFSET_IN_PX = -190;

const LIFT_DURATION_IN_MS = 500;
const SETTLE_DURATION_IN_MS = 500;
const DROP_DURATION_IN_MS = 650;

// Kartunya baru mulai turun sesudah 1000ms dan butuh 650ms lagi. Cincin
// progress menunggu sampai kartunya hampir mendarat, baru ikut bergerak,
// supaya keduanya tidak berebut perhatian.
const RING_START_DELAY_IN_MS = 1300;

// Sama panjangnya dengan keyframes shine di index.css
const SHINE_DURATION_IN_MS = 1200;

// Harus sama dengan STEP_DURATION_IN_MS di ProgressRing. Dipakai menghitung
// berapa lama cincinnya merangkak, supaya kilaunya menunggu sampai angkanya
// benar-benar sampai di layar dan tidak menyala mendahului.
const RING_STEP_DURATION_IN_MS = 20;

type TodayPageProps = {
  profile: Profile | null;
  habits: Habit[];
  onToggleCheckIn: (habitId: string) => void;
};

function TodayPage({ profile, habits, onToggleCheckIn }: TodayPageProps) {
  const today = getTodayDate();
  const isDesktop = useIsDesktop();

  // Seluruh angka di bawah dihitung saat render, tidak disimpan sebagai state.
  // Kalau disimpan, dia bisa jadi tidak cocok dengan habits yang sebenarnya.
  const doneCount = habits.filter((habit) =>
    habit.checkIns.includes(today),
  ).length;
  const remainingCount = habits.length - doneCount;
  const percent =
    habits.length === 0 ? 0 : Math.round((doneCount / habits.length) * 100);

  // Habit mana yang sedang terbang, dan sedang di tahap mana
  const [flyingId, setFlyingId] = useState<string | null>(null);
  const [stage, setStage] = useState<FlightStage>("lift");

  // Tiap tahap punya timernya sendiri. Cleanup-nya bukan hiasan: kalau
  // pengguna menyentuh kartu lain di tengah perjalanan, timer tahap yang lama
  // harus berhenti supaya tidak memajukan tahap perjalanan yang baru.
  useEffect(() => {
    if (flyingId === null) {
      return;
    }

    if (stage === "lift") {
      const timer = setTimeout(() => setStage("settle"), LIFT_DURATION_IN_MS);

      return () => clearTimeout(timer);
    }

    if (stage === "settle") {
      const timer = setTimeout(() => setStage("drop"), SETTLE_DURATION_IN_MS);

      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => setFlyingId(null), DROP_DURATION_IN_MS);

    return () => clearTimeout(timer);
  }, [flyingId, stage]);

  // Angka yang dipakai cincin progress. Dia tertinggal di belakang angka yang
  // sebenarnya selama kartunya masih terbang.
  const [ringPercent, setRingPercent] = useState(percent);

  useEffect(() => {
    if (ringPercent === percent) {
      return;
    }

    // Tanpa kartu yang terbang, misalnya saat membatalkan centang, cincinnya
    // langsung menyesuaikan tanpa menunggu
    const delay = flyingId === null ? 0 : RING_START_DELAY_IN_MS;
    const timer = setTimeout(() => setRingPercent(percent), delay);

    return () => clearTimeout(timer);
  }, [percent, ringPercent, flyingId]);

  // Kilau hanya muncul saat angkanya baru saja sampai 100, bukan setiap kali
  // halaman dibuka dalam keadaan sudah 100
  const [isShining, setIsShining] = useState(false);
  const previousRingPercent = useRef(ringPercent);

  useEffect(() => {
    const previous = previousRingPercent.current;
    previousRingPercent.current = ringPercent;

    if (ringPercent !== 100 || previous === 100) {
      return;
    }

    // Cincinnya merangkak dari angka sebelumnya, satu persen tiap langkah
    const crawlDuration = (100 - previous) * RING_STEP_DURATION_IN_MS;
    const timer = setTimeout(() => setIsShining(true), crawlDuration);

    return () => clearTimeout(timer);
  }, [ringPercent]);

  // Kilaunya melepas dirinya sendiri sesudah sapuannya lewat
  useEffect(() => {
    if (!isShining) {
      return;
    }

    const timer = setTimeout(() => setIsShining(false), SHINE_DURATION_IN_MS);

    return () => clearTimeout(timer);
  }, [isShining]);

  function handleToggle(habitId: string) {
    const habit = habits.find((item) => item.id === habitId);
    const isCheckingIn = habit !== undefined && !habit.checkIns.includes(today);

    // Cuma menandai selesai yang dirayakan. Membatalkan centang biasanya
    // koreksi salah ketuk, dan merayakannya justru terasa mengejek.
    if (isCheckingIn && !isDesktop) {
      setFlyingId(habitId);
      setStage("lift");
    }

    onToggleCheckIn(habitId);
  }

  // Yang belum dicentang ditaruh di atas, supaya sisa pekerjaan hari ini
  // terlihat lebih dulu. Disalin dulu, karena sort mengubah array aslinya.
  //
  // sort di JavaScript menjaga urutan elemen yang nilainya sama, jadi urutan
  // di dalam tiap kelompok tetap seperti urutan aslinya.
  const sortedHabits = [...habits].sort((a, b) => {
    const aDone = a.checkIns.includes(today) ? 1 : 0;
    const bDone = b.checkIns.includes(today) ? 1 : 0;

    return aDone - bDone;
  });

  return (
    <>
      <header className="flex items-center gap-3">
        {/* Profil yang belum diisi tetap punya avatar dan dua baris teks, jadi
            headernya tidak tampil separuh kosong */}
        <Avatar name={profile?.name ?? ""} photo={profile?.photo} />

        <div className="min-w-0 flex-1">
          <p className="text-ink-soft dark:text-ink-soft-dark text-[13px] font-medium">
            {profile === null ? "Welcome" : "Welcome back"}
          </p>
          <p className="truncate text-[17px] font-bold">
            {profile === null ? "No name yet" : profile.name}
          </p>
        </div>

        {/* Dua tombol ini belum melakukan apa-apa. Bentuknya mengikuti
            panduan desain bagian 7.1, satu tombol ink dan satu putih. */}
        <button
          type="button"
          aria-label="Open your notifications"
          className="bg-surface dark:bg-surface-dark shadow-card grid h-12 w-12 shrink-0 place-items-center rounded-full"
        >
          <Bell className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Open your rewards"
          className="bg-ink dark:bg-ink-dark dark:text-ink grid h-12 w-12 shrink-0 place-items-center rounded-full text-white"
        >
          <Gift className="h-5 w-5" />
        </button>
      </header>

      <h1 className="mt-7 text-[36px] leading-[1.05] font-extrabold tracking-[-0.03em] sm:text-[44px] lg:mt-8 lg:text-[64px]">
        Let&apos;s Make
        <br />
        Today Count
      </h1>

      <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-x-6">
        {profile === null && (
          <div className="bg-surface dark:bg-surface-dark dark:border-line-dark shadow-card rounded-card mt-6 p-5 text-center lg:col-span-2 lg:p-8 dark:border">
            <User className="text-ink-soft dark:text-ink-soft-dark mx-auto h-10 w-10" />
            <p className="text-ink-soft dark:text-ink-soft-dark mt-4 text-[15px]">
              Tell us your name and we will greet you here every day.
            </p>
            <Link
              to="/profile"
              className="bg-ink dark:bg-ink-dark dark:text-ink mt-5 inline-flex h-14 w-full items-center justify-center rounded-full text-[15px] font-semibold text-white"
            >
              Set Up Your Profile
            </Link>
          </div>
        )}

        {habits.length === 0 ? (
          <div className="bg-surface dark:bg-surface-dark dark:border-line-dark shadow-card rounded-card mt-6 p-8 text-center lg:col-span-2 lg:p-10 dark:border">
            <Inbox className="text-ink-soft dark:text-ink-soft-dark mx-auto h-10 w-10" />
            <p className="text-ink-soft dark:text-ink-soft-dark mt-3 text-[15px] font-medium">
              Nothing to tick off yet. Add your first habit and it will show up
              here every day.
            </p>
            <Link
              to="/habits/new"
              className="bg-ink dark:bg-ink-dark dark:text-ink mt-4 inline-flex h-12 items-center rounded-full px-6 text-[14px] font-semibold text-white"
            >
              Add Your First Habit
            </Link>
          </div>
        ) : (
          <>
            {/* Satu kartu gelap per halaman, panduan desain bagian 7.3 */}
            <section className="bg-ink shadow-nav rounded-card relative mt-6 overflow-hidden p-5 text-white lg:p-7">
              {/* Sapuan cahaya yang melintas sekali saat seluruh habit hari ini
                selesai. Dipasang dan dilepas lewat state, jadi dia benar-benar
                mengulang tiap kali 100 persen tercapai lagi. */}
              {isShining && (
                <span
                  aria-hidden="true"
                  className="animate-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-white/25 to-transparent"
                />
              )}

              <p className="text-[15px] font-semibold">Today&apos;s Progress</p>

              <div className="mt-4 flex items-center gap-5">
                <ProgressRing percent={ringPercent} />

                <div className="flex-1 space-y-3 border-l border-white/10 pl-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10">
                      <ListChecks className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[17px] leading-none font-bold">
                        {habits.length}
                      </p>
                      <p className="mt-1 text-[12px] font-medium text-white/60">
                        Total habits
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="bg-lime/20 text-lime grid h-9 w-9 shrink-0 place-items-center rounded-xl">
                      <Check className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[17px] leading-none font-bold">
                        {doneCount}
                      </p>
                      <p className="mt-1 text-[12px] font-medium text-white/60">
                        Completed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10">
                      <CircleDashed className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[17px] leading-none font-bold">
                        {remainingCount}
                      </p>
                      <p className="mt-1 text-[12px] font-medium text-white/60">
                        Left to do
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="lg:mt-6">
              <div className="mt-7 flex items-baseline justify-between lg:mt-0">
                <h2 className="text-[17px] font-semibold tracking-[-0.01em]">
                  Today&apos;s Habits
                </h2>
                <Link
                  to="/habits"
                  className="text-ink-soft dark:text-ink-soft-dark text-[13px] font-semibold"
                >
                  View All
                </Link>
              </div>

              {/* Kartunya ditumpuk absolut dan digeser dengan translateY sesuai
              urutannya. Begitu urutannya berubah, nilai translateY-nya berubah,
              dan transisi Tailwind yang menggerakkannya. Tidak ada posisi yang
              perlu diukur, karena tinggi tiap kartu sudah pasti sama. */}
              <div
                className="relative mt-4"
                style={{
                  height: `${sortedHabits.length * ROW_HEIGHT_IN_PX - CARD_GAP_IN_PX}px`,
                }}
              >
                {/* Yang dipetakan habits, bukan sortedHabits, jadi urutan di DOM
                tidak pernah berubah. Ini penting: React memindahkan node saat
                urutan keyed children berubah, dan node yang dipindah kehilangan
                transisinya, sehingga kartunya melompat alih-alih bergerak.
                Urutan tampilnya diatur translateY, bukan urutan DOM. */}
                {habits.map((habit) => {
                  const index = sortedHabits.findIndex(
                    (item) => item.id === habit.id,
                  );

                  const isFlying = habit.id === flyingId;

                  // Tahap satu dan dua kartunya menggantung di atas. Tahap tiga dia
                  // turun ke posisi barunya sambil mengecil.
                  const isHanging =
                    isFlying && (stage === "lift" || stage === "settle");

                  let scale = 1;
                  if (isHanging) {
                    scale = 1.06;
                  } else if (isFlying) {
                    scale = 0.9;
                  }

                  let duration = 200;
                  if (isHanging) {
                    duration = LIFT_DURATION_IN_MS;
                  } else if (isFlying) {
                    duration = DROP_DURATION_IN_MS;
                  } else if (flyingId !== null) {
                    duration = SETTLE_DURATION_IN_MS;
                  }

                  // Saat menggantung kartunya paling depan supaya menutupi kartu
                  // ringkasan. Saat turun mengecil dia justru paling belakang,
                  // jadi dia lewat di balik kartu lain, bukan menimpanya.
                  let layer = "z-0";
                  if (isFlying) {
                    layer = isHanging ? "z-20" : "z-0";
                  } else if (flyingId !== null) {
                    layer = "z-10";
                  }

                  return (
                    <div
                      key={habit.id}
                      className={`rounded-card absolute inset-x-0 top-0 transition-[transform,box-shadow] ease-in-out ${layer} ${
                        isHanging ? "shadow-nav" : ""
                      }`}
                      style={{
                        transform: `translateY(${
                          isHanging
                            ? LIFT_OFFSET_IN_PX
                            : index * ROW_HEIGHT_IN_PX
                        }px) scale(${scale})`,
                        transitionDuration: `${duration}ms`,
                        // Kartu lain menunggu tahap satu selesai, baru ikut naik.
                        // Itu yang membuat ketiga tahapnya terbaca terpisah.
                        transitionDelay:
                          flyingId === null || isFlying
                            ? "0ms"
                            : `${LIFT_DURATION_IN_MS}ms`,
                      }}
                    >
                      <TodayHabitCard
                        habit={habit}
                        isDone={habit.checkIns.includes(today)}
                        onToggle={() => handleToggle(habit.id)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default TodayPage;