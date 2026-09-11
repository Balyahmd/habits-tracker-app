type AvatarProps = {
  name: string;
  photo?: string;
};

function Avatar({ name, photo }: AvatarProps) {
  if (photo !== undefined && photo !== "")
    return photo ? (
      <img
        src={photo}
        alt="Your profile photo"
        className="h-12 w-12 shrink-0 rounded-full object-cover"
      />
    ) : (
      <span className="bg-violet-tint text-violet place-items-center  h-1 w-12 shrink-0 rounded-full text-[17px] font-bold">
        {name.slice(0, 1).toUpperCase()}
      </span>
    );
}

export default Avatar;
