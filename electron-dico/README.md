# Dictionnaire Numèè Offline (Electron)

## Installation & Utilisation

1. **Installer Node.js**  
   https://nodejs.org/

2. **Installer les dépendances**  
   Ouvre un terminal dans ce dossier et lance :
   ```
   npm install
   ```

3. **Lancer l'application en mode développement**  
   ```
   npm start
   ```

4. **Générer le .exe (Windows)**  
   Installe [electron-packager](https://www.npmjs.com/package/electron-packager) si besoin :
   ```
   npm install --save-dev electron-packager
   ```
   Puis lance :
   ```
   npx electron-packager . dico-numee --platform=win32 --arch=x64 --overwrite
   ```
   Le .exe sera dans le dossier `dico-numee-win32-x64`.

---

## 🔄 Mettre à jour le dictionnaire (fichier dictionary.json)

### 1. Depuis la base de données (recommandé)

- Utilise le script fourni `import-dictionary-db.ts` à la racine du projet.
- Prérequis : Node.js, TypeScript, sqlite3 (`npm install sqlite3 ts-node typescript`)
- Lance la commande suivante depuis la racine du projet :
  ```
  npx ts-node import-dictionary-db.ts
  ```
- Le fichier `electron-dico/dictionary.json` sera automatiquement mis à jour avec tous les mots de la base.

### 2. Depuis les fichiers sources (data/dictionary/*.ts)

- Utilise le script `import-dictionary.ts` (moins fiable si la structure varie).
- Lance :
  ```
  npx ts-node import-dictionary.ts
  ```
- Le fichier sera généré dans `electron-dico/dictionary.json`.

### 3. Copier manuellement un export CSV/JSON

- Si tu as un export complet du dictionnaire (CSV, JSON), convertis-le au format :
  ```json
  [
    {"numee":"mot numèè","french":"mot français","definition":"...","phonetic":"...","variants":"..."},
    ...
  ]
  ```
- Remplace le fichier `electron-dico/dictionary.json` par ce nouveau fichier.

---

**Après chaque mise à jour du dictionnaire :**
- Relance l’application offline pour voir les nouveaux mots.
- Tu peux re-générer le .exe si tu veux distribuer une version à jour.

---

**Projet open source, améliorable à volonté !**