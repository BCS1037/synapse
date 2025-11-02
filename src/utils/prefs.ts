import pkg from "../../package.json" with { type: "json" };
const config = pkg.config as {
  addonName: string;
  addonID: string;
  addonRef: string;
  addonInstance: string;
  prefsPrefix: string;
};

type PluginPrefsMap = _ZoteroTypes.Prefs["PluginPrefsMap"];

const PREFS_PREFIX = config.prefsPrefix;

/**
 * Get preference value.
 * Wrapper of `Zotero.Prefs.get`.
 * @param key
 */
export function getPref<K extends keyof PluginPrefsMap>(key: K) {
  return Zotero.Prefs.get(`${PREFS_PREFIX}.${key}`, true) as PluginPrefsMap[K];
}

/**
 * Get preference value by raw key string (untyped).
 * 以原始字符串键读取偏好值（任意键，未做类型校验）。
 * Useful when PluginPrefsMap doesn't declare the key yet.
 */
export function getPrefRaw(key: string): any {
  return Zotero.Prefs.get(`${PREFS_PREFIX}.${key}`, true);
}

/**
 * Set preference value by raw key string (untyped).
 * 以原始字符串键设置偏好值（任意键，未做类型校验）。
 */
export function setPrefRaw(key: string, value: any) {
  return Zotero.Prefs.set(`${PREFS_PREFIX}.${key}`, value, true);
}

/**
 * Set preference value.
 * Wrapper of `Zotero.Prefs.set`.
 * @param key
 * @param value
 */
export function setPref<K extends keyof PluginPrefsMap>(
  key: K,
  value: PluginPrefsMap[K],
) {
  return Zotero.Prefs.set(`${PREFS_PREFIX}.${key}`, value, true);
}

/**
 * Clear preference value.
 * Wrapper of `Zotero.Prefs.clear`.
 * @param key
 */
export function clearPref(key: string) {
  return Zotero.Prefs.clear(`${PREFS_PREFIX}.${key}`, true);
}

/**
 * Read a boolean preference with default value.
 * 读取布尔首选项（带默认值）。
 * - It normalizes undefined to the provided default.
 * - 当首选项不存在时返回提供的默认值。
 */
export function getBoolPref(key: string, def = false): boolean {
  const v = Zotero.Prefs.get(`${PREFS_PREFIX}.${key}`, true);
  return typeof v === "boolean" ? v : !!def;
}

/**
 * Migrate preference keys from an old prefix to a new prefix.
 * 从旧前缀迁移偏好键到新前缀（仅在新键未设置时复制旧值）。
 *
 * Design note: Preferences in Zotero are simple key-value store without enumeration API,
 * so we migrate a curated list of known keys to avoid missing important defaults.
 */
export async function migratePrefsPrefix(
  oldPrefix: string,
  newPrefix: string,
  keys: string[],
) {
  try {
    for (const key of keys) {
      const oldVal = Zotero.Prefs.get(`${oldPrefix}.${key}`, true);
      // 仅当旧值存在时才覆盖新前缀的值；确保用户自定义值被迁移（即使新键已有默认值）
      // Only override when old value exists; ensures user customizations migrate even if new key has defaults
      if (typeof oldVal === "undefined" || oldVal === null) continue;
      Zotero.Prefs.set(`${newPrefix}.${key}`, oldVal, true);
    }
  } catch {
    // ignore migration failures; non-critical
  }
}

/**
 * Migrate mdnotes.* preferences to synapse.* on first run after rename.
 * 将 extensions.mdnotes.* 迁移为 extensions.synapse.*（仅在新键缺失时）
 */
export async function migrateMdnotesToSynapse() {
  const keys = [
    // directories & templates
    "directory",
    "templates.directory",
    "template.default",
    "templates.include_empty_placeholders",
    // file naming
    "filename.template",
    "attach_to_zotero",
    "create_notes_file",
    // file organization
    "file_conf",
    "files.zotero.metadata.prefix",
    "files.zotero.metadata.suffix",
    "files.zotero.note.prefix",
    "files.zotero.note.suffix",
    "files.mdnotes.hub.prefix",
    "files.mdnotes.hub.suffix",
    // frontmatter
    "frontmatter.fields",
    "frontmatter.enabled",
    "frontmatter.format",
    // placeholders
    "placeholder.title",
    "placeholder.abstractNote",
    "placeholder.author",
    "placeholder.collections",
    "placeholder.related",
    "placeholder.notes",
    "placeholder.tags",
    "placeholder.url",
    "placeholder.DOI",
    "placeholder.cloudLibrary",
    "placeholder.localLibrary",
    "placeholder.noteContent",
    // HTML → Markdown rules
    "html.strong",
    "html.em",
    "html.strikethrough",
    "html.underline",
    "html.bullet",
    // Obsidian integration
    "obsidian.attach_obsidian_uri",
    "obsidian.block_ids",
    "obsidian.vault",
    "obsidian.dir",
  ];
  await migratePrefsPrefix("extensions.mdnotes", "extensions.synapse", keys);
}
