import { GoogleGenAI } from "@google/genai";
import { env } from "../env.ts";

const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

const model = "gemini-2.5-flash";

export async function transcribeAudio(audioAsBase64: string, mimeType: string) {
  // Since we are dealing with chunks, get it into base64 format
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: "Transcribe the following audio to English text. Be precise and natural in the transcription. Keep punctuations and formatting as close to the original audio as possible. Split into paragraphs when needed.",
      },
      {
        inlineData: {
          mimeType,
          data: audioAsBase64,
        },
      },
    ],
  });

  if (!response.text) {
    throw new Error("Failed to transcribe audio");
  }

  return response.text;
}

export async function generateEmbeddings(text: string) {
  const response = await gemini.models.embedContent({
    model: "text-embedding-004", // For development purposes, production take a look into paid models
    contents: [{ text }],
    config: {
      taskType: "RETRIEVAL_DOCUMENT",
    },
  });

  if (!response.embeddings?.[0].values) {
    throw new Error("Failed to generate embedding.");
  }

  return response.embeddings[0].values;
}

export async function generateAnswer(
  question: string,
  transcriptions: string[]
) {
  const context = transcriptions.join("\n\n");

  const prompt = `
    Based on the text provided below as context, answer the question clearly and precisely in English.
  
    CONTEXT:
    ${context}

    QUESTION:
    ${question}

    INSTRUCTIONS:
    - Use only information contained in the provided context (lesson content).
    Do not use external knowledge, assumptions, or prior experience to answer.

    - Be objective and concise.
    Avoid speculation, repetition, or unnecessary elaboration.

    - Maintain an educational and professional tone.
    Responses should sound factual, clear, and instructive — suitable for academic or training use.

    - Cite relevant excerpts from the context when appropriate.
    Use the phrase “lesson content” when referring to the provided material.
    Example:
      - According to the lesson content, normalization reduces redundancy by dividing data into related tables.

    - Do not alter or interpret beyond what is explicitly stated.
    All reasoning must be traceable to the information in the lesson content.

    -Organize responses clearly.
    Use short paragraphs or bullet points for readability when explaining multiple concepts.
  `.trim();

  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: prompt,
      },
    ],
  });

  if (!response.text) {
    throw new Error("Failed to generate answer.");
  }

  return response.text;
}
