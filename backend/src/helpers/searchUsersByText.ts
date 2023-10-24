import natural from "natural";
import { UserType } from "../types/chatTypes";

export const searchUsersByText = (keyWord: string, users: UserType[]) => {
  let results = [];

  for (let i = 0; i < users?.length; i++) {
    if (
      `${users[i].firstName} ${users[i].lastName}`
        .toLowerCase()
        .includes(keyWord.toLowerCase())
    ) {
      results.push(users[i]);
    }
  }

  if (results.length === 0) {
    for (let i = 0; i < users.length; i++) {
      if (
        natural.LevenshteinDistance(
          keyWord.toLowerCase(),
          `${users[i].firstName} ${users[i].lastName}`.toLowerCase()
        ) <= 2
      ) {
        results.push(users[i]);
      }
    }
  }
  return results;
};
