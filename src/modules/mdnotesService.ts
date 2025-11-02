/// <reference lib="es2015" />
/*
 * MdnotesService
 *
 * 简介（中文）：
 *  - 本服务封装 Mdnotes 的核心操作：创建/更新 mdnotes 文件。
 *  - 经过重构，简化了文件创建逻辑，以修复潜在的无限循环问题，并专注于与 Obsidian 的集成。
 *
 * Overview (English):
 *  - This service encapsulates the core operation of Mdnotes: creating/updating mdnotes files.
 *  - Refactored to simplify file creation logic, fix potential infinite loops, and focus on Obsidian integration.
 */

// 声明全局 Zotero，避免类型检查报错（运行时由宿主提供）
// Declare global Zotero for type-checking; runtime provided by host
declare const Zotero: any;
declare const ztoolkit: any;
// 插件全局对象（来自脚手架），用于读取配置与显示消息等
// Addon global object for accessing config and showing notifications
declare const addon: any;

import { getPrefRaw, getBoolPref } from "../utils/prefs.js";
import { TemplateEngine } from "./template.js";

export class MdnotesService {
  // 防重入标记：避免并发执行导致的卡顿/死锁
  // Reentrancy guard to avoid overlapping executions
  private static busy = false;

  /**
   * 非阻塞通知（Toast）：使用 ztoolkit.ProgressWindow
   * Non-blocking toast notification using ProgressWindow
   */
  private static toast(
    text: string,
    opts: {
      type?: "success" | "warning" | "error" | "default";
      ms?: number;
    } = {},
  ) {
    try {
      const type = opts.type ?? "default";
      const ms = typeof opts.ms === "number" ? opts.ms : 2600;
      const title = addon?.data?.config?.addonName || "Mdnotes";
      const win = new ztoolkit.ProgressWindow(title, {
        closeOnClick: true,
        closeTime: -1,
      })
        .createLine({ text, type, progress: 100 })
        .show();
      win.startCloseTimer(ms);
    } catch (e) {
      // 兜底：若 ProgressWindow 不可用，降级到控制台日志
      // Fallback to console log
      try {
        ztoolkit.log(text);
      } catch {
        /* ignore */
      }
    }
  }

  /**
   * Create or update the mdnotes file attached/related to the given item.
   * 为单个条目创建或更新 mdnotes 文件。
   */
  static async createMdnotesFile(item?: any) {
    if (MdnotesService.busy) {
      MdnotesService.toast(
        "Another export is in progress. 请稍候，正在处理上一个导出任务…",
        { type: "warning" },
      );
      return;
    }

    if (!item || !item.isRegularItem?.()) {
      MdnotesService.toast(
        "Please select a regular item.\n请选择一个常规条目。",
        { type: "warning" },
      );
      return;
    }

    MdnotesService.busy = true;
    try {
      const exportDirPref = String(getPrefRaw("directory") || "");
      const exportDir = await this.ensureExportDir(exportDirPref);
      if (!exportDir) return;

      // 简化文件名计算逻辑
      const fileName = await this.computeFileName(item);

      const { content } = await this.generateMarkdownForItem(item);
      const filePath = await this.safeJoinPath(exportDir, fileName);
      // 不在正文中追加任何 URI/标识，保持内容纯净，遵从模板/Frontmatter 输出
      const finalContent = content;
      await this.writeFile(filePath, finalContent);

      // 在 I/O 操作之后让出事件循环，提升 UI 响应
      // Yield to the event loop after I/O
      try {
        await Zotero.Promise.delay(0);
      } catch {
        /* ignore */
      }

      // 当启用 create_notes_file 时，为避免重复，仅保留“链接到 URL（file:///）”的子附件；
      // 因此跳过“链接的文件（linked file）”附件创建。
      // When create_notes_file is enabled, skip creating the linked file attachment to avoid duplication;
      // keep only the child URL attachment (file:///).
      const createNotes = getBoolPref("create_notes_file", false);
      const attach = getBoolPref("attach_to_zotero", false) && !createNotes;
      if (attach) {
        await this.attachLinkedFile(item, filePath);
      }

      // 再次让出事件循环
      try {
        await Zotero.Promise.delay(0);
      } catch {
        /* ignore */
      }

      // 导出后根据偏好在条目下创建子笔记/URL 附件（若启用）
      // Create child note/URL attachment after export when enabled
      if (createNotes) {
        await this.createChildNoteForExport(item, filePath, fileName);
      }

      MdnotesService.toast(
        `Mdnotes file created/updated:\n${filePath}\nMdnotes 文件已创建/更新`,
        { type: "success" },
      );
    } catch (e) {
      ztoolkit.log("createMdnotesFile failed", e);
      MdnotesService.toast("Failed to create mdnotes file. 创建文件失败。", {
        type: "error",
      });
      throw e;
    } finally {
      MdnotesService.busy = false;
    }
  }




  // ===================== Helpers | 工具函数 =====================

  /**
   * 统一的文件名计算逻辑：优先使用用户定义的模板渲染，失败或为空时回退旧逻辑。
   * Unified filename computation: prefer user-defined template; fallback to legacy behavior.
   */
  private static async computeFileName(item: any): Promise<string> {
    // 1) Try filename template
    const template = String(getPrefRaw("filename.template") || "");
    if (template) {
      try {
        const raw = await TemplateEngine.renderStringForItem(template, item);
        const normalized = this.normalizeFileName(raw || "");
        const ensured = this.ensureMdExtension(normalized);
        if (ensured) return ensured;
      } catch (e) {
        // 模板渲染失败则记录日志并走回退逻辑 / Log and fallback on failure
        ztoolkit.log("Filename template rendering failed", e);
      }
    }

    // 2) Fallback
    const title =
      (item?.getField?.("title", false, true) as string) ||
      (item ? `item-${item.id}` : "Untitled");

    const suffix = String(getPrefRaw("files.mdnotes.hub.suffix") || "");
    const prefix = String(getPrefRaw("files.mdnotes.hub.prefix") || "");
    return this.ensureMdExtension(
      this.normalizeFileName(`${prefix}${title}${suffix}`),
    );
  }

  /**
   * Generate simple Markdown content for an item. Will be replaced by template engine.
   * 为条目生成简要 Markdown 内容。后续由模板引擎替换。
   */
  private static async generateMarkdownForItem(
    item: any,
    templateName?: string,
  ): Promise<{ fileName: string; content: string }> {
    // 使用统一文件名计算逻辑（zotero 模式）/ Use unified filename logic
    const fileName = await this.computeFileName(item);

    const title =
      (item.getField("title", false, true) as string) || `item-${item.id}`;
    const creators =
      (await (item as any).getCreators?.()) || item.getCreators?.() || [];
    const authors = Array.isArray(creators)
      ? creators
          .map((c: any) => [c.firstName, c.lastName].filter(Boolean).join(" "))
          .filter(Boolean)
          .join(", ")
      : "";
    const url = (item.getField("url", false, true) as string) || "";

    // Use TemplateEngine to render Markdown content based on template & placeholders
    // 使用模板引擎生成 Markdown 内容（占位符+模板）
    let content = "";
    try {
      content = await TemplateEngine.renderItemToMarkdown(
        item,
        templateName ? { templateName } : {},
      );
    } catch (e) {
      ztoolkit.log(
        "TemplateEngine rendering failed, fallback to basic content",
        e,
      );
      const lines: string[] = [];
      // 最小化回退内容：仅标题，避免重复的标题/作者/URL/插件标识
      // Minimal fallback: only title to avoid duplicate title/authors/URL/plugin identifiers
      lines.push(`# ${title}`);
      content = lines.join("\n");
    }

    return { fileName, content };
  }

  /**
   * Normalize file name to be cross-platform safe.
   * 归一化文件名，跨平台安全。
   */
  private static normalizeFileName(name: string): string {
    // 替换常见非法字符 / Replace common illegal characters
    return (name || "").replace(/[\\/:*?"<>|]/g, "_").trim();
  }

  /** 确保 .md 扩展名 / Ensure .md extension */
  private static ensureMdExtension(name: string): string {
    if (!name) return "";
    const lower = name.toLowerCase();
    return lower.endsWith(".md") ? name : `${name}.md`;
  }

  /** 去掉扩展名，常用于生成标题 / Strip extension for display */
  private static stripExtension(name: string): string {
    if (!name) return name;
    return name.replace(/\.[^.]+$/, "");
  }

  /**
   * Ensure export directory is available: return pref if set; otherwise prompt user to select one and save preference.
   * 确保导出目录可用：若已设置则直接返回；否则提示用户选择并写回偏好。
   */
  private static async ensureExportDir(
    prefDir: string,
  ): Promise<string | null> {
    const dir = (prefDir || "").trim();
    if (!dir) {
      // 不在此处打开文件选择器，以避免从上下文菜单触发的模态对话框导致 Zotero 8 UI 卡死
      // Do NOT open a FilePicker here to avoid UI freeze from modal dialogs triggered via context menus in Zotero 8
      MdnotesService.toast(
        "Please set the export directory first: Preferences → Mdnotes → Export Directory.\n请先在“偏好设置→Mdnotes→导出目录”中设置导出文件夹。",
        { type: "warning" },
      );
      return null;
    }

    try {
      await this.ensureDirRecursive(dir);
      // 使用 IOUtils.stat 检查目录类型；若不可用，视为已确保目录
      // Use IOUtils.stat to verify directory; if unavailable, assume ensured
      try {
        const IOUtils = ztoolkit.getGlobal("IOUtils");
        if (IOUtils?.stat) {
          const stats = await IOUtils.stat(dir);
          const isDir =
            stats &&
            ((stats as any).isDir === true ||
              (stats as any).type === "directory");
          if (!isDir) {
            throw new Error(
              `Export path exists but is not a directory: ${dir}`,
            );
          }
        }
      } catch (_) {
        // 忽略 stat 不可用或检查失败（在 ensureDirRecursive 成功情况下通常无碍）
      }
      return dir;
    } catch (e) {
      ztoolkit.log(
        `ensureExportDir: Failed to create or access directory ${dir}`,
        e,
      );
      const msg = (e as Error)?.message || "Unknown error";
      MdnotesService.toast(
        `Failed to create or access export directory:\n${dir}\n${msg}\n建议：请确认上级目录存在且当前用户对该路径有写权限。`,
        { type: "error" },
      );
      return null;
    }
  }

  /**
   * Ensure directory exists, creating ancestors as needed using best-available API.
   * 递归保证目录存在：优先使用 IOUtils.makeDirectory(createAncestors)，否则（仅当可用时）逐级创建。
   */
  private static async ensureDirRecursive(dir: string): Promise<void> {
    const d = (dir || "").trim();
    if (!d) throw new Error("Empty directory path");

    // 优先使用 IOUtils（Zotero 7/8 基于 Gecko 的异步 I/O）
    try {
      const IOUtils = ztoolkit.getGlobal("IOUtils");
      if (IOUtils?.makeDirectory) {
        // mode: 0o755 for typical user-writable directories
        await IOUtils.makeDirectory(d, { createAncestors: true, mode: 0o755 });
        return;
      }
    } catch (_) {
      // ignore and check fallback
    }

    // 回退到 OS.File（仅当存在时）：逐级创建缺失的子目录
    try {
      const OS = ztoolkit.getGlobal("OS");
      if (OS?.File?.makeDir && OS?.File?.stat) {
        const PathUtils =
          ztoolkit.getGlobal("PathUtils") ||
          (ztoolkit.getGlobal as any)("PathUtils");

        const exists = async (p: string) => {
          try {
            await OS.File.stat(p);
            return true;
          } catch {
            return false;
          }
        };

        const parentOf = (p: string): string => {
          try {
            if (PathUtils?.parent) return PathUtils.parent(p);
          } catch (_) {
            // ignore
          }
          const norm = String(p).replace(/[\\/]+$/, "");
          const idx = Math.max(norm.lastIndexOf("/"), norm.lastIndexOf("\\"));
          return idx > 0 ? norm.slice(0, idx) : norm;
        };

        const stack: string[] = [];
        let cur = d;
        while (true) {
          if (await exists(cur)) break;
          stack.push(cur);
          const parent = parentOf(cur);
          if (!parent || parent === cur) break;
          cur = parent;
        }

        for (let i = stack.length - 1; i >= 0; i--) {
          const p = stack[i];
          try {
            await OS.File.makeDir(p, { ignoreExisting: true });
          } catch (e) {
            try {
              const st = await OS.File.stat(p);
              if (!(st as any).isDir) throw e;
            } catch (_) {
              throw e;
            }
          }
        }
        return;
      }
    } catch (_) {
      // ignore and throw below
    }

    throw new Error(
      "Failed to ensure directory: no supported I/O API available (IOUtils/OS.File)",
    );
  }

  /**
   * Join directory and file name in a cross-platform way.
   * 跨平台拼接目录与文件名。
   */
  private static async safeJoinPath(
    dir: string,
    fileName: string,
  ): Promise<string> {
    try {
      const PathUtils =
        ztoolkit.getGlobal("PathUtils") ||
        (ztoolkit.getGlobal as any)("PathUtils");
      if (PathUtils?.join) return PathUtils.join(dir, fileName);
    } catch (e) {
      // ignore, fallback below / 忽略，走下方回退
    }
    const sep = "/"; // Zotero 内部通常使用 POSIX 风格拼接 / Typically POSIX style
    return `${dir.replace(/[\\/]+$/, "")}${sep}${fileName.replace(/^[/\\]+/, "")}`;
  }

  /**
   * Write text content to file path.
   * 写入文本内容到文件。
   */
  private static async writeFile(path: string, content: string): Promise<void> {
    try {
      // 优先使用 IOUtils 写入（Zotero 7/8 推荐）
      const IOUtils = ztoolkit.getGlobal("IOUtils");
      if (IOUtils?.writeUTF8) {
        await IOUtils.writeUTF8(path, content, { tmpPath: path + ".tmp" });
        return;
      }
      if (IOUtils?.write) {
        const encoder = new TextEncoder();
        await IOUtils.write(path, encoder.encode(content), {
          tmpPath: path + ".tmp",
        });
        return;
      }
    } catch (e) {
      // 进入回退分支前记录一次日志
      ztoolkit.log(`writeFile via IOUtils failed for ${path}`, e);
    }

    try {
      const OS = ztoolkit.getGlobal("OS");
      if (OS?.File?.writeAtomic) {
        await OS.File.writeAtomic(path, content, {
          encoding: "utf-8",
          tmpPath: path + ".tmp",
        });
        return;
      }
    } catch (e) {
      ztoolkit.log(`writeFile via OS.File failed for ${path}`, e);
    }

    // 若无可用 API，则抛出错误
    const err = new Error(
      "writeFile: No supported I/O API available (IOUtils/OS.File)",
    );
    ztoolkit.log(String(err));
    MdnotesService.toast(`Failed to write file:\n${path}`, { type: "error" });
    throw err;
  }

  /**
   * Attach a linked file to Zotero item.
   * 将生成的文件以链接附件的形式附加到 Zotero 条目。
   */
  private static async attachLinkedFile(item: any, filePath: string) {
    try {
      // Prefer Zotero.Attachments.linkFromFile in Zotero 7/8
      // 优先使用 Zotero 7/8 提供的 Attachments.linkFromFile API
      const title =
        this.stripExtension(filePath.split(/[\\/]/).pop() || "") || "Mdnotes";
      if ((Zotero as any).Attachments?.linkFromFile) {
        await (Zotero as any).Attachments.linkFromFile({
          file: filePath,
          parentItemID: item.id,
          title,
        });
        return;
      }
      // Fallback to legacy helper
      // 回退：旧版可能提供 Items.addLinkedFileFromPath
      if ((Zotero as any).Items?.addLinkedFileFromPath) {
        await (Zotero as any).Items.addLinkedFileFromPath(item, filePath);
        return;
      }
      throw new Error("No API to attach linked file found");
    } catch (e) {
      ztoolkit.log("attachLinkedFile failed", e);
    }
  }

  /**
   * Create a child linked-URL attachment that points to the exported Markdown file or Obsidian URI.
   * 在条目下创建一个“链接到 URL”的子附件，指向导出的 Markdown 文件或 Obsidian URI（受偏好控制）。
   *
   * 说明：Zotero 7/8 推荐使用 Zotero.Attachments.linkFromURL 创建“链接到 URI”的附件；
   * 若运行环境不支持，则回退为创建子笔记，内容中包含可点击的链接。
   */
  private static async createChildNoteForExport(
    item: any,
    filePath: string,
    fileName: string,
  ) {
    try {
      // 始终仅创建一个“链接到 URL（file:///）”的子附件，避免重复与混淆
      // Always create ONLY one child URL attachment pointing to file:/// to avoid duplication
      const useObsidian = false; // 强制不创建 obsidian:// 附件；保留逻辑以备后续扩展

      // Build file URL (file:///)
      // 构建本地文件 URL（file:///）
      let fileURL = "";
      try {
        if ((Zotero as any).File?.pathToFileURI) {
          fileURL = (Zotero as any).File.pathToFileURI(filePath);
        } else {
          const p = String(filePath || "");
          fileURL = p.startsWith("/") ? `file://${p}` : `file:///${p}`;
        }
      } catch (e) {
        const p = String(filePath || "");
        fileURL = p.startsWith("/") ? `file://${p}` : `file:///${p}`;
      }

      // Build Obsidian URI when enabled
      // 若启用偏好，则构建 Obsidian URI
      const obsidianHref = ""; // 不再创建 obsidian:// URL 附件

      const display = this.stripExtension(fileName) || fileName;

      // 仅创建一个“链接到 URL”子附件：指向本地 Markdown 文件（file:///）
      // Create only ONE child "link to URL" attachment pointing to the Markdown file (file:///)
      if ((Zotero as any).Attachments?.linkFromURL) {
        await (Zotero as any).Attachments.linkFromURL({
          url: fileURL,
          parentItemID: item.id,
          title: `${display}`,
        });
        return;
      }

      // Fallback: create a child note containing both links (if available)
      // 回退：创建子笔记，在内容中包含两个链接（若启用 Obsidian 则包含其链接）
      const linkParts: string[] = [
        `<a href="${fileURL}">${display}</a>`,
      ];
      const noteHtml = `<!-- mdnotes:link --><p><strong>Mdnotes</strong>: ${linkParts.join(
        "",
      )}</p>`;
      const note = new (Zotero as any).Item("note");
      note.parentID = item.id;
      note.setNote(noteHtml);
      if (typeof note.saveTx === "function") {
        await note.saveTx();
      } else if (typeof note.save === "function") {
        await note.save();
      }
    } catch (e) {
      ztoolkit.log("createChildNoteForExport failed", e);
    }
  }

  /**
   * Optionally append Obsidian URI depending on prefs
   * 根据偏好可选附加 Obsidian URI
   */
}
