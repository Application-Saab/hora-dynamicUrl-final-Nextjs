// const fs = require("fs");
// const path = require("path");

// const PROJECT_ROOT = process.cwd();

// const IGNORE_DIRS = new Set([
//   "node_modules",
//   ".next",
//   ".git",
//   "out",
//   "dist",
//   "build",
//   ".cache",
//   "coverage",
// ]);

// const SOURCE_EXTENSIONS = new Set([
//   ".js",
//   ".jsx",
//   ".ts",
//   ".tsx",
//   ".mjs",
//   ".cjs",
//   ".css",
//   ".scss",
//   ".sass",
//   ".less",
//   ".html",
// ]);

// const STATIC_EXTENSIONS = new Set([
//   ".png",
//   ".jpg",
//   ".jpeg",
//   ".gif",
//   ".webp",
//   ".svg",
//   ".ico",
//   ".bmp",
//   ".avif",
//   ".mp4",
//   ".webm",
//   ".mov",
//   ".avi",
//   ".mkv",
//   ".mp3",
//   ".wav",
//   ".ogg",
//   ".m4a",
//   ".woff",
//   ".woff2",
//   ".ttf",
//   ".otf",
//   ".eot",
//   ".css",
// ]);

// const results = {
//   caseMismatch: [],
//   missing: [],
// };

// const checked = new Set();

// /**
//  * Recursively get files.
//  */
// function getFiles(dir) {
//   const files = [];

//   if (!fs.existsSync(dir)) {
//     return files;
//   }

//   const entries = fs.readdirSync(dir, {
//     withFileTypes: true,
//   });

//   for (const entry of entries) {
//     if (IGNORE_DIRS.has(entry.name)) {
//       continue;
//     }

//     const fullPath = path.join(dir, entry.name);

//     if (entry.isDirectory()) {
//       files.push(...getFiles(fullPath));
//     } else {
//       files.push(fullPath);
//     }
//   }

//   return files;
// }

// /**
//  * Get actual directory/file entry using case-insensitive lookup.
//  *
//  * Example:
//  *
//  * Requested:
//  *   Home/chef.webp
//  *
//  * Actual:
//  *   home/Chef.webp
//  *
//  * This function will find the actual path.
//  */
// function resolveCaseInsensitive(targetPath) {
//   const absoluteTarget = path.resolve(targetPath);

//   if (!fs.existsSync(absoluteTarget)) {
//     let current = path.parse(absoluteTarget).root;
//     const relativeParts = path
//       .relative(current, absoluteTarget)
//       .split(path.sep)
//       .filter(Boolean);

//     for (const part of relativeParts) {
//       if (!fs.existsSync(current)) {
//         return null;
//       }

//       const entries = fs.readdirSync(current);

//       const match = entries.find(
//         (entry) => entry.toLowerCase() === part.toLowerCase()
//       );

//       if (!match) {
//         return null;
//       }

//       current = path.join(current, match);
//     }

//     return current;
//   }

//   // Even if exists on a case-insensitive filesystem,
//   // verify the actual casing component-by-component.
//   let current = path.parse(absoluteTarget).root;

//   const relativeParts = path
//     .relative(current, absoluteTarget)
//     .split(path.sep)
//     .filter(Boolean);

//   for (const part of relativeParts) {
//     if (!fs.existsSync(current)) {
//       return null;
//     }

//     const entries = fs.readdirSync(current);

//     const exact = entries.find((entry) => entry === part);

//     if (exact) {
//       current = path.join(current, exact);
//       continue;
//     }

//     const caseInsensitiveMatch = entries.find(
//       (entry) => entry.toLowerCase() === part.toLowerCase()
//     );

//     if (!caseInsensitiveMatch) {
//       return null;
//     }

//     current = path.join(current, caseInsensitiveMatch);
//   }

//   return current;
// }

// /**
//  * Check whether a resolved path has exact casing.
//  */
// function hasExactCase(requestedPath, actualPath) {
//   const requested = path.resolve(requestedPath);
//   const actual = path.resolve(actualPath);

//   const requestedRelative = path.relative(PROJECT_ROOT, requested);
//   const actualRelative = path.relative(PROJECT_ROOT, actual);

//   return requestedRelative === actualRelative;
// }

// /**
//  * Read jsconfig/tsconfig alias configuration.
//  */
// function getBaseUrl() {
//   const possibleConfigs = ["jsconfig.json", "tsconfig.json"];

//   for (const configName of possibleConfigs) {
//     const configPath = path.join(PROJECT_ROOT, configName);

//     if (!fs.existsSync(configPath)) {
//       continue;
//     }

//     try {
//       const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

//       if (config.compilerOptions?.baseUrl) {
//         return path.resolve(
//           PROJECT_ROOT,
//           config.compilerOptions.baseUrl
//         );
//       }
//     } catch (error) {
//       console.log(`⚠️ Could not parse ${configName}`);
//     }
//   }

//   return PROJECT_ROOT;
// }

// const BASE_URL = getBaseUrl();

// /**
//  * Resolve an import/reference.
//  */
// function resolveReference(reference, sourceFile) {
//   let cleanReference = reference.trim();

//   // Remove query/hash.
//   cleanReference = cleanReference.split("?")[0].split("#")[0];

//   // Ignore URLs.
//   if (
//     cleanReference.startsWith("http://") ||
//     cleanReference.startsWith("https://") ||
//     cleanReference.startsWith("//") ||
//     cleanReference.startsWith("data:")
//   ) {
//     return null;
//   }

//   // Ignore package imports.
//   if (
//     !cleanReference.startsWith(".") &&
//     !cleanReference.startsWith("@/") &&
//     !cleanReference.startsWith("/")
//   ) {
//     return null;
//   }

//   let resolvedBase;

//   // @/assets/foo.webp
//   if (cleanReference.startsWith("@/")) {
//     resolvedBase = path.join(
//       BASE_URL,
//       cleanReference.substring(2)
//     );
//   }

//   // /assets/foo.webp
//   else if (cleanReference.startsWith("/")) {
//     // Next public folder.
//     resolvedBase = path.join(
//       PROJECT_ROOT,
//       "public",
//       cleanReference.substring(1)
//     );
//   }

//   // ./assets/foo.webp / ../assets/foo.webp
//   else {
//     resolvedBase = path.resolve(
//       path.dirname(sourceFile),
//       cleanReference
//     );
//   }

//   return resolvedBase;
// }

// /**
//  * Try extensions for imports where extension isn't provided.
//  *
//  * Example:
//  *
//  * import logo from "./logo"
//  *
//  * actual:
//  * logo.webp
//  */
// function getPossiblePaths(basePath) {
//   const candidates = [basePath];

//   if (!path.extname(basePath)) {
//     for (const extension of STATIC_EXTENSIONS) {
//       candidates.push(basePath + extension);
//     }

//     candidates.push(path.join(basePath, "index.js"));
//     candidates.push(path.join(basePath, "index.jsx"));
//     candidates.push(path.join(basePath, "index.ts"));
//     candidates.push(path.join(basePath, "index.tsx"));
//   }

//   return candidates;
// }

// /**
//  * Check a reference.
//  */
// function checkReference(reference, sourceFile, lineNumber) {
//   const resolvedBase = resolveReference(reference, sourceFile);

//   if (!resolvedBase) {
//     return;
//   }

//   const possiblePaths = getPossiblePaths(resolvedBase);

//   let actualPath = null;
//   let existingCandidate = null;

//   for (const candidate of possiblePaths) {
//     const caseInsensitive = resolveCaseInsensitive(candidate);

//     if (caseInsensitive) {
//       actualPath = caseInsensitive;
//       existingCandidate = candidate;
//       break;
//     }
//   }

//   const key = `${sourceFile}|${reference}`;

//   if (checked.has(key)) {
//     return;
//   }

//   checked.add(key);

//   if (!actualPath) {
//     results.missing.push({
//       sourceFile,
//       lineNumber,
//       reference,
//       expectedPath: resolvedBase,
//     });

//     return;
//   }

//   if (!hasExactCase(existingCandidate, actualPath)) {
//     results.caseMismatch.push({
//       sourceFile,
//       lineNumber,
//       reference,
//       requestedPath: existingCandidate,
//       actualPath,
//     });
//   }
// }

// /**
//  * Extract references from source code.
//  */
// function extractReferences(content) {
//   const references = [];

//   /*
//    * import x from "./file"
//    * import "./file"
//    * export ... from "./file"
//    */
//   const importRegex =
//     /(?:import\s+(?:[\s\S]*?\s+from\s+)?|export\s+(?:[\s\S]*?\s+from\s+)?)["'`]([^"'`]+)["'`]/g;

//   /*
//    * require("./file")
//    */
//   const requireRegex =
//     /require\s*\(\s*["'`]([^"'`]+)["'`]\s*\)/g;

//   /*
//    * CSS:
//    * url("./file.webp")
//    * url('../file.png')
//    */
//   const cssUrlRegex =
//     /url\s*\(\s*["']?([^"')]+)["']?\s*\)/g;

//   /*
//    * src="/assets/file.webp"
//    * href="/assets/file.css"
//    * poster="/assets/file.webp"
//    */
//   const htmlAttributeRegex =
//     /(?:src|href|poster|data-src|data-image)\s*=\s*["']([^"']+)["']/gi;

//   let match;

//   while ((match = importRegex.exec(content))) {
//     references.push(match[1]);
//   }

//   while ((match = requireRegex.exec(content))) {
//     references.push(match[1]);
//   }

//   while ((match = cssUrlRegex.exec(content))) {
//     references.push(match[1]);
//   }

//   while ((match = htmlAttributeRegex.exec(content))) {
//     references.push(match[1]);
//   }

//   return [...new Set(references)];
// }

// /**
//  * Find line number.
//  */
// function getLineNumber(content, reference) {
//   const index = content.indexOf(reference);

//   if (index === -1) {
//     return "?";
//   }

//   return content.substring(0, index).split("\n").length;
// }

// /**
//  * Main scan.
//  */
// function scan() {
//   console.log("\n");
//   console.log("==============================================");
//   console.log("  Next.js Static Asset Case Sensitivity Check");
//   console.log("==============================================\n");

//   console.log(`Project: ${PROJECT_ROOT}`);
//   console.log(`Base URL: ${BASE_URL}\n`);

//   const files = getFiles(PROJECT_ROOT).filter((file) =>
//     SOURCE_EXTENSIONS.has(path.extname(file).toLowerCase())
//   );

//   console.log(`Scanning ${files.length} source files...\n`);

//   for (const file of files) {
//     let content;

//     try {
//       content = fs.readFileSync(file, "utf8");
//     } catch (error) {
//       continue;
//     }

//     const references = extractReferences(content);

//     for (const reference of references) {
//       checkReference(
//         reference,
//         file,
//         getLineNumber(content, reference)
//       );
//     }
//   }
// }

// /**
//  * Print results.
//  */
// function printResults() {
//   console.log("\n==============================================");
//   console.log("                 RESULTS");
//   console.log("==============================================\n");

//   if (results.caseMismatch.length === 0) {
//     console.log("✅ No case-sensitive path mismatches found.\n");
//   } else {
//     console.log(
//       `❌ CASE MISMATCHES: ${results.caseMismatch.length}\n`
//     );

//     results.caseMismatch.forEach((item, index) => {
//       console.log(`---------- Case Error ${index + 1} ----------`);

//       console.log(
//         `Source : ${path.relative(PROJECT_ROOT, item.sourceFile)}:${item.lineNumber}`
//       );

//       console.log(`Import : ${item.reference}`);

//       console.log(
//         `Actual : ${path.relative(PROJECT_ROOT, item.actualPath)}`
//       );

//       console.log(
//         `Used   : ${path.relative(PROJECT_ROOT, item.requestedPath)}`
//       );

//       console.log("");
//     });
//   }

//   if (results.missing.length === 0) {
//     console.log("✅ No missing static references found.\n");
//   } else {
//     console.log(
//       `⚠️ MISSING REFERENCES: ${results.missing.length}\n`
//     );

//     results.missing.forEach((item, index) => {
//       console.log(`---------- Missing ${index + 1} ----------`);

//       console.log(
//         `Source : ${path.relative(PROJECT_ROOT, item.sourceFile)}:${item.lineNumber}`
//       );

//       console.log(`Reference : ${item.reference}`);

//       console.log(
//         `Expected  : ${path.relative(PROJECT_ROOT, item.expectedPath)}`
//       );

//       console.log("");
//     });
//   }

//   console.log("==============================================\n");

//   if (
//     results.caseMismatch.length > 0 ||
//     results.missing.length > 0
//   ) {
//     process.exitCode = 1;
//   }
// }

// scan();
// printResults();






/**
 * Next.js Static Asset Case Sensitivity Auto-Fixer
 *
 * What it does:
 * 1. Scans all source files
 * 2. Finds imports/references with wrong casing
 * 3. Automatically updates the source code to match the real file casing on disk
 * 4. Reports missing files (cannot auto-create them)
 *
 * Usage:
 *   node fix-case-sensitive-assets.js
 *
 * Optional flags:
 *   --dry-run     Only show what would be changed (no file writes)
 *   --verbose     Show more details
 */

const fs = require("fs");
const path = require("path");

// ====================== CONFIG ======================
const PROJECT_ROOT = process.cwd();

const IGNORE_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "out",
  "dist",
  "build",
  ".cache",
  "coverage",
  ".vercel",
  ".turbo",
]);

const SOURCE_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".html",
]);

const STATIC_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".ico",
  ".bmp",
  ".avif",
  ".mp4",
  ".webm",
  ".mov",
  ".avi",
  ".mkv",
  ".mp3",
  ".wav",
  ".ogg",
  ".m4a",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".eot",
]);

// CLI flags
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const VERBOSE = args.includes("--verbose");

// ====================== STATE ======================
const results = {
  caseMismatch: [],
  missing: [],
  fixed: [],
  failed: [],
};

const checked = new Set();

// ====================== HELPERS ======================

function getFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Resolve path case-insensitively and return the real path with correct casing.
 */
function resolveCaseInsensitive(targetPath) {
  const absoluteTarget = path.resolve(targetPath);

  let current = path.parse(absoluteTarget).root;
  const relativeParts = path
    .relative(current, absoluteTarget)
    .split(path.sep)
    .filter(Boolean);

  for (const part of relativeParts) {
    if (!fs.existsSync(current)) return null;

    const entries = fs.readdirSync(current);

    // Prefer exact match first
    const exact = entries.find((e) => e === part);
    if (exact) {
      current = path.join(current, exact);
      continue;
    }

    // Fallback to case-insensitive
    const match = entries.find(
      (e) => e.toLowerCase() === part.toLowerCase()
    );

    if (!match) return null;
    current = path.join(current, match);
  }

  return current;
}

function hasExactCase(requestedPath, actualPath) {
  const requested = path.resolve(requestedPath);
  const actual = path.resolve(actualPath);

  const requestedRelative = path.relative(PROJECT_ROOT, requested);
  const actualRelative = path.relative(PROJECT_ROOT, actual);

  return requestedRelative === actualRelative;
}

function getBaseUrl() {
  const possibleConfigs = ["jsconfig.json", "tsconfig.json"];

  for (const configName of possibleConfigs) {
    const configPath = path.join(PROJECT_ROOT, configName);
    if (!fs.existsSync(configPath)) continue;

    try {
      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      if (config.compilerOptions?.baseUrl) {
        return path.resolve(PROJECT_ROOT, config.compilerOptions.baseUrl);
      }
    } catch (e) {
      // ignore
    }
  }

  return PROJECT_ROOT;
}

const BASE_URL = getBaseUrl();

function resolveReference(reference, sourceFile) {
  let cleanReference = reference.trim();
  cleanReference = cleanReference.split("?")[0].split("#")[0];

  // Ignore absolute URLs and data URIs
  if (
    cleanReference.startsWith("http://") ||
    cleanReference.startsWith("https://") ||
    cleanReference.startsWith("//") ||
    cleanReference.startsWith("data:")
  ) {
    return null;
  }

  // Ignore package imports
  if (
    !cleanReference.startsWith(".") &&
    !cleanReference.startsWith("@/") &&
    !cleanReference.startsWith("/")
  ) {
    return null;
  }

  let resolvedBase;

  if (cleanReference.startsWith("@/")) {
    resolvedBase = path.join(BASE_URL, cleanReference.substring(2));
  } else if (cleanReference.startsWith("/")) {
    // public folder
    resolvedBase = path.join(PROJECT_ROOT, "public", cleanReference.substring(1));
  } else {
    resolvedBase = path.resolve(path.dirname(sourceFile), cleanReference);
  }

  return resolvedBase;
}

function getPossiblePaths(basePath) {
  const candidates = [basePath];

  if (!path.extname(basePath)) {
    for (const ext of STATIC_EXTENSIONS) {
      candidates.push(basePath + ext);
    }
    candidates.push(path.join(basePath, "index.js"));
    candidates.push(path.join(basePath, "index.jsx"));
    candidates.push(path.join(basePath, "index.ts"));
    candidates.push(path.join(basePath, "index.tsx"));
  }

  return candidates;
}

/**
 * Build the corrected reference string that should replace the old one.
 * Keeps the original style (@/, ./, ../, /)
 */
function buildCorrectedReference(originalReference, requestedPath, actualPath) {
  const original = originalReference.trim().split("?")[0].split("#")[0];

  // Calculate relative path from the "requested" base to actual
  // We need to preserve the import style used in the source.

  if (original.startsWith("@/")) {
    // @/assets/Home/chef.webp  →  @/assets/home/Chef.webp
    const relativeFromBase = path
      .relative(BASE_URL, actualPath)
      .split(path.sep)
      .join("/");
    return "@/ " + relativeFromBase.replace(/^\/+/, "");
  }

  if (original.startsWith("/")) {
    // /assets/... → public folder
    const relativeFromPublic = path
      .relative(path.join(PROJECT_ROOT, "public"), actualPath)
      .split(path.sep)
      .join("/");
    return "/" + relativeFromPublic.replace(/^\/+/, "");
  }

  // Relative import (./ or ../)
  // We need the correct relative path from the source file's directory
  // But we don't have sourceFile here easily for relative calculation in all cases.
  // Instead we compute the difference in casing only on the parts that differ.

  // Safer approach: replace only the mismatched path segments while keeping the original prefix structure.
  const requestedNorm = path.resolve(requestedPath);
  const actualNorm = path.resolve(actualPath);

  const requestedParts = requestedNorm.split(path.sep);
  const actualParts = actualNorm.split(path.sep);

  // Find from the end how much is different
  let i = requestedParts.length - 1;
  let j = actualParts.length - 1;

  const correctedParts = [];
  while (i >= 0 && j >= 0) {
    if (requestedParts[i].toLowerCase() === actualParts[j].toLowerCase()) {
      correctedParts.unshift(actualParts[j]); // use real casing
    } else {
      // structure mismatch – fallback
      break;
    }
    i--;
    j--;
  }

  // For relative imports we rebuild using the original reference's directory structure
  // but with correct casing of the filename + folders that exist.

  // Simplest reliable way for relative:
  // Take the original reference and replace the last path segments with the correctly cased ones.
  const originalParts = original.replace(/\\/g, "/").split("/");
  const actualFileParts = path
    .relative(path.dirname(requestedPath), actualPath)
    .split(path.sep);

  // If the original was just a filename or simple relative, we can rebuild
  if (original.startsWith("./") || original.startsWith("../")) {
    // Compute correct relative from source later – we will do it in the fix function
    // where we have sourceFile.
    return null; // signal that we need sourceFile-aware fix
  }

  return null;
}

/**
 * More reliable corrected reference builder (used during fix)
 */
function getCorrectedImportString(originalReference, sourceFile, actualPath) {
  let clean = originalReference.trim().split("?")[0].split("#")[0];

  if (clean.startsWith("@/")) {
    const rel = path
      .relative(BASE_URL, actualPath)
      .split(path.sep)
      .join("/");
    return "@/" + rel;
  }

  if (clean.startsWith("/")) {
    const rel = path
      .relative(path.join(PROJECT_ROOT, "public"), actualPath)
      .split(path.sep)
      .join("/");
    return "/" + rel;
  }

  // Relative
  const relative = path
    .relative(path.dirname(sourceFile), actualPath)
    .split(path.sep)
    .join("/");

  // Ensure it starts with ./ if it doesn't go up
  if (!relative.startsWith(".") && !relative.startsWith("/")) {
    return "./" + relative;
  }
  return relative;
}

// ====================== SCAN ======================

function checkReference(reference, sourceFile, lineNumber, content) {
  const resolvedBase = resolveReference(reference, sourceFile);
  if (!resolvedBase) return;

  const possiblePaths = getPossiblePaths(resolvedBase);

  let actualPath = null;
  let existingCandidate = null;

  for (const candidate of possiblePaths) {
    const caseInsensitive = resolveCaseInsensitive(candidate);
    if (caseInsensitive) {
      actualPath = caseInsensitive;
      existingCandidate = candidate;
      break;
    }
  }

  const key = `${sourceFile}|${reference}`;
  if (checked.has(key)) return;
  checked.add(key);

  if (!actualPath) {
    results.missing.push({
      sourceFile,
      lineNumber,
      reference,
      expectedPath: resolvedBase,
    });
    return;
  }

  if (!hasExactCase(existingCandidate, actualPath)) {
    results.caseMismatch.push({
      sourceFile,
      lineNumber,
      reference,
      requestedPath: existingCandidate,
      actualPath,
      content, // keep original content for later fix
    });
  }
}

function extractReferences(content) {
  const references = [];

  const importRegex =
    /(?:import\s+(?:[\s\S]*?\s+from\s+)?|export\s+(?:[\s\S]*?\s+from\s+)?)["'`]([^"'`]+)["'`]/g;

  const requireRegex = /require\s*\(\s*["'`]([^"'`]+)["'`]\s*\)/g;
  const cssUrlRegex = /url\s*\(\s*["']?([^"')]+)["']?\s*\)/g;
  const htmlAttributeRegex =
    /(?:src|href|poster|data-src|data-image)\s*=\s*["']([^"']+)["']/gi;

  let match;

  while ((match = importRegex.exec(content))) {
    references.push(match[1]);
  }
  while ((match = requireRegex.exec(content))) {
    references.push(match[1]);
  }
  while ((match = cssUrlRegex.exec(content))) {
    references.push(match[1]);
  }
  while ((match = htmlAttributeRegex.exec(content))) {
    references.push(match[1]);
  }

  return [...new Set(references)];
}

function getLineNumber(content, reference) {
  const index = content.indexOf(reference);
  if (index === -1) return "?";
  return content.substring(0, index).split("\n").length;
}

function scan() {
  console.log("\n==============================================");
  console.log("  Next.js Asset Case Sensitivity Auto-Fixer");
  console.log("==============================================\n");

  if (DRY_RUN) {
    console.log("🔍 DRY-RUN mode — no files will be modified\n");
  }

  console.log(`Project : ${PROJECT_ROOT}`);
  console.log(`Base URL: ${BASE_URL}\n`);

  const files = getFiles(PROJECT_ROOT).filter((file) =>
    SOURCE_EXTENSIONS.has(path.extname(file).toLowerCase())
  );

  console.log(`Scanning ${files.length} source files...\n`);

  for (const file of files) {
    let content;
    try {
      content = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }

    const references = extractReferences(content);

    for (const reference of references) {
      checkReference(
        reference,
        file,
        getLineNumber(content, reference),
        content
      );
    }
  }
}

// ====================== AUTO FIX ======================

function fixFile(sourceFile, mismatches) {
  let content = fs.readFileSync(sourceFile, "utf8");
  let originalContent = content;
  let changeCount = 0;

  // Sort by reference length descending so longer paths are replaced first
  // (avoids partial replacements)
  const sorted = [...mismatches].sort(
    (a, b) => b.reference.length - a.reference.length
  );

  for (const item of sorted) {
    const corrected = getCorrectedImportString(
      item.reference,
      sourceFile,
      item.actualPath
    );

    if (!corrected || corrected === item.reference) {
      continue;
    }

    // Replace all occurrences of the exact old reference string
    // We need to be careful with quotes
    const patterns = [
      `"${item.reference}"`,
      `'${item.reference}'`,
      `\`${item.reference}\``,
    ];

    let replaced = false;

    for (const oldQuoted of patterns) {
      if (content.includes(oldQuoted)) {
        const newQuoted = oldQuoted.replace(item.reference, corrected);
        content = content.split(oldQuoted).join(newQuoted);
        replaced = true;
      }
    }

    // Also handle unquoted cases (rare, mostly CSS url())
    if (!replaced && content.includes(item.reference)) {
      // Only replace if it looks like a path reference
      content = content.split(item.reference).join(corrected);
      replaced = true;
    }

    if (replaced) {
      changeCount++;
      results.fixed.push({
        sourceFile,
        old: item.reference,
        new: corrected,
        line: item.lineNumber,
      });

      if (VERBOSE) {
        console.log(`  ✓ ${path.relative(PROJECT_ROOT, sourceFile)}`);
        console.log(`    ${item.reference}`);
        console.log(`    → ${corrected}\n`);
      }
    }
  }

  if (changeCount > 0 && content !== originalContent) {
    if (!DRY_RUN) {
      try {
        fs.writeFileSync(sourceFile, content, "utf8");
      } catch (err) {
        results.failed.push({
          sourceFile,
          error: err.message,
        });
        return false;
      }
    }
    return true;
  }

  return false;
}

function applyFixes() {
  if (results.caseMismatch.length === 0) {
    console.log("✅ No case mismatches found. Nothing to fix.\n");
    return;
  }

  console.log(
    `\n🔧 Found ${results.caseMismatch.length} case mismatch(es). Applying fixes...\n`
  );

  // Group by source file
  const byFile = new Map();

  for (const item of results.caseMismatch) {
    if (!byFile.has(item.sourceFile)) {
      byFile.set(item.sourceFile, []);
    }
    byFile.get(item.sourceFile).push(item);
  }

  let filesChanged = 0;

  for (const [sourceFile, mismatches] of byFile) {
    const changed = fixFile(sourceFile, mismatches);
    if (changed) filesChanged++;
  }

  console.log("==============================================");
  console.log("                 FIX SUMMARY");
  console.log("==============================================\n");

  console.log(`Files scanned     : ${byFile.size}`);
  console.log(`Case mismatches   : ${results.caseMismatch.length}`);
  console.log(`Successfully fixed: ${results.fixed.length}`);
  console.log(`Files modified    : ${filesChanged}${DRY_RUN ? " (dry-run)" : ""}`);
  console.log(`Failed            : ${results.failed.length}`);
  console.log(`Missing (skipped) : ${results.missing.length}\n`);

  if (results.fixed.length > 0) {
    console.log("------ Fixed References ------\n");
    results.fixed.forEach((f, i) => {
      console.log(`${i + 1}. ${path.relative(PROJECT_ROOT, f.sourceFile)}:${f.line}`);
      console.log(`   Old: ${f.old}`);
      console.log(`   New: ${f.new}\n`);
    });
  }

  if (results.failed.length > 0) {
    console.log("------ Failed to write ------\n");
    results.failed.forEach((f) => {
      console.log(`✗ ${path.relative(PROJECT_ROOT, f.sourceFile)} → ${f.error}`);
    });
    console.log("");
  }

  if (results.missing.length > 0) {
    console.log("------ Missing files (not auto-fixed) ------\n");
    results.missing.slice(0, 30).forEach((m, i) => {
      console.log(
        `${i + 1}. ${path.relative(PROJECT_ROOT, m.sourceFile)}:${m.lineNumber}`
      );
      console.log(`   ${m.reference}`);
      console.log(
        `   Expected: ${path.relative(PROJECT_ROOT, m.expectedPath)}\n`
      );
    });

    if (results.missing.length > 30) {
      console.log(`... and ${results.missing.length - 30} more missing references\n`);
    }
  }

  if (DRY_RUN) {
    console.log("💡 This was a dry-run. Run without --dry-run to apply changes.\n");
  } else {
    console.log("✅ Done! Case mismatches have been fixed in source files.\n");
  }
}

// ====================== MAIN ======================

scan();
applyFixes();

if (results.caseMismatch.length > 0 || results.missing.length > 0) {
  process.exitCode = 1;
}