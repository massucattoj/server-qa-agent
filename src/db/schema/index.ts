// Barrel file pattern -> A file that export the other files inside

import { questions } from "./questions.ts";
import { rooms } from "./rooms.ts";
import { audioChunks } from "./audio-chunks.ts";
import { users } from "./users.ts";

export const schema = {
  rooms,
  questions,
  audioChunks,
  users,
};
