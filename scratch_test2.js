import fetch from 'node-fetch';

async function test() {
  const payload = {
    history: [
      { role: 'model', parts: [{ text: "Hello! How can i help you today?" }] },
      { role: 'user', parts: [{ text: "What if my courier did not pick up?" }] }
    ],
    selectedModel: "Gemini 3.1 Flash Lite",
    inputValue: "What if my courier did not pick up?"
  };

  const res = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  console.log("STATUS:", res.status);
  console.log("RESPONSE:", text);
}

test();
