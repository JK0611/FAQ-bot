import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const start = Date.now();
  
  // 1. Embedding
  console.log("Testing embedding...");
  let s = Date.now();
  await ai.models.embedContent({
      model: 'gemini-embedding-2-preview',
      contents: "What if my courier did not pick up?",
      config: { taskType: 'RETRIEVAL_QUERY' }
  });
  console.log(`Embedding took ${Date.now() - s}ms`);

  // 2. Reranking using gemini-3.1-flash-lite-preview
  console.log("Testing reranking (3.1-flash-lite-preview)...");
  s = Date.now();
  await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview',
      contents: "Rerank documents",
      config: { responseMimeType: "application/json" }
  });
  console.log(`Reranking 3.1 took ${Date.now() - s}ms`);

  // 3. Reranking using gemini-flash-lite-latest
  console.log("Testing reranking (lite-latest)...");
  s = Date.now();
  await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: "Rerank documents",
      config: { responseMimeType: "application/json" }
  });
  console.log(`Reranking lite-latest took ${Date.now() - s}ms`);

  console.log(`Total test loop finished.`);
}
run();
