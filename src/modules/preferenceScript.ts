import pkg from "../../package.json" with { type: "json" };
import { getString } from "../utils/locale.js";
import { getPref, getPrefRaw, setPref, setPrefRaw } from "../utils/prefs.js";

const config = (pkg as any).config as {
  addonName: string;
  addonID: string;
  addonRef: string;
  addonInstance: string;
  prefsPrefix: string;
};

// 初始化并注册首选项 UI 交互脚本 / Initialize and register preferences UI scripts
export function registerPrefsScripts(win: Window) {
  // Called when the prefs window is opened / 当偏好窗口打开时调用
  // 与 hooks.ts 的 onPrefsEvent(load) 配合使用
  if (!addon.data.prefs) {
    addon.data.prefs = { window: win } as any;
  } else {
    addon.data.prefs.window = win;
  }

  // 初始化 UI 值并绑定事件 / Initialize values and bind events
  initPrefsUI();
  bindPrefEvents();
}

/**
 * Initialize preferences UI values from stored prefs
 * 从已存储的偏好中初始化 UI
 */
function initPrefsUI() {
  const win = addon.data.prefs?.window as Window | undefined;
  if (!win) return;

  // Directory path input / 目录路径输入框
  const dirInput = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-directory`,
  );
  if (dirInput) {
    dirInput.value = (getPref("directory") as string) || "";
  }
  // Templates directory input / 模板目录输入框
  const tplDirInput = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-templates-dir`,
  );
  if (tplDirInput) {
    tplDirInput.value = (getPref("templates.directory") as string) || "";
  }

  // HTML → Markdown / HTML 转 Markdown
  const htmlStrong = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-html-strong`,
  );
  if (htmlStrong) {
    htmlStrong.checked = !!getPrefRaw("html.strong");
  }
  const htmlEm = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-html-em`,
  );
  if (htmlEm) {
    htmlEm.checked = !!getPrefRaw("html.em");
  }
  const htmlStrike = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-html-strikethrough`,
  );
  if (htmlStrike) {
    htmlStrike.checked = !!getPrefRaw("html.strikethrough");
  }
  const htmlUnderline = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-html-underline`,
  );
  if (htmlUnderline) {
    htmlUnderline.checked = !!getPrefRaw("html.underline");
  }
  const htmlBullet = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-html-bullet`,
  );
  if (htmlBullet) {
    htmlBullet.checked = !!getPrefRaw("html.bullet");
  }

  // Obsidian integration / Obsidian 集成
  const obsidianAttachUri = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-obsidian-attach-uri`,
  );
  if (obsidianAttachUri) {
    // 使用 getPrefRaw 读取未在类型映射声明的键 / Use getPrefRaw for undeclared keys
    obsidianAttachUri.checked = !!getPrefRaw("obsidian.attach_obsidian_uri");
  }
  const obsidianBlockIds = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-obsidian-block-ids`,
  );
  if (obsidianBlockIds) {
    obsidianBlockIds.checked = !!getPrefRaw("obsidian.block_ids");
  }
  // 已移除 obsidian.blocks 与 obsidian.blocks.use_citekey 初始化逻辑
  const obsidianVault = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-obsidian-vault`,
  );
  if (obsidianVault) {
    // obsidian.vault 可能未在 PluginPrefsMap 中声明，改用 Raw 版本
    obsidianVault.value = (getPrefRaw("obsidian.vault") as string) || "";
  }
  const obsidianDir = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-obsidian-dir`,
  );
  if (obsidianDir) {
    obsidianDir.value = (getPrefRaw("obsidian.dir") as string) || "";
  }

  // Query default template input in this scope / 在本作用域查询默认模板输入框
  const tplNameInput = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-template-default`,
  );
  if (tplNameInput) {
    tplNameInput.value = (getPref("template.default") as string) || "";
  }
  // Manual typing for default template file name / 允许手动输入默认模板文件名
  tplNameInput?.addEventListener("input", (ev: Event) => {
    const el = ev.currentTarget as HTMLInputElement;
    setPref("template.default", el.value || "default.md");
  });

  // Manual typing for file name template / 允许手动输入文件名模板
  const fileNameTplInput = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-filename-template`,
  );
  if (fileNameTplInput) {
    fileNameTplInput.value = (getPrefRaw("filename.template") as string) || "";
  }
  fileNameTplInput?.addEventListener("input", (ev: Event) => {
    const el = ev.currentTarget as HTMLInputElement;
    setPrefRaw("filename.template", el.value || "");
  });

  // Standalone template 已在 4.3.0 移除，此处保留历史说明，避免误加回
  // 原 standalone 模板输入框 (#template-standalone) 与事件监听器已删除

  // Standalone prefix/suffix / 独立文件名前后缀（已移除）
  // const standalonePrefixInput = win.document.querySelector<HTMLInputElement>(
  //   `#zotero-prefpane-${config.addonRef}-standalone-prefix`,
  // );
  // standalonePrefixInput?.addEventListener("input", (ev: Event) => {
  //   const el = ev.currentTarget as HTMLInputElement;
  //   setPrefRaw("files.mdnotes.standalone.prefix", el.value || "");
  // });
  // const standaloneSuffixInput = win.document.querySelector<HTMLInputElement>(
  //   `#zotero-prefpane-${config.addonRef}-standalone-suffix`,
  // );
  // standaloneSuffixInput?.addEventListener("input", (ev: Event) => {
  //   const el = ev.currentTarget as HTMLInputElement;
  //   setPrefRaw("files.mdnotes.standalone.suffix", el.value || "");
  // });
}

/**
 * Bind UI events for preferences interactions
 * 绑定偏好交互事件
 */
function bindPrefEvents() {
  const win = addon.data.prefs?.window as Window | undefined;
  if (!win) return;

  // Choose directory button / 选择目录按钮
  const chooseBtn = win.document.querySelector(
    `#zotero-prefpane-${config.addonRef}-choose-dir`,
  );
  const dirInput = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-directory`,
  );
  chooseBtn?.addEventListener("command", async () => {
    try {
      const picker = new ztoolkit.FilePicker("Select Directory", "folder");
      const path = await picker.open();
      if (path) {
        await setPref("directory", path);
        if (dirInput) dirInput.value = path;
      }
    } catch (e) {
      ztoolkit.getGlobal("alert")(
        `${getString("startup-finish")}\nPick directory failed: ${(e as Error).message}`,
      );
    }
  });
  // Allow manual typing to set export directory / 允许手动输入导出目录
  dirInput?.addEventListener("input", (ev: Event) => {
    const el = ev.currentTarget as HTMLInputElement;
    setPref("directory", el.value || "");
  });

  // Choose templates directory button / 选择模板目录按钮
  const chooseTplBtn = win.document.querySelector(
    `#zotero-prefpane-${config.addonRef}-choose-templates-dir`,
  );
  const tplDirInput = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-templates-dir`,
  );
  chooseTplBtn?.addEventListener("command", async () => {
    try {
      const picker = new ztoolkit.FilePicker(
        "Select Templates Directory",
        "folder",
      );
      const path = await picker.open();
      if (path) {
        await setPref("templates.directory", path);
        if (tplDirInput) tplDirInput.value = path;
      }
    } catch (e) {
      ztoolkit.getGlobal("alert")(
        `Pick templates directory failed: ${(e as Error).message}`,
      );
    }
  });
  // Allow manual typing to set templates directory / 允许手动输入模板目录
  tplDirInput?.addEventListener("input", (ev: Event) => {
    const el = ev.currentTarget as HTMLInputElement;
    setPref("templates.directory", el.value || "");
  });

  // HTML → Markdown / HTML 转 Markdown
  const htmlStrong = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-html-strong`,
  );
  htmlStrong?.addEventListener("command", (ev: Event) => {
    const el = ev.currentTarget as HTMLInputElement;
    setPrefRaw("html.strong", !!el.checked);
  });
  const htmlEm = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-html-em`,
  );
  htmlEm?.addEventListener("command", (ev: Event) => {
    const el = ev.currentTarget as HTMLInputElement;
    setPrefRaw("html.em", !!el.checked);
  });
  const htmlStrike = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-html-strikethrough`,
  );
  htmlStrike?.addEventListener("command", (ev: Event) => {
    const el = ev.currentTarget as HTMLInputElement;
    setPrefRaw("html.strikethrough", !!el.checked);
  });
  const htmlUnderline = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-html-underline`,
  );
  htmlUnderline?.addEventListener("command", (ev: Event) => {
    const el = ev.currentTarget as HTMLInputElement;
    setPrefRaw("html.underline", !!el.checked);
  });
  const htmlBullet = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-html-bullet`,
  );
  htmlBullet?.addEventListener("command", (ev: Event) => {
    const el = ev.currentTarget as HTMLInputElement;
    setPrefRaw("html.bullet", !!el.checked);
  });

  // Obsidian integration / Obsidian 集成
  const obsidianAttachUri = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-obsidian-attach-uri`,
  );
  obsidianAttachUri?.addEventListener("command", (ev: Event) => {
    const el = ev.currentTarget as HTMLInputElement;
    setPrefRaw("obsidian.attach_obsidian_uri", !!el.checked);
  });
  const obsidianBlockIds = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-obsidian-block-ids`,
  );
  obsidianBlockIds?.addEventListener("command", (ev: Event) => {
    const el = ev.currentTarget as HTMLInputElement;
    setPrefRaw("obsidian.block_ids", !!el.checked);
  });
  // 已移除 obsidian.blocks 与 obsidian.blocks.use_citekey 事件绑定
  const obsidianVault = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-obsidian-vault`,
  );
  obsidianVault?.addEventListener("input", (ev: Event) => {
    const el = ev.currentTarget as HTMLInputElement;
    setPrefRaw("obsidian.vault", el.value || "");
  });
  const obsidianDir = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-obsidian-dir`,
  );
  obsidianDir?.addEventListener("input", (ev: Event) => {
    const el = ev.currentTarget as HTMLInputElement;
    setPrefRaw("obsidian.dir", el.value || "");
  });

  // Query default template input in this scope / 在本作用域查询默认模板输入框
  const tplNameInput = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-template-default`,
  );
  // Manual typing for default template file name / 允许手动输入默认模板文件名
  tplNameInput?.addEventListener("input", (ev: Event) => {
    const el = ev.currentTarget as HTMLInputElement;
    setPref("template.default", el.value || "default.md");
  });

  // Manual typing for file name template / 允许手动输入文件名模板
  const fileNameTplInput = win.document.querySelector<HTMLInputElement>(
    `#zotero-prefpane-${config.addonRef}-filename-template`,
  );
  if (fileNameTplInput) {
    fileNameTplInput.value = (getPrefRaw("filename.template") as string) || "";
  }
  fileNameTplInput?.addEventListener("input", (ev: Event) => {
    const el = ev.currentTarget as HTMLInputElement;
    setPrefRaw("filename.template", el.value || "");
  });

  // Standalone template 已在 4.3.0 移除，此处保留历史说明，避免误加回
  // 原 standalone 模板输入框 (#template-standalone) 与事件监听器已删除

  // Standalone prefix/suffix / 独立文件名前后缀（已移除）
  // const standalonePrefixInput = win.document.querySelector<HTMLInputElement>(
  //   `#zotero-prefpane-${config.addonRef}-standalone-prefix`,
  // );
  // standalonePrefixInput?.addEventListener("input", (ev: Event) => {
  //   const el = ev.currentTarget as HTMLInputElement;
  //   setPrefRaw("files.mdnotes.standalone.prefix", el.value || "");
  // });
  // const standaloneSuffixInput = win.document.querySelector<HTMLInputElement>(
  //   `#zotero-prefpane-${config.addonRef}-standalone-suffix`,
  // );
  // standaloneSuffixInput?.addEventListener("input", (ev: Event) => {
  //   const el = ev.currentTarget as HTMLInputElement;
  //   setPrefRaw("files.mdnotes.standalone.suffix", el.value || "");
  // });
}

// 该脚本挂接到首选项面板，负责初始化与保存 UI 与偏好值
// This script hooks into Preferences panel to initialize and persist UI <-> prefs

declare const window: any;

type HTMLElementLike = any;

export async function onPrefsEvent(
  ev: "load" | "unload",
  ctx: { window: Window },
) {
  if (ev === "load") {
    // 初始化模板与目录
    const tplDirInput = ctx.window.document.getElementById(
      "zotero-prefpane-__addonRef__-templates-dir",
    ) as HTMLInputElement;
    if (tplDirInput) {
      tplDirInput.value = (getPref("templates.directory") as string) || "";
      tplDirInput.addEventListener("change", (e: any) => {
        const el = e.target as HTMLInputElement;
        setPref("templates.directory", el.value || "");
      });
    }

    // 删除：Obsidian 块 ID 相关初始化与事件
    // const obsidianBlocks = ctx.window.document.getElementById(
    //   "zotero-prefpane-__addonRef__-obsidian-blocks",
    // ) as HTMLInputElement;
    // const obsidianBlocksCitekey = ctx.window.document.getElementById(
    //   "zotero-prefpane-__addonRef__-obsidian-blocks-use-citekey",
    // ) as HTMLInputElement;

    // 默认模板文件名 / default template file name
    const defaultTplInput = ctx.window.document.getElementById(
      "zotero-prefpane-__addonRef__-template-default",
    ) as HTMLInputElement;
    if (defaultTplInput) {
      defaultTplInput.value = (getPrefRaw("template.default") as string) || "";
      defaultTplInput.addEventListener("change", (e: any) => {
        const el = e.target as HTMLInputElement;
        setPref("template.default", el.value || "default.md");
      });
    }

    // 文件名模板
    const fileNameTplInput = ctx.window.document.getElementById(
      "zotero-prefpane-__addonRef__-filename-template",
    ) as HTMLInputElement;
    if (fileNameTplInput) {
      fileNameTplInput.value =
        (getPrefRaw("filename.template") as string) || "";
      fileNameTplInput.addEventListener("change", (e: any) => {
        const el = e.target as HTMLInputElement;
        setPref("filename.template", el.value || "");
      });
    }

    // 独立文件名前后缀绑定移除
    // Removed runtime standalone prefix/suffix bindings
    // const standalonePrefix = ... (deleted)
    // const standaloneSuffix = ... (deleted)

    // Frontmatter 偏好：开关、格式、字段
    // Frontmatter prefs: enabled, format, fields
    const fmEnabled = ctx.window.document.getElementById(
      "zotero-prefpane-__addonRef__-frontmatter-enabled",
    ) as HTMLInputElement;
    if (fmEnabled) {
      fmEnabled.checked = !!getPrefRaw("frontmatter.enabled");
      fmEnabled.addEventListener("change", (e: any) => {
        const el = e.target as HTMLInputElement;
        setPrefRaw("frontmatter.enabled", !!el.checked);
      });
    }

    const fmFormat = ctx.window.document.getElementById(
      "zotero-prefpane-__addonRef__-frontmatter-format",
    ) as HTMLSelectElement;
    if (fmFormat) {
      fmFormat.value = (getPrefRaw("frontmatter.format") as string) || "yaml";
      fmFormat.addEventListener("change", (e: any) => {
        const el = e.target as HTMLSelectElement;
        setPrefRaw("frontmatter.format", (el.value || "yaml").toLowerCase());
      });
    }

    const fmFields = ctx.window.document.getElementById(
      "zotero-prefpane-__addonRef__-frontmatter-fields",
    ) as HTMLInputElement;
    if (fmFields) {
      const raw =
        (getPrefRaw("frontmatter.fields") as string) ||
        "title,authors,year,tags,DOI,URL,publication,localLibrary,cloudLibrary";
      // 运行时过滤 collections / Filter 'collections' at load time
      fmFields.value = raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((s) => s.toLowerCase() !== "collections")
        .join(",");
      fmFields.addEventListener("change", (e: any) => {
        const el = e.target as HTMLInputElement;
        const cleaned = (el.value || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .filter((s) => s.toLowerCase() !== "collections")
          .join(",");
        setPrefRaw("frontmatter.fields", cleaned);
      });
    }
  }
}

// Frontmatter format initialization: restrict to YAML only
(function ensureYamlOnly() {
  try {
    const mainWin = (Zotero as any)?.getMainWindow?.();
    const prefsWin = (addon as any)?.data?.prefs?.window as any;
    const doc =
      mainWin?.document ||
      prefsWin?.document ||
      (typeof window !== "undefined" ? window.document : undefined);
    if (!doc) return;
    const list: any = doc.getElementById(
      "zotero-prefpane-__addonRef__-frontmatter-format",
    );
    if (list && list.menupopup) {
      // Remove all non-yaml menuitems if present
      const items = Array.from(list.menupopup.children || []);
      items.forEach((el: any) => {
        const val = el?.getAttribute?.("value");
        if (val && val.toLowerCase() !== "yaml") {
          el.remove?.();
        }
      });
      // Ensure value is yaml if something else was stored
      const pref = (Zotero as any)?.Prefs?.get?.(
        "extensions.__addonRef__.frontmatter.format",
      );
      if (pref && pref !== "yaml") {
        (Zotero as any)?.Prefs?.set?.(
          "extensions.__addonRef__.frontmatter.format",
          "yaml",
        );
      }
      if (list.value !== "yaml") list.value = "yaml";
    }
  } catch (e) {
    // noop
  }
})();
