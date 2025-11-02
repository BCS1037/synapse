/*
 * htmlToMarkdown utility
 *
 * 中文简介：
 *  - 使用 Turndown 将 HTML 文本转换为 Markdown；
 *  - 根据用户偏好（extensions.mdnotes.html.*）启用/禁用特定样式规则；
 *  - 提供健壮降级策略：当 Turndown 不可用或出错时，回退为去标签的纯文本。
 *
 * English overview:
 *  - Convert HTML to Markdown via Turndown;
 *  - Toggle specific formatting rules by preferences (extensions.mdnotes.html.*);
 *  - Robust fallback: strip tags when Turndown is unavailable or throws.
 */

// turndown 在本项目中通过 ambient 声明提供类型最小支持（typings/global.d.ts）
// Under NodeNext with CJS package, default import works at runtime; types are ambient.
import Turndown from "turndown";
import { getBoolPref } from "./prefs.js";

/**
 * Build a Turndown instance configured per user preferences.
 * 根据用户偏好构建 Turndown 实例。
 */
function buildTurndown() {
  // bulletListMarker: true -> '-' | false -> '*'
  const bulletEnabled = getBoolPref("html.bullet", true);
  const service = new (Turndown as any)({
    headingStyle: "atx", // # H1 style
    hr: "---",
    bulletListMarker: bulletEnabled ? "-" : "*",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    strongDelimiter: "**",
  });

  // Read rule toggles
  const strongEnabled = getBoolPref("html.strong", false);
  const emEnabled = getBoolPref("html.em", false);
  const strikeEnabled = getBoolPref("html.strikethrough", false);
  const underlineEnabled = getBoolPref("html.underline", false);

  // Strong / Bold
  service.addRule("mdnotes-strong", {
    filter: ["strong", "b"],
    replacement: (content: string) =>
      strongEnabled ? `**${content}**` : content,
  });

  // Emphasis / Italic
  service.addRule("mdnotes-em", {
    filter: ["em", "i"],
    replacement: (content: string) => (emEnabled ? `*${content}*` : content),
  });

  // Strikethrough
  service.addRule("mdnotes-strike", {
    filter: ["s", "del", "strike"],
    replacement: (content: string) =>
      strikeEnabled ? `~~${content}~~` : content,
  });

  // Underline (Markdown has no native underline; preserve as HTML or strip)
  service.addRule("mdnotes-underline", {
    filter: ["u"],
    replacement: (content: string) =>
      underlineEnabled ? `<u>${content}</u>` : content,
  });

  return service;
}

/**
 * Convert HTML string to Markdown string.
 * 将 HTML 字符串转换为 Markdown 字符串。
 *
 * 参数 / Params:
 * - html: string | 输入 HTML 内容
 * 返回 / Returns:
 * - string | 输出 Markdown（或在失败时的纯文本）
 *
 * 异常 / Throws:
 * - 不抛出异常；内部捕获并回退。
 *
 * 复杂度 / Complexity:
 * - O(n) with regard to input length.
 */
export function htmlToMarkdown(html: string): string {
  const text = String(html ?? "");
  if (!text.trim()) return "";
  try {
    const td = buildTurndown();
    return td.turndown(text);
  } catch (e) {
    // 降级：移除标签，仅保留文本
    try {
      return text.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
    } catch {
      return text;
    }
  }
}
