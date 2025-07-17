import fs from 'fs';
import path from 'path';

const OUT_FILE = path.join(__dirname, 'electron-dico', 'dictionary.json');

function main() {
  const wordsJsonPath = path.join(__dirname, 'words.json');
  const jsonData = fs.readFileSync(wordsJsonPath, 'utf8');
  const allWords = JSON.parse(jsonData).map(entry => ({
    numee: entry.titre,
    definition: entry.texte,
    phonetic: entry.ph || '',
  }));

  fs.writeFileSync(OUT_FILE, JSON.stringify(allWords, null, 2), 'utf8');
  console.log(`✅ Export terminé : ${allWords.length} mots écrits dans ${OUT_FILE}`);
}

main();