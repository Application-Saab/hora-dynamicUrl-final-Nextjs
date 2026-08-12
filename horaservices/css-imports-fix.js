const fs = require("fs");
const path = require("path");

const ROOT = path.join(process.cwd(), "src");
const PAGES_DIR = path.join(ROOT, "pages");
const APP_FILE = path.join(PAGES_DIR, "_app.jsx");

const EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];

const changedFiles = [];
const cssImports = new Set();

function walk(dir) {
  if (!fs.existsSync(dir)) return [];

  const result = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (
      entry.name === "node_modules" ||
      entry.name === ".next" ||
      entry.name === ".git"
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      result.push(...walk(fullPath));
    } else {
      result.push(fullPath);
    }
  }

  return result;
}

function normalizeImportPath(importPath) {
  return importPath.replace(/\\/g, "/");
}

function isGlobalCssImport(importPath) {
  if (!importPath.endsWith(".css")) {
    return false;
  }

  // CSS Modules are allowed inside components
  if (
    importPath.endsWith(".module.css") ||
    importPath.includes(".module.")
  ) {
    return false;
  }

  return true;
}

function getAppImportPath(cssFile) {
  let relative = path.relative(path.dirname(APP_FILE), cssFile);

  relative = normalizeImportPath(relative);

  if (!relative.startsWith(".")) {
    relative = "./" + relative;
  }

  return relative;
}

function createBackup(filePath) {
  const backupPath = filePath + ".global-css-backup";

  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
  }
}

console.log("");
console.log("===============================================");
console.log(" HORA GLOBAL CSS MIGRATION");
console.log("===============================================");
console.log("");

if (!fs.existsSync(APP_FILE)) {
  console.error(`ERROR: ${APP_FILE} not found`);
  process.exit(1);
}

const files = walk(ROOT);

console.log(`Found ${files.length} source files`);
console.log("");

for (const file of files) {
  if (!EXTENSIONS.includes(path.extname(file))) {
    continue;
  }

  if (path.resolve(file) === path.resolve(APP_FILE)) {
    continue;
  }

  let content = fs.readFileSync(file, "utf8");
  const originalContent = content;

  /*
   * Matches:
   *
   * import "./style.css";
   * import "../style.css";
   * import "@/styles/style.css";
   *
   */
  const importRegex =
    /import\s+(?:(?:[^'"]+?)\s+from\s+)?["']([^"']+\.css)["'];?\s*[\r\n]?/g;

  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];

    if (!isGlobalCssImport(importPath)) {
      continue;
    }

    /*
     * Only process relative / alias imports
     */
    let cssFile = null;

    if (importPath.startsWith("@/")) {
      const relativePath = importPath.replace(/^@\//, "");
      cssFile = path.join(ROOT, relativePath);
    } else if (importPath.startsWith(".")) {
      cssFile = path.resolve(path.dirname(file), importPath);
    }

    if (!cssFile || !fs.existsSync(cssFile)) {
      console.log(
        `⚠️ CSS file not found/resolved: ${importPath} in ${path.relative(
          process.cwd(),
          file
        )}`
      );
      continue;
    }

    cssImports.add(path.resolve(cssFile));
  }

  /*
   * Remove global CSS imports
   */
  content = content.replace(importRegex, (fullMatch, importPath) => {
    if (!isGlobalCssImport(importPath)) {
      return fullMatch;
    }

    let cssFile = null;

    if (importPath.startsWith("@/")) {
      cssFile = path.join(ROOT, importPath.replace(/^@\//, ""));
    } else if (importPath.startsWith(".")) {
      cssFile = path.resolve(path.dirname(file), importPath);
    }

    if (!cssFile || !fs.existsSync(cssFile)) {
      return fullMatch;
    }

    createBackup(file);

    return "";
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, "utf8");
    changedFiles.push(file);

    console.log(
      `✓ Removed CSS imports from ${path.relative(process.cwd(), file)}`
    );
  }
}

console.log("");
console.log("===============================================");
console.log(" CSS FILES TO ADD TO _app.jsx");
console.log("===============================================");
console.log("");

const appContent = fs.readFileSync(APP_FILE, "utf8");

const existingAppImports = new Set();

const existingImportRegex =
  /import\s+(?:(?:[^'"]+?)\s+from\s+)?["']([^"']+\.css)["'];?/g;

let match;

while ((match = existingImportRegex.exec(appContent)) !== null) {
  existingAppImports.add(match[1]);
}

const newImports = [];

for (const cssFile of Array.from(cssImports).sort()) {
  const importPath = getAppImportPath(cssFile);

  if (existingAppImports.has(importPath)) {
    continue;
  }

  newImports.push(`import "${importPath}";`);
}

if (newImports.length > 0) {
  createBackup(APP_FILE);

  const updatedApp = newImports.join("\n") + "\n" + appContent;

  fs.writeFileSync(APP_FILE, updatedApp, "utf8");
}

console.log(`Total CSS files found: ${cssImports.size}`);
console.log(`New CSS imports added to _app.jsx: ${newImports.length}`);
console.log(`Files modified: ${changedFiles.length}`);

console.log("");

if (newImports.length > 0) {
  console.log("Added imports:");
  console.log("");

  for (const item of newImports) {
    console.log(`  ${item}`);
  }
}

console.log("");
console.log("===============================================");
console.log(" MIGRATION COMPLETE");
console.log("===============================================");
console.log("");
console.log("Backup files created with:");
console.log("*.global-css-backup");
console.log("");