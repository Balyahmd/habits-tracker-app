export type Gender = "male" | "female";

export type Profile = {
  name: string;
  birthDate: string;
  gender: Gender;
  photo?: string
};
