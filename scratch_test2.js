async function test() {
  const start = Date.now();
  try {
    const res = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history: [{ role: 'user', parts: [{ text: "how to top up?" }] }],
        selectedModel: "gemini-2.5-flash",
        inputValue: "how to top up?"
      })
    });
    const text = await res.text();
    console.log("Time Taken (ms):", Date.now() - start);
  } catch (e) {
    console.error(e);
  }
}
test();
