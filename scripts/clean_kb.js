import fs from 'fs';
import path from 'path';

const kbPath = path.resolve('./src/data/kb.json');
let kbData = JSON.parse(fs.readFileSync(kbPath, 'utf-8'));

let cleanedCount = 0;
for (let item of kbData) {
    if (item.content.includes("Delyva Sdn. Bhd.")) {
        item.content = item.content.split("Delyva Sdn. Bhd.")[0].trim();
        cleanedCount++;
    }
}

fs.writeFileSync(kbPath, JSON.stringify(kbData, null, 4));
console.log(`Cleaned ${cleanedCount} articles by removing footers!`);
