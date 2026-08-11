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
 * Next.js / React - Aggressive Case Sensitivity Auto-Fixer
 * Fixes wrong casing in imports of images, css, fonts, videos etc.
 *
 * Usage:
 *   node fix-case-assets.js              → real fix
 *   node fix-case-assets.js --dry-run    → only show changes
 *   node fix-case-assets.js --verbose    → detailed logs
 */

const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = process.cwd();
const DRY_RUN = process.argv.includes("--dry-run");
const VERBOSE = process.argv.includes("--verbose");

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
  "public", // we still resolve / paths into public, but don't scan public as source
]);

const SOURCE_EXTENSIONS = new Set([
  ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs",
  ".css", ".scss", ".sass", ".less",
  ".html", ".mdx",
]);

const STATIC_EXTENSIONS = [
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico", ".bmp", ".avif",
  ".mp4", ".webm", ".mov", ".avi", ".mkv",
  ".mp3", ".wav", ".ogg", ".m4a",
  ".woff", ".woff2", ".ttf", ".otf", ".eot",
  ".css", ".scss", ".sass", ".less",
  ".json",
];

// ========== HELPERS ==========

function getAllSourceFiles(dir, list = []) {
  if (!fs.existsSync(dir)) return list;

  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return list;
  }

  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name) || entry.name.startsWith(".")) continue;

    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      getAllSourceFiles(full, list);
    } else if (SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      list.push(full);
    }
  }
  return list;
}

/**
 * Walk the filesystem and return the real path with correct casing.
 * Works correctly even on Windows (case-insensitive FS).
 */
function getRealPath(inputPath) {
  const absolute = path.resolve(inputPath);
  const root = path.parse(absolute).root;

  let current = root;
  const parts = path.relative(root, absolute).split(path.sep).filter(Boolean);

  for (const part of parts) {
    if (!fs.existsSync(current)) return null;

    let entries;
    try {
      entries = fs.readdirSync(current);
    } catch {
      return null;
    }

    // exact match first
    let found = entries.find((e) => e === part);
    if (!found) {
      // case-insensitive match
      found = entries.find((e) => e.toLowerCase() === part.toLowerCase());
    }

    if (!found) return null;
    current = path.join(current, found);
  }

  return current;
}

function getBaseUrl() {
  for (const name of ["jsconfig.json", "tsconfig.json"]) {
    const p = path.join(PROJECT_ROOT, name);
    if (!fs.existsSync(p)) continue;
    try {
      const cfg = JSON.parse(fs.readFileSync(p, "utf8"));
      if (cfg.compilerOptions?.baseUrl) {
        return path.resolve(PROJECT_ROOT, cfg.compilerOptions.baseUrl);
      }
    } catch {}
  }
  // common Next.js / src structure
  if (fs.existsSync(path.join(PROJECT_ROOT, "src"))) {
    return path.join(PROJECT_ROOT, "src");
  }
  return PROJECT_ROOT;
}

const BASE_URL = getBaseUrl();

/**
 * Resolve an import string to absolute path candidates
 */
function resolveCandidates(ref, sourceFile) {
  let clean = ref.trim().split("?")[0].split("#")[0];

  // skip remote / data / packages
  if (
    clean.startsWith("http://") ||
    clean.startsWith("https://") ||
    clean.startsWith("//") ||
    clean.startsWith("data:") ||
    clean.startsWith("blob:")
  ) {
    return [];
  }

  // skip pure package imports (no relative, no @/, no /)
  if (
    !clean.startsWith(".") &&
    !clean.startsWith("@/") &&
    !clean.startsWith("/") &&
    !clean.startsWith("~/")
  ) {
    return [];
  }

  let base;

  if (clean.startsWith("@/")) {
    base = path.join(BASE_URL, clean.slice(2));
  } else if (clean.startsWith("~/")) {
    base = path.join(PROJECT_ROOT, clean.slice(2));
  } else if (clean.startsWith("/")) {
    // public folder
    base = path.join(PROJECT_ROOT, "public", clean.slice(1));
  } else {
    // relative
    base = path.resolve(path.dirname(sourceFile), clean);
  }

  const candidates = [base];

  // if no extension, try common static extensions
  if (!path.extname(base)) {
    for (const ext of STATIC_EXTENSIONS) {
      candidates.push(base + ext);
    }
    // also try index files
    candidates.push(path.join(base, "index.js"));
    candidates.push(path.join(base, "index.jsx"));
    candidates.push(path.join(base, "index.ts"));
    candidates.push(path.join(base, "index.tsx"));
  }

  return candidates;
}

/**
 * Build the corrected import string keeping original style
 */
function buildCorrectedRef(originalRef, sourceFile, realAbsolutePath) {
  const clean = originalRef.trim().split("?")[0].split("#")[0];

  if (clean.startsWith("@/")) {
    const rel = path.relative(BASE_URL, realAbsolutePath).split(path.sep).join("/");
    return "@/" + rel;
  }

  if (clean.startsWith("~/")) {
    const rel = path.relative(PROJECT_ROOT, realAbsolutePath).split(path.sep).join("/");
    return "~/" + rel;
  }

  if (clean.startsWith("/")) {
    const rel = path
      .relative(path.join(PROJECT_ROOT, "public"), realAbsolutePath)
      .split(path.sep)
      .join("/");
    return "/" + rel;
  }

  // relative
  let rel = path
    .relative(path.dirname(sourceFile), realAbsolutePath)
    .split(path.sep)
    .join("/");

  if (!rel.startsWith(".") && !path.isAbsolute(rel)) {
    rel = "./" + rel;
  }
  return rel;
}

/**
 * Extract all possible path-like strings from file content
 * (very aggressive)
 */
function extractAllPossibleRefs(content) {
  const found = new Set();

  // 1. classic import / export from
  const importRe =
    /(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?["'`]([^"'`]+)["'`]/g;

  // 2. require()
  const requireRe = /require\s*\(\s*["'`]([^"'`]+)["'`]\s*\)/g;

  // 3. dynamic import()
  const dynImportRe = /import\s*\(\s*["'`]([^"'`]+)["'`]\s*\)/g;

  // 4. css url()
  const cssUrlRe = /url\s*\(\s*['"]?([^'")\s]+)['"]?\s*\)/g;

  // 5. src= href= poster= etc (jsx / html)
  const attrRe =
    /(?:src|href|poster|data-src|data-image|data-bg|content)\s*=\s*['"`]([^'"`]+)['"`]/gi;

  // 6. Next.js Image / any object with src: "..."
  const srcPropRe = /(?:src|url|image|poster|backgroundImage)\s*:\s*['"`]([^'"`]+)['"`]/gi;

  // 7. template literals that look like paths (basic)
  const templateRe = /[`'"](\.?\.?\/?@?\/?[\w\-./]+\.(?:png|jpe?g|gif|webp|svg|ico|mp4|webm|woff2?|ttf|otf|eot|css|scss))[`'"]/gi;

  const regexes = [
    importRe,
    requireRe,
    dynImportRe,
    cssUrlRe,
    attrRe,
    srcPropRe,
    templateRe,
  ];

  for (const re of regexes) {
    let m;
    while ((m = re.exec(content)) !== null) {
      const val = m[1].trim();
      if (val && val.length > 1) {
        found.add(val);
      }
    }
  }

  return [...found];
}

function getLineNumber(content, str) {
  const idx = content.indexOf(str);
  if (idx === -1) return "?";
  return content.slice(0, idx).split("\n").length;
}

// ========== MAIN SCAN + FIX ==========

const fixed = [];
const missing = [];
const skipped = [];
const filesModified = new Set();

function processFile(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch {
    return;
  }

  const originalContent = content;
  const refs = extractAllPossibleRefs(content);

  let fileChanged = false;

  // longer refs first to avoid partial replace issues
  refs.sort((a, b) => b.length - a.length);

  for (const ref of refs) {
    const candidates = resolveCandidates(ref, filePath);
    if (candidates.length === 0) continue;

    let realPath = null;
    let matchedCandidate = null;

    for (const cand of candidates) {
      const real = getRealPath(cand);
      if (real) {
        realPath = real;
        matchedCandidate = cand;
        break;
      }
    }

    if (!realPath) {
      // only report if it looks like a static asset
      const lower = ref.toLowerCase();
      if (
        STATIC_EXTENSIONS.some((ext) => lower.endsWith(ext)) ||
        lower.includes("/assets/") ||
        lower.includes("/images/") ||
        lower.includes("/img/") ||
        lower.includes("/public/")
      ) {
        missing.push({
          file: filePath,
          line: getLineNumber(content, ref),
          ref,
        });
      }
      continue;
    }

    // Check if casing is different
    const requestedNorm = path.resolve(matchedCandidate);
    const realNorm = path.resolve(realPath);

    // Compare the relative paths as strings (this catches casing differences)
    const reqRel = path.relative(PROJECT_ROOT, requestedNorm);
    const realRel = path.relative(PROJECT_ROOT, realNorm);

    if (reqRel === realRel) {
      // exact match already
      continue;
    }

    // casing is different → fix it
    const corrected = buildCorrectedRef(ref, filePath, realPath);

    if (!corrected || corrected === ref) {
      skipped.push({ file: filePath, ref, reason: "could not build corrected path" });
      continue;
    }

    // Now replace in content carefully
    // We replace the exact string that appeared in the source
    const before = content;

    // Try all common quote styles
    const variants = [
      [`"${ref}"`, `"${corrected}"`],
      [`'${ref}'`, `'${corrected}'`],
      [`\`${ref}\``, `\`${corrected}\``],
      // unquoted (css url etc)
      [ref, corrected],
    ];

    let replaced = false;
    for (const [oldStr, newStr] of variants) {
      if (content.includes(oldStr)) {
        // replace all occurrences
        content = content.split(oldStr).join(newStr);
        replaced = true;
      }
    }

    if (replaced && content !== before) {
      fileChanged = true;
      fixed.push({
        file: filePath,
        line: getLineNumber(originalContent, ref),
        old: ref,
        new: corrected,
      });

      if (VERBOSE) {
        console.log(`  ✓ ${path.relative(PROJECT_ROOT, filePath)}`);
        console.log(`      ${ref}`);
        console.log(`   →  ${corrected}\n`);
      }
    }
  }

  if (fileChanged && content !== originalContent) {
    filesModified.add(filePath);
    if (!DRY_RUN) {
      try {
        fs.writeFileSync(filePath, content, "utf8");
      } catch (err) {
        console.error(`Failed to write ${filePath}:`, err.message);
      }
    }
  }
}

// ========== RUN ==========

console.log("\n==============================================");
console.log("  Aggressive Case-Sensitivity Auto Fixer");
console.log("==============================================\n");

if (DRY_RUN) console.log("🔍 DRY-RUN mode (no files will be written)\n");

console.log(`Project root : ${PROJECT_ROOT}`);
console.log(`Base URL     : ${BASE_URL}\n`);

const files = getAllSourceFiles(PROJECT_ROOT);
console.log(`Scanning ${files.length} source files...\n`);

for (const file of files) {
  processFile(file);
}

// ========== REPORT ==========

console.log("\n==============================================");
console.log("                 RESULTS");
console.log("==============================================\n");

console.log(`Files scanned        : ${files.length}`);
console.log(`Case mismatches fixed: ${fixed.length}`);
console.log(`Files modified       : ${filesModified.size}${DRY_RUN ? " (dry-run)" : ""}`);
console.log(`Missing assets       : ${missing.length}`);
console.log(`Skipped              : ${skipped.length}\n`);

if (fixed.length > 0) {
  console.log("---------- FIXED ----------\n");
  fixed.forEach((f, i) => {
    console.log(`${i + 1}. ${path.relative(PROJECT_ROOT, f.file)}:${f.line}`);
    console.log(`   Old → ${f.old}`);
    console.log(`   New → ${f.new}\n`);
  });
}

if (missing.length > 0) {
  console.log("---------- MISSING (not fixed) ----------\n");
  // show max 50
  missing.slice(0, 50).forEach((m, i) => {
    console.log(`${i + 1}. ${path.relative(PROJECT_ROOT, m.file)}:${m.line}`);
    console.log(`   ${m.ref}\n`);
  });
  if (missing.length > 50) {
    console.log(`... and ${missing.length - 50} more\n`);
  }
}

if (DRY_RUN) {
  console.log("💡 Dry-run finished. Run without --dry-run to apply changes.\n");
} else {
  console.log("✅ Done.\n");
}

if (fixed.length > 0 || missing.length > 0) {
  process.exitCode = 1;
}