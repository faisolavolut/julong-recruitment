import { getNumber } from "@/lib/utils/getNumber";
import get from "lodash.get";

export const getTotalExperience = (
  workExperiences: { year_experience: number }[] = []
): number => {
  if (!Array.isArray(workExperiences) || workExperiences.length === 0) {
    return 0;
  }
  return workExperiences.reduce(
    (total, exp) => total + getNumber(get(exp, "year_experience", 0)),
    0
  );
};

export const detectUniqueExperience = (
  workExperiences: { name: string }[] = [],
  keys = "name",
  more = "career experiences"
): string | null => {
  if (!Array.isArray(workExperiences) || workExperiences.length === 0) {
    return null;
  }
  const uniqueNames = Array.from(
    new Set(workExperiences.map((exp) => get(exp, keys, "")))
  ).filter(Boolean);

  if (uniqueNames.length === 0) return null;
  if (uniqueNames.length === 1) return uniqueNames[0];
  return `${uniqueNames.length} ${more}`;
};
