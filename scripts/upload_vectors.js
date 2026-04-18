import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error("❌ ERROR: Missing FIREBASE_SERVICE_ACCOUNT in .env");
  console.error("Please add your Firebase Admin SDK config string to .env and run this again.");
  process.exit(1);
}

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
});

const db = admin.firestore();

async function uploadVectors() {
  console.log("Loading vector_store.json...");
  let vectorStore = [];
  try {
    vectorStore = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../src/data/vector_store.json'), 'utf-8')
    );
  } catch (e) {
    console.error("Could not find vector_store.json. Run node scripts/build_vector_db.js first.");
    process.exit(1);
  }

  console.log(`Found ${vectorStore.length} vectors. Uploading to Firebase...`);
  
  const batchArray = [];
  batchArray.push(db.batch());
  let operationCounter = 0;
  let batchIndex = 0;

  for (const item of vectorStore) {
    const docRef = db.collection("vector_store").doc();
    batchArray[batchIndex].set(docRef, item);
    operationCounter++;

    // Firestore matches have a limit of 500 operations, but vectors are huge (10MB limit)
    // So we use a very small batch size of 20
    if (operationCounter === 20) {
      batchArray.push(db.batch());
      batchIndex++;
      operationCounter = 0;
    }
  }

  console.log(`Executing ${batchArray.length} batches...`);
  for (const batch of batchArray) {
    await batch.commit();
  }
  
  console.log("✅ Successfully migrated local vectors to Firebase Firestore!");
}

uploadVectors();
