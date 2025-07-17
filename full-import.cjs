

const { execSync } = require('child_process');
const path = require('path');

const projectRoot = 'C:/Users/PC1/Downloads/dicoV1';

function runCommand(command, description) {
    console.log(`
--- ${description} ---`);
    try {
        const output = execSync(command, { cwd: projectRoot, stdio: 'inherit' });
        console.log(`✅ Command successful: ${command}`);
        return output;
    } catch (error) {
        console.error(`❌ Command failed: ${command}`);
        console.error(error.message);
        process.exit(1);
    }
}

console.log("Starting full dictionary import process...");

// Step 1: Import data from JSON to SQLite
runCommand(
    `node ${path.join(projectRoot, 'import-from-json.cjs')}`,
    "Importing data from words.json to SQLite"
);

// Step 2: Compile the TypeScript script for exporting SQLite to JSON
runCommand(
    `npx tsc ${path.join(projectRoot, 'import-dictionary-db.ts')}`,
    "Compiling TypeScript dictionary export script"
);

// Step 3: Rename the compiled JavaScript file to .cjs
runCommand(
    `move ${path.join(projectRoot, 'import-dictionary-db.js')} ${path.join(projectRoot, 'import-dictionary-db.cjs')}`,
    "Renaming compiled JS to CJS"
);

// Step 4: Run the renamed .cjs file to export data from SQLite to JSON
runCommand(
    `node ${path.join(projectRoot, 'import-dictionary-db.cjs')}`,
    "Exporting data from SQLite to dictionary.json"
);

console.log("\n🎉 Full dictionary import process completed successfully!");

