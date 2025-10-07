import { pgTable, text, timestamp, uuid, vector } from "drizzle-orm/pg-core";
import { rooms } from "./rooms.ts";

export const audioChunks = pgTable("audio_chunks", {
  id: uuid().primaryKey().defaultRandom(),
  roomId: uuid()
    .references(() => rooms.id)
    .notNull(),
  transcription: text().notNull(),
  embeddings: vector({ dimensions: 768 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

/**
 * Vector embeddings are numerical representations of the audio transcription text,
 * converted into a high-dimensional vector space where semantically similar content
 * is positioned closer together. This enables semantic search capabilities, allowing
 * users to find relevant audio chunks based on meaning rather than exact text matches.
 *
 * The 768 dimensions correspond to the output size of popular transformer models
 * like BERT-base, sentence-transformers, and OpenAI's text-embedding models,
 * providing rich semantic representations for accurate similarity matching.
 *
 * ps: an array of 768 numbers
 */
