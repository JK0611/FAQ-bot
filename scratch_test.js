import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  const systemInstruction = `
You are a customer support routing assistant for DelyvaNow.
Your ONLY task is to direct the user to ALL relevant articles from the highly verified knowledge base chunk provided below.

RULES:
1. DO NOT answer the user's question directly.
2. INSTEAD, use the provided matching articles below and reply ONLY with a short, polite message containing the link(s).
3. If there are multiple relevant articles, list ALL of them as a numbered list.
4. Format the links strictly in Markdown like this: 1. [Article Title](URL)
5. If the answer cannot be found in the knowledge base chunk below, politely inform them that you couldn't find a matching article and say "please contact our live chat team".
6. DO NOT make up URLs, hallucinate articles, or use external links outside the provided JSON below.

KNOWLEDGE BASE DATA:
[{"title":"What to do if Courier Missed Pickup?","content":"Contact support.","url":"link1"}]
    `;

  const history1 = [
    { role: 'model', parts: [{text: 'Hello!'}] },
    { role: 'user', parts: [{text: systemInstruction + '\nUSER QUESTION:\nWhat if my courier did not pick up?'}] }
  ];

  const res1 = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite-preview',
    contents: history1
  });
  console.log("FIRST TIME:", res1.text);

  const history2 = [
    { role: 'model', parts: [{text: 'Hello!'}] },
    { role: 'user', parts: [{text: systemInstruction + '\nUSER QUESTION:\nWhat if my courier did not pick up?'}] },
    { role: 'model', parts: [{text: 'I could not find an article. Please contact our live chat team.'}]},
    { role: 'user', parts: [{text: systemInstruction + '\nUSER QUESTION:\nWhat if my courier did not pick up?'}] }
  ];

  const res2 = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite-preview',
    contents: history2
  });
  console.log("SECOND TIME:", res2.text);
}

run();
