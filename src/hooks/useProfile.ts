import { useState } from "react";
import type { Profile } from "../types/profile";
import { readProfile, writeProfile } from "../utils/storage";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(readProfile());

  function saveProfile(nextProfile: Profile) {
    setProfile(nextProfile);
    writeProfile(nextProfile);
  }

  return { profile, saveProfile };
}
