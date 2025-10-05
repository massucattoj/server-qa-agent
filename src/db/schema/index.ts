// Barrel file pattern -> A file that export the other files inside

import { questions } from "./questions.ts";
import { rooms } from "./rooms.ts";

export const schema = {
  rooms,
  questions,
};
