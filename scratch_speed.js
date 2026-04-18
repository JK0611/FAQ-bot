import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function testModel(modelName) {
  const start = Date.now();
  try {
    const res = await Promise.race([
        ai.models.generateContent({
            model: modelName,
            contents: "Hi, respond with 'hello' only."
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
    ]);
    console.log(`[${modelName}] Success in ${Date.now() - start}ms`);
  } catch (e) {
    console.log(`[${modelName}] Failed in ${Date.now() - start}ms:`, e.message);
  }
}

async function run() {
  await testModel('gemini-2.5-flash');
  await testModel('gemini-2.0-flash');
  await testModel('gemini-3.1-flash-lite-preview');
  await testModel('gemini-flash-lite-latest');
}
run();
