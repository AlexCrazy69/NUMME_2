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

5. **Mettre à jour le dictionnaire**
   - Remplace le fichier `dictionary.json` par la version à jour (exportée du site ou générée depuis les scripts).

## Structure

- `main.js` : point d'entrée Electron
- `index.html` : interface utilisateur (recherche, navigation, affichage)
- `dictionary.json` : données du dictionnaire (format [{numee, french, definition, ...}])

## Personnalisation

- Pour changer l'icône, ajoute l'option `--icon=icon.ico` à la commande packager.
- Pour Mac/Linux, adapte `--platform` et `--arch`.

---

**Projet open source, améliorable à volonté !**