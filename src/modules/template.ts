import { getByPath } from "../utils/object.js";
import { getPrefRaw, getBoolPref } from "../utils/prefs.js";
import { PlaceholderResolver } from "./placeholder.js";
import { htmlToMarkdown } from "../utils/htmlToMarkdown.js";
import shajs from "sha.js";

declare const Zotero: any;
declare const ztoolkit: any;

export class TemplateEngine {
  private static instance: TemplateEngine;
  private templateCache: Map<string, string>;

  private constructor() {
    this.templateCache = new Map();
  }

  public static getInstance(): TemplateEngine {
    if (!TemplateEngine.instance) {
      TemplateEngine.instance = new TemplateEngine();
    }
    return TemplateEngine.instance;
  }

  /**
   * Render an inline template string against a Zotero item.
   * 渲染内联模板字符串（非文件）。
   */
  public static async renderStringForItem(
    template: string,
    item: any,
  ): Promise<string> {
    const engine = TemplateEngine.getInstance();
    const context = await engine.buildItemContext(item);
    // 兼容文件名模板中的简写占位符（例如 {{title}}、{{year}}），将 item 层拍平到根；同时保留原有 context.item
    // Compatibility: flatten item-level context to root for filename templates while keeping original context.item
    const flatContext: Record<string, any> = {
      ...context,
      ...(context.item ?? {}),
    };
    return engine.interpolate(template, flatContext);
  }

  /**
   * Render an item to Markdown by loading a template file and adding YAML frontmatter (if enabled).
   * 通过加载模板文件渲染为 Markdown，并在启用时添加 YAML frontmatter。
   */
  public static async renderItemToMarkdown(
    item: any,
    options: { templateName?: string } = {},
  ): Promise<string> {
    const engine = TemplateEngine.getInstance();
    const context = await engine.buildItemContext(item);
    const template = await engine.loadTemplate(options.templateName);
    // 扁平化上下文：将 item 字段提升到根，兼容模板中的 {{title}}、{{year}} 等简写占位符
    // Flatten context: lift item fields to root to support short placeholders like {{title}}
    const flatContext: Record<string, any> = {
      ...context,
      ...(context.item ?? {}),
    };
    let content = engine.interpolate(template, flatContext);
    // 先追加 Frontmatter，再按偏好附加 Obsidian 块 ID
    // Add frontmatter first, then append Obsidian block IDs based on preference
    content = engine.addFrontmatter(content, flatContext);
    content = engine.addObsidianBlockIDsIfEnabled(content);
    return content;
  }

  /** 判断是否为绝对路径（跨平台 Windows/macOS/Linux） */
  private isAbsolutePath(p: string): boolean {
    return /^(?:[a-zA-Z]:[\\/]|\/.+)/.test(p);
  }

  /** 简单拼接目录与文件名（使用 POSIX 风格，避免依赖外部 API） */
  private joinPath(dir: string, file: string): string {
    const d = (dir || "").replace(/[\\/]+$/, "");
    const f = (file || "").replace(/^[\\/]+/, "");
    return `${d}/${f}`;
  }

  /**
   * Load template content by name.
   * 支持：
   * 1) 在“默认模板文件名/独立模板文件名”中直接填写绝对路径
   * 2) 否则从“模板目录 + 文件名”组合计算
   * 若均不可用，则回退到内置的极简模板
   */
  private async loadTemplate(templateName?: string): Promise<string> {
    const name = templateName || "default";
    if (this.templateCache.has(name)) {
      return this.templateCache.get(name)!;
    }

    // 读取模板文件名与目录（支持绝对路径）
    // Read template file name and directory (supports absolute path)
    const configuredName = String(getPrefRaw("template.default") || "default.md");
    const configuredDir = String(getPrefRaw("templates.directory") || "");
    let path = configuredName;
    if (!this.isAbsolutePath(configuredName) && configuredDir) {
      path = this.joinPath(configuredDir, configuredName);
    }

    // 尝试读取模板文件；失败则回退内置模板
    try {
      const content = await this.readFileUTF8(path);
      if (typeof content === "string" && content.trim().length > 0) {
        this.templateCache.set(name, content);
        return content;
      }
    } catch (e) {
      try {
        ztoolkit.log(`Failed to read template file: ${path}`, e);
      } catch {
        /* ignore */
      }
    }

    const fallback = this.getFallbackTemplate();
    this.templateCache.set(name, fallback);
    return fallback;
  }

  /** 读取 UTF-8 文本文件（优先 IOUtils，回退 OS.File） */
  private async readFileUTF8(path: string): Promise<string> {
    if (!path) throw new Error("Empty template path");
    // IOUtils.readUTF8 (Zotero 7/8)
    try {
      const IOUtils = (ztoolkit as any).getGlobal?.("IOUtils") || (ztoolkit as any).getGlobal?.("IOUtils");
      if (IOUtils?.readUTF8) {
        return await IOUtils.readUTF8(path);
      }
      if (IOUtils?.read) {
        const decoder = new TextDecoder();
        const bytes = await IOUtils.read(path);
        return decoder.decode(bytes);
      }
    } catch (_) {
      // ignore and try fallback
    }
    // OS.File.read (legacy fallback)
    try {
      const OS = (ztoolkit as any).getGlobal?.("OS");
      if (OS?.File?.read) {
        const bytes = await OS.File.read(path);
        // 可能返回字符串或字节
        if (typeof bytes === "string") return bytes;
        const decoder = new TextDecoder();
        return decoder.decode(bytes as any);
      }
    } catch (_) {
      // ignore
    }
    throw new Error("No API to read file (IOUtils/OS.File) or read failed");
  }

  private getFallbackTemplate(): string {
    return [
      "---",
      "title: {{ item.title }}",
      "year: {{ item.year }}",
      "collections: {{ item.collections|list }}",
      "tags: {{ item.tags|list }}",
      "doi: {{ item.DOI }}",
      "---",
      "",
      "# {{ item.title }}",
      "",
      "> {{ item.abstractNote|md }}",
      "",
      "## Notes",
      "",
      "{{ item.notes|md }}",
    ].join("\n");
  }

  private async buildItemContext(item: any): Promise<Record<string, any>> {
    // 解析层：统一由 PlaceholderResolver 产生上下文对象（元数据/集合/标签/附件/引文键等）
    // Parse layer: normalize item metadata for templates
    const base = await PlaceholderResolver.resolve(item);

    // 追加笔记内容，并将 Zotero 的 HTML 笔记转换为 Markdown
    // Append notes content converted from Zotero HTML to Markdown
    let notesMD = "";
    try {
      const notes = item?.getNotes?.() || [];
      const htmls: string[] = [];
      for (const noteID of notes) {
        const note = await Zotero.Items.getAsync(noteID);
        const html = await note?.getNote?.();
        if (typeof html === "string" && html.trim()) htmls.push(html);
      }
      notesMD = htmlToMarkdown(htmls.join("\n\n"));
    } catch {
      notesMD = "";
    }

    const ctx: Record<string, any> = {};
    ctx.item = { ...base, notes: notesMD };
    return ctx;
  }

  private interpolate(template: string, context: Record<string, any>): string {
    // 支持 {{ path.to.value }} 与过滤器 |md / |list
    // Support path + filters |md and |list
    return template.replace(
      /{{\s*([^}|\s]+(?:\.[^}|\s]+)*)(\|[^}\s]+)?\s*}}/g,
      (_m, path, filter) => {
        const raw = getByPath(context, String(path).trim());
        let out: string = "";
        if (filter && String(filter).includes("md")) {
          out = htmlToMarkdown(raw == null ? "" : String(raw));
        } else if (filter && String(filter).includes("list")) {
          if (Array.isArray(raw)) {
            out = raw
              .map((v) => (v == null ? "" : String(v)))
              .filter((s) => s.length > 0)
              .join(", ");
          } else if (raw != null) {
            // 单值也安全输出 / Fallback for non-array values
            out = String(raw);
          } else {
            out = "";
          }
        } else {
          out = raw == null ? "" : String(raw);
        }
        return out;
      },
    );
  }

  private hasYamlFrontmatter(content: string): boolean {
    const lines = content.split(/\r?\n/);
    if (lines.length >= 3 && lines[0].trim() === "---") {
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === "---") return true;
        if (lines[i].startsWith("#")) break; // 提前退出：遇到一级标题时说明没有 frontmatter
      }
    }
    return false;
  }

  private readField(context: Record<string, any>, field: string): any {
    return getByPath(context, field);
  }

  private addFrontmatter(
    content: string,
    context: Record<string, any>,
  ): string {
    // 修正键名：frontmatter.enabled（而非 frontmatter.enable）
    const enabled = getBoolPref("frontmatter.enabled", true);
    if (!enabled || this.hasYamlFrontmatter(content)) return content;

    const front: Record<string, any> = {};
    const fields = String(getPrefRaw("frontmatter.fields") || "").split(
      /\s*,\s*/,
    );
    for (const f of fields) {
      if (!f) continue;
      const value = this.readField(context, f);
      if (Array.isArray(value)) {
        front[f.split(".").pop() || f] = value;
      } else if (value != null) {
        front[f.split(".").pop() || f] = String(value);
      }
    }

    // 如果字段列表为空，则默认输出若干常用字段 / Default fields when none specified
    if (Object.keys(front).length === 0) {
      front.title = context.item?.title || "";
      front.year = context.item?.year || "";
      front.collections = context.item?.collections || [];
      front.tags = context.item?.tags || [];
      front.doi = context.item?.DOI || "";
    }

    const yaml = this.yamlStringify(front);
    return `---\n${yaml}\n---\n\n${content}`;
  }

  private addObsidianBlockIDsIfEnabled(content: string): string {
    // 按用户要求禁用 Obsidian 块 ID 追加逻辑。
    // Disable Obsidian block IDs regardless of preference to avoid adding ^hash in exported files.
    return content;
  }

  private computeBlockIdForLine(line: string): string | null {
    const s = this.normalizeLineForHash(line);
    if (!s) return null;
    const hash = shajs("sha1").update(s).digest("hex");
    // 取前 8 位作为短 ID，兼容 Obsidian / Use first 8 chars for short ID
    return hash.slice(0, 8);
  }

  private normalizeLineForHash(s: string): string {
    let t = s || "";
    // 去除 Markdown 行内代码、链接、图片等的特殊符号 / Strip common MD symbols
    t = t.replace(/`[^`]*`/g, "");
    t = t.replace(/!\[[^\]]*\]\([^)]*\)/g, "");
    t = t.replace(/\[[^\]]*\]\([^)]*\)/g, "");

    // 强调/删除线/下划线标记：*, _, ~
    t = t.replace(/[*_~]/g, "");

    // 折叠空白并转小写
    t = t.replace(/\s+/g, " ").toLowerCase().trim();

    return t;
  }

  /** 简单 YAML 序列化（仅键值与列表） */
  private yamlStringify(obj: Record<string, any>): string {
    const lines: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) {
        lines.push(`${key}: ""`);
        continue;
      }

      if (Array.isArray(value)) {
        if (value.length > 0) {
          lines.push(`${key}:`);
          for (const v of value) {
            lines.push(`  - ${this._yamlEscape(String(v))}`);
          }
        } else {
          lines.push(`${key}: []`);
        }
      } else if (typeof value === "object") {
        // 简化：对象使用 JSON 字符串表示，避免复杂嵌套结构
        lines.push(`${key}: ${this._yamlEscape(JSON.stringify(value))}`);
      } else {
        lines.push(`${key}: ${this._yamlEscape(String(value))}`);
      }
    }
    return lines.join("\n");
  }

  private _yamlEscape(str: string): string {
    // 简单 YAML 转义：用引号包裹并替换内部引号
    const s = String(str ?? "");
    if (s === "" || /[:\-?{}[\],&*#%!@`]|^\s|\s$|\n/.test(s)) {
      return '"' + s.replace(/"/g, '\\"') + '"';
    }
    return s;
  }
}
