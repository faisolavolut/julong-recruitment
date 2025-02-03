import get from "lodash.get";

const educationRanks: Record<string, number> = {
  "1 - Doctoral / Professor": 1,
  "2 - Master Degree": 2,
  "3 - Bachelor": 3,
  "7 - Diploma 4": 4,
  "6 - Diploma 3": 5,
  "5 - Diploma 2": 6,
  "4 - Diploma 1": 7,
  "9 - Senior High School": 8,
  "10 - Junior High School": 9,
  "8 - Elementary School": 10,
  "11 - Unschooled": 11,
};
export const sortEducationLevels = (
  data: any[] | any,
  key?: string,
  level: "upper" | "lower" = "upper"
): any => {
  if (!Array.isArray(data) || !data?.length) {
    return null;
  }
  const sortedData = [...data].sort(
    (a, b) =>
      (educationRanks[a.education_level] || 99) -
      (educationRanks[b.education_level] || 99)
  );
  if (key) {
    const targetItem =
      level === "upper" ? sortedData[0] : sortedData[sortedData.length - 1];

    return get(targetItem, key, undefined);
  } else {
    return sortedData;
  }
};
