/* eslint-env node */
/* global console, process */
// Post-build cleanup script
// Purpose: Remove any leftover standalone template DOM references accidentally injected into the built bundle.
// 作用：构建后清理遗留的 standalone 模板相关代码，避免无用 DOM 查询与潜在副作用。
// Cross-platform: Node.js ESM script, no shell-specific behavior.

import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  try {
    // Load addonRef from package.json (ESM context)
    const pkgPath = path.resolve(__dirname, "../package.json");
    const pkgRaw = await fs.readFile(pkgPath, "utf8");
    const pkg = JSON.parse(pkgRaw);
    const addonRef = pkg?.config?.addonRef || "mdnotes";

    const bundlePath = path.resolve(
      __dirname,
      `../.scaffold/build/addon/content/scripts/${addonRef}.js`,
    );

    let content;
    try {
      content = await fs.readFile(bundlePath, "utf8");
    } catch (e) {
      // Bundle not found; nothing to do.
      console.warn(
        "[postbuild-clean] Bundle not found, skip:",
        bundlePath,
        e?.message,
      );
      return;
    }

    const beforeLen = content.length;

    // Regex rules:
    // 1) Remove any lines referencing template-standalone selectors
    // 2) Remove declarations/assignments of standaloneTplInput variables
    // 3) Remove demo comments or single-line comments containing Addon Template/插件模板
    // 4) Remove block comments that contain Addon Template/插件模板
    // 5) Tidy up duplicate blank lines
    const patterns = [
      // Match lines containing the standalone selector (literal or templated)
      /^[ \t]*[^\n]*zotero-prefpane-[^\n]*template-standalone[^\n]*;[ \t]*\n/gm,
      // Match var/let/const standaloneTplInput declarations
      /^[ \t]*(?:var|let|const)[ \t]+standaloneTplInput[ \t]*=[^\n]*;[ \t]*\n/gm,
      // Match plain assignments to standaloneTplInput
      /^[ \t]*standaloneTplInput[ \t]*=[^\n]*;[ \t]*\n/gm,
      // Remove single-line comments with demo phrases
      /^[ \t]*\/\/[^\n]*(?:Addon Template|插件模板)[^\n]*\n/gm,
    ];

    for (const re of patterns) {
      content = content.replace(re, "");
    }

    // Remove block comments containing demo phrases (JSDoc/examples)
    content = content.replace(
      /\/\*[^]*?(?:Addon Template|插件模板)[^]*?\*\//gm,
      "",
    );

    // As a final safeguard, strip leftover demo phrases inside quotes
    content = content.replace(/Addon Template/g, "");
    content = content.replace(/插件模板/g, "");

    // Collapse multiple consecutive blank lines to at most two
    content = content.replace(/\n{3,}/g, "\n\n");

    const afterLen = content.length;
    if (afterLen !== beforeLen) {
      await fs.writeFile(bundlePath, content, "utf8");
      console.log(
        `[postbuild-clean] Cleaned ${beforeLen - afterLen} bytes from ${path.basename(
          bundlePath,
        )}`,
      );
    } else {
      console.log("[postbuild-clean] No standalone residues found.");
    }
  } catch (err) {
    console.error("[postbuild-clean] Failed:", err?.message || err);
    if (typeof process !== "undefined") process.exitCode = 1;
  }
}

run();
