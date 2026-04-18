import fs from 'fs';
import path from 'path';
import Fuse from 'fuse.js';

let kbData = JSON.parse(fs.readFileSync(path.resolve('./src/data/kb.json'), 'utf-8'));
let vectorStore = JSON.parse(fs.readFileSync(path.resolve('./src/data/vector_store.json'), 'utf-8'));

const fuse = new Fuse(kbData, {
  keys: [
    { name: 'title', weight: 0.7 },
    { name: 'content', weight: 0.3 }
  ],
  threshold: 0.6,
  ignoreLocation: true,
  findAllMatches: true,
  includeScore: true,
});

function cosineSimilarity(A, B) {
  let dotProduct = 0;
  for (let i = 0; i < A.length; i++) {
    dotProduct += A[i] * B[i];
  }
  return dotProduct;
}

async function testQuery(queryVectorArray) {
  let denseResults = [];
  denseResults = vectorStore.map(v => ({
    item: v.parentDocument,
    score: cosineSimilarity(queryVectorArray, v.embedding)
  }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 10);

  const sparseResultsRaw = fuse.search("What if my courier did not pick up?").slice(0, 10);

  const fusionScores = new Map();
  const k = 60;
  
  denseResults.forEach((doc, rank) => {
    const title = doc.item.title;
    fusionScores.set(title, { item: doc.item, score: 1 / (k + rank + 1) });
  });

  sparseResultsRaw.forEach((doc, rank) => {
    const title = doc.item.title;
    if (fusionScores.has(title)) {
      const current = fusionScores.get(title);
      current.score += 1 / (k + rank + 1);
    } else {
      fusionScores.set(title, { item: doc.item, score: 1 / (k + rank + 1) });
    }
  });

  const hybridTop10 = Array.from(fusionScores.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(x => x.item);

  console.log("TOP 2 HYBRID RESULTS for 'What if my courier did not pick up?':");
  console.log(hybridTop10.slice(0, 2).map(i => i.title));
}

// I can't easily mock the embedding, let's just log the sparse results
console.log("TOP 2 SPARSE RESULTS:\n", fuse.search("What if my courier did not pick up?").slice(0,2).map(x=>x.item.title));
