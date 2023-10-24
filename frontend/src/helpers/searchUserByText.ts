import levenshtein from "fast-levenshtein";
import { UserType } from "../types/userTypes";

export const searchUsersByText = (keyWord: string, users: UserType) => {
  let results = [];

  const fullName = `${users.firstName} ${users.lastName}`.toLowerCase();
  if (fullName.includes(keyWord.toLowerCase())) {
    results.push(users);
  } else {
    const distance = levenshtein.get(keyWord.toLowerCase(), fullName);
    if (distance <= 2) {
      results.push(users);
    }
  }
  return { success: results[0] ? true : false };
};
