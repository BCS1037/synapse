/// <reference lib="es2015" />
import { getPrefRaw } from "../utils/prefs.js";
/*
 * PlaceholderResolver 占位符解析器
 *
 * 职责（中文）：
 *  - 从 Zotero 条目中提取元数据（标题、作者、年份、URL、集合、标签、附件等）。
 *  - 将数据归一化为模板可消费的上下文对象。
 *
 * Responsibilities (English):
 *  - Extract metadata from a Zotero item (title, creators, year, url, collections, tags, attachments, etc.).
 *  - Normalize data into a context object consumable by templates.
 */

// 避免类型报错（运行时由宿主提供）
// Avoid type errors; provided by host at runtime

declare const Zotero: any;

export class PlaceholderResolver {
  /**
   * 从条目解析模板上下文对象
   * Resolve context object from Zotero item
   */
  static async resolve(item: any): Promise<Record<string, any>> {
    if (!item || !item.isRegularItem?.()) return {};

    const title =
      (item.getField?.("title", false, true) as string) || `item-${item.id}`;
    const creators =
      (await (item as any).getCreators?.()) || item.getCreators?.() || [];
    // 改进：优先过滤出作者（author），若无则回退到全部创作者；支持 name 或 firstName/lastName
    let creatorsFiltered: any[] = Array.isArray(creators) ? creators : [];
    const authorsOnly = creatorsFiltered.filter(
      (c: any) => String(c?.creatorType || "").toLowerCase() === "author",
    );
    if (authorsOnly.length > 0) creatorsFiltered = authorsOnly;

    const authorsArr: string[] = creatorsFiltered
      .map((c: any) => {
        const nameRaw =
          typeof c?.name === "string" && c.name.trim()
            ? c.name.trim()
            : [c?.firstName, c?.lastName]
                .map((s: any) => (typeof s === "string" ? s.trim() : ""))
                .filter(Boolean)
                .join(" ");
        return nameRaw;
      })
      .filter((s: any) => typeof s === "string" && s.trim());
    const authorSingle: string = authorsArr.length > 0 ? authorsArr[0] : "";
    const url = (item.getField?.("url", false, true) as string) || "";
    const year = PlaceholderResolver._extractYear(item);
    // 新增：引文键（citekey）/ Added: citation key
    const citekey = PlaceholderResolver._getCitekey(item);

    const collections = await PlaceholderResolver._getCollectionNames(item);
    // 新增：单一集合名（与 frontmatter 字段 `collection` 对应）；若无集合则为空字符串
    // Added: single collection name to support singular 'collection' field in frontmatter
    const collection = collections.length > 0 ? collections[0] : "";

    const tags = PlaceholderResolver._getTags(item);
    const attachments = await PlaceholderResolver._getAttachments(item);

    // 新增：DOI 字段，兼容大小写键名（Zotero 通常使用 'DOI'），并标准化为 https://doi.org/ 链接
    let doi = "";
    try {
      let doiRaw: string =
        (item.getField?.("DOI", false, true) as string) ||
        (item.getField?.("doi", false, true) as string) ||
        "";
      if (typeof doiRaw !== "string") doiRaw = "";
      doiRaw = doiRaw.trim();
      if (doiRaw) {
        // 去除前缀 "doi:"，并在非 URL 的情况下添加 https://doi.org/
        const stripped = doiRaw.replace(/^doi:\s*/i, "");
        if (/^https?:\/\//i.test(stripped)) {
          doi = stripped;
        } else if (/^10\.\S+/i.test(stripped)) {
          doi = `https://doi.org/${stripped}`;
        } else {
          doi = stripped; // 无法识别时，保持原样
        }
      }
    } catch {
      doi = "";
    }

    // 新增：原始日期与期刊/出版物标题，兼容模板中的 {{date}} 与 {{publicationTitle}}
    const dateRaw: string =
      (item.getField?.("date", false, true) as string) || "";
    const publicationTitle: string =
      (item.getField?.("publicationTitle", false, true) as string) || "";
    // 新增：摘要字段 / Add abstractNote field
    const abstractNote: string =
      (item.getField?.("abstractNote", false, true) as string) || "";

    // 获取云库与本地库占位符内容 / Get cloud and local library placeholder content
    let localLibrary = "";
    let cloudLibrary = "";
    try {
      const key: string = item.key;
      const libID: number = item.libraryID;
      // 判断是否群组库 / Determine if group library
      let isGroup = false;
      try {
        const userLibID = (Zotero as any).Libraries?.userLibraryID;
        if (typeof userLibID === "number") {
          isGroup = libID !== userLibID;
        } else {
          isGroup = typeof libID === "number" && libID > 1;
        }
      } catch {
        isGroup = typeof libID === "number" && libID > 1;
      }

      // 生成本地选择链接 / Build local select link
      localLibrary = isGroup
        ? `zotero://select/groups/${libID}/items/${key}`
        : `zotero://select/library/items/${key}`;

      // 生成云端链接 / Build cloud link
      if (isGroup) {
        cloudLibrary = `https://www.zotero.org/groups/${libID}/items/${key}`;
      } else {
        const userID = (Zotero as any).Users?.getCurrentUserID?.();
        if (typeof userID === "number") {
          cloudLibrary = `https://www.zotero.org/users/${userID}/items/${key}`;
        }
      }
    } catch {
      // ignore
    }
    // 回退到用户首选项（若自动生成失败）/ Fallback to user prefs if auto-generation failed
    if (!localLibrary)
      localLibrary = String(getPrefRaw("placeholder.localLibrary") || "");
    if (!cloudLibrary)
      cloudLibrary = String(getPrefRaw("placeholder.cloudLibrary") || "");

    // 获取 Zotero 条目的创建与修改时间 / Get item creation and modification dates
    const created = item.dateAdded
      ? new Date(item.dateAdded).toISOString().split("T")[0]
      : "";
    const updated = item.dateModified
      ? new Date(item.dateModified).toISOString().split("T")[0]
      : "";

    // 新增：PDF 附件链接（zotero://open-pdf/...）
    const pdfAttachments: string[] =
      await PlaceholderResolver._getPdfLinks(item);

    return {
      key: item.key,
      libraryID: item.libraryID,
      itemType: item.itemType,
      title,
      url,
      year,
      authors: authorsArr,
      author: authorSingle, // 单作者（第一作者）；Single author (first author)
      citekey, // 引文键 / citation key
      collections,
      collection, // 单一集合名；Singular form for convenience in frontmatter
      tags,
      attachments,
      doi, // 规范化后的 DOI 链接 / normalized DOI link
      DOI: doi, // 兼容模板中使用大写 {{DOI}} 的占位符
      date: dateRaw, // 原始日期字符串 / raw date string
      publicationTitle, // 期刊或出版物标题 / journal or publication title
      publication: publicationTitle, // 别名：publication / alias for convenience
      abstractNote, // 摘要内容 / abstract content
      localLibrary, // 本地库占位符内容 / local library placeholder content
      cloudLibrary, // 云库占位符内容 / cloud library placeholder content
      created, // 创建日期 YYYY-MM-DD / creation date YYYY-MM-DD
      updated, // 更新日期 YYYY-MM-DD / modification date YYYY-MM-DD
      pdfAttachments, // PDF 链接数组 / array of zotero://open-pdf links
    };
  }

  private static _extractYear(item: any): string {
    // year from "date" field if available, using a simple regex for YYYY
    const date: string = item.getField?.("date", false, true) || "";
    const match = /\b(\d{4})\b/.exec(date);
    return match ? match[1] : "";
  }

  /**
   * 尝试获取引文键：
   * 1) 直接读取 citationKey 字段（若 Better BibTeX 或其他插件提供）
   * 2) 从 extra 字段解析 "Citation Key:"、"citation key:"、"citekey:" 等格式
   * Try to get citation key from explicit field or the Extra field.
   */
  private static _getCitekey(item: any): string {
    try {
      const direct: string | undefined = item.getField?.(
        "citationKey",
        false,
        true,
      );
      if (direct && typeof direct === "string" && direct.trim()) {
        return direct.trim();
      }
    } catch {
      // ignore
    }
    try {
      const extra: string = item.getField?.("extra", false, true) || "";
      if (extra) {
        const m =
          /(?:^|\n)\s*(?:Citation Key|citation key|citekey)\s*:\s*(\S+)/.exec(
            extra,
          );
        if (m && m[1]) return m[1].trim();
      }
    } catch {
      // ignore
    }
    return "";
  }

  private static async _getCollectionNames(item: any): Promise<string[]> {
    try {
      const api = (Zotero as any).Collections;
      if (!api) return [];
      const result = await api.getCollectionsContainingItems?.([item.id]);
      let parentIds: number[] = [];
      if (Array.isArray(result)) {
        parentIds = result as number[];
      } else if (result && typeof result === "object") {
        // 兼容 Zotero 某些版本返回 { [itemID]: number[] } 的情况
        const ids =
          (result as any)[item.id] ?? (result as any)[String(item.id)];
        if (Array.isArray(ids)) parentIds = ids as number[];
      }
      // 回退：尝试使用非数组 API 或早期/后期版本的接口名
      if (!Array.isArray(parentIds) || parentIds.length === 0) {
        const fallback = await (api as any).getCollectionsContainingItem?.(
          item.id,
        );
        if (Array.isArray(fallback)) parentIds = fallback as number[];
      }
      if (!Array.isArray(parentIds) || parentIds.length === 0) return [];

      const names: string[] = [];
      for (const cid of parentIds) {
        try {
          const c = await (Zotero as any).Collections.getAsync(cid);
          if (c?.name) names.push(c.name);
        } catch {
          // ignore individual failures
        }
      }
      return names;
    } catch {
      return [];
    }
  }

  private static _getTags(item: any): string[] {
    try {
      const tags = item.getTags?.() || [];
      return Array.isArray(tags)
        ? tags
            .map((t: any) => t.tag)
            .filter((s: any) => typeof s === "string" && s.trim())
        : [];
    } catch {
      return [];
    }
  }

  private static async _getAttachments(
    item: any,
  ): Promise<Array<{ id: number; title: string; path?: string }>> {
    const results: Array<{ id: number; title: string; path?: string }> = [];
    try {
      const ids: number[] = await item.getAttachments?.();
      if (!Array.isArray(ids)) return results;
      for (const id of ids) {
        const att = await (Zotero as any).Items.getAsync(id);
        if (!att) continue;
        const title = att.getField?.("title", false, true) || "";
        let path: string | undefined;
        try {
          path = att.getFilePath?.();
        } catch (e) {
          // 忽略无法获取文件路径的错误；某些附件可能没有本地文件
          // Ignore errors when retrieving file path; some attachments may have no local file
          void e; // no-op to satisfy linter
        }
        results.push({ id, title, path });
      }
      return results;
    } catch {
      return results;
    }
  }

  // 生成 PDF 打开链接（zotero://open-pdf/...）
  private static async _getPdfLinks(item: any): Promise<string[]> {
    const links: string[] = [];
    try {
      const ids: number[] = await item.getAttachments?.();
      if (!Array.isArray(ids)) return links;
      for (const id of ids) {
        const att = await (Zotero as any).Items.getAsync(id);
        if (!att) continue;
        // 判定是否为 PDF
        let isPDF = false;
        try {
          const mime =
            (att as any).attachmentMIMEType ||
            att.getField?.("mimeType", false, true) ||
            "";
          if (typeof mime === "string" && /pdf/i.test(mime)) isPDF = true;
        } catch {
          // ignore
        }
        if (!isPDF) {
          try {
            const fp = att.getFilePath?.();
            if (typeof fp === "string" && /\.pdf$/i.test(fp)) isPDF = true;
          } catch {
            // ignore
          }
        }
        if (!isPDF) continue;

        const libID = att.libraryID ?? item.libraryID;
        const key = att.key;
        if (!key) continue;
        // 判断是否群组库
        let isGroup = false;
        try {
          const userLibID = (Zotero as any).Libraries?.userLibraryID;
          if (typeof userLibID === "number") {
            isGroup = libID !== userLibID;
          } else {
            isGroup = typeof libID === "number" && libID > 1;
          }
        } catch {
          isGroup = typeof libID === "number" && libID > 1;
        }
        const link = isGroup
          ? `zotero://open-pdf/groups/${libID}/items/${key}`
          : `zotero://open-pdf/library/items/${key}`;
        links.push(link);
      }
    } catch {
      // ignore
    }
    return links;
  }
}
