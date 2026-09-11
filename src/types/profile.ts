export type Gender = "male" | "famale";

export type Profile = {
  name: string;
  birthDate: string;
  gender: Gender;
  photo?: string
};
