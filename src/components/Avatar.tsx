import { User } from 'lucide-react'

type AvatarProps = {
  name: string
  photo?: string
}

function Avatar({ name, photo }: AvatarProps) {
  if (photo !== undefined && photo !== '') {
    return (
      <img
        src={photo}
        alt="Your profile photo"
        className="h-12 w-12 shrink-0 rounded-full object-cover"
      />
    )
  }

  const initial = name.trim().slice(0, 1).toUpperCase()

  // Belum memilih foto, jadi lingkaran tint violet berisi huruf pertama nama.
  // Kalau namanya juga belum ada, ikon yang dipakai supaya lingkarannya tidak
  // tampil kosong.
  return (
    <span className="bg-violet-tint text-violet grid h-12 w-12 shrink-0 place-items-center rounded-full text-[17px] font-bold">
      {initial === '' ? <User className="h-5 w-5" /> : initial}
    </span>
  )
}

export default Avatar
