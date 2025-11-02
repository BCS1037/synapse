import pkg from "../../package.json" with { type: "json" };
import type { FluentMessageId } from "../../typings/i10n.d.ts";

const config = pkg.config as {
  addonName: string;
  addonID: string;
  addonRef: string;
  addonInstance: string;
  prefsPrefix: string;
};

export { initLocale, getString, getLocaleID };

/**
 * Initialize locale data
 * 初始化本地化数据
 */
function initLocale() {
  const l10n = new (
    typeof Localization === "undefined"
      ? ztoolkit.getGlobal("Localization")
      : Localization
  )([`${config.addonRef}-addon.ftl`], true);
  addon.data.locale = {
    current: l10n,
  };
}

/**
 * Get locale string, see https://firefox-source-docs.mozilla.org/l10n/fluent/tutorial.html#fluent-translation-list-ftl
 * 获取本地化字符串，参考上方链接
 * @param localString ftl key
 * @param options.branch branch name / 分支名称
 * @param options.args args / 参数
 */
function getString(localString: FluentMessageId): string;
function getString(localString: FluentMessageId, branch: string): string;
function getString(
  localeString: FluentMessageId,
  options: { branch?: string | undefined; args?: Record<string, unknown> },
): string;
function getString(...inputs: any[]) {
  if (inputs.length === 1) {
    return _getString(inputs[0]);
  } else if (inputs.length === 2) {
    if (typeof inputs[1] === "string") {
      return _getString(inputs[0], { branch: inputs[1] });
    } else {
      return _getString(inputs[0], inputs[1]);
    }
  } else {
    throw new Error("Invalid arguments");
  }
}

/**
 * Internal string resolver with addonRef-aware prefixing
 * 内部解析：仅当未以“addonRef-”开头时才添加前缀，避免二次前缀（如 mdnotes-mdnotes-...）
 */
function _getString(
  localeString: FluentMessageId,
  options: { branch?: string | undefined; args?: Record<string, unknown> } = {},
): string {
  // If the id already starts with "<addonRef>-", do NOT prefix again
  // 如果 id 已经以“<addonRef>-”开头，则不要再次添加前缀
  const localStringWithPrefix = (localeString as string).startsWith(
    `${config.addonRef}-`,
  )
    ? (localeString as string)
    : `${config.addonRef}-${localeString}`;

  const { branch, args } = options;
  const pattern = addon.data.locale?.current.formatMessagesSync([
    { id: localStringWithPrefix, args },
  ])[0];
  if (!pattern) {
    return localStringWithPrefix;
  }
  if (branch && pattern.attributes) {
    for (const attr of pattern.attributes) {
      if (attr.name === branch) {
        return attr.value;
      }
    }
    return (pattern as any).attributes?.[branch] || localStringWithPrefix;
  } else {
    return pattern.value || localStringWithPrefix;
  }
}

/**
 * Get full Fluent ID with addonRef prefix without double-prefixing
 * 获取带 addonRef 前缀的完整 Fluent ID，避免重复前缀
 */
function getLocaleID(id: FluentMessageId) {
  return (id as string).startsWith(`${config.addonRef}-`)
    ? (id as string)
    : `${config.addonRef}-${id}`;
}
