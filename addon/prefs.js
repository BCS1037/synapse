// synapse preferences (migrated minimal set)
// Directory & templates
pref("extensions.synapse.directory", "");
pref("extensions.synapse.templates.directory", "");
pref("extensions.synapse.template.default", "default.md");
// （已移除）独立笔记模板文件名 / (removed) standalone note template file name
// pref("extensions.mdnotes.template.standalone", "");
pref("extensions.synapse.templates.include_empty_placeholders", false);

// File name template (empty by default to keep legacy prefix/suffix behavior)
// 文件名模板（默认留空以保持旧版前后缀命名行为）
pref("extensions.synapse.filename.template", "");
// 新增：导出后附加链接文件到 Zotero（默认开启）/ Attach linked file to Zotero after export (default: true)
pref("extensions.synapse.attach_to_zotero", true);
// 新增：导出后创建子笔记/URL 附件（默认开启）/ Create child note/URL attachments after export (default: true)
pref("extensions.synapse.create_notes_file", true);

// File organization & naming
pref("extensions.synapse.file_conf", "split");
pref("extensions.synapse.files.zotero.metadata.prefix", "");
pref("extensions.synapse.files.zotero.metadata.suffix", "-zotero");
pref("extensions.synapse.files.zotero.note.prefix", "");
pref("extensions.synapse.files.zotero.note.suffix", "");
pref("extensions.synapse.files.mdnotes.hub.prefix", "");
pref("extensions.synapse.files.mdnotes.hub.suffix", "");
// 移除独立模板与前后缀默认项 / Remove standalone template/prefix/suffix prefs
// pref("extensions.mdnotes.template.standalone", "");
// pref("extensions.mdnotes.files.mdnotes.standalone.prefix", "");
// pref("extensions.mdnotes.files.mdnotes.standalone.suffix", " - New Note");

// 调整 frontmatter 默认字段，去除 collections / Remove 'collections' from default fields
pref(
  "extensions.synapse.frontmatter.fields",
  "title,authors,year,tags,DOI,url,publication,localLibrary,cloudLibrary",
);
// =================================================================

// Placeholders (partial, extend later)
pref(
  "extensions.synapse.placeholder.title",
  '{"content":"# {{field_contents}}", "field_contents": "{{content}}", "link_style": "no-links"}',
);
pref(
  "extensions.synapse.placeholder.abstractNote",
  '{"content":"## Abstract\\n\\n{{field_contents}}\\n", "field_contents": "{{content}}", "link_style": "no-links", "list_separator": ", "}',
);
pref(
  "extensions.synapse.placeholder.author",
  '{"content":"{{bullet}} Authors: {{field_contents}}", "link_style": "wiki", "list_separator": ", "}',
);
pref(
  "extensions.synapse.placeholder.collections",
  '{"content":"{{bullet}} Topics: {{field_contents}}", "field_contents": "{{content}}", "link_style": "wiki", "list_separator": ", "}',
);
pref(
  "extensions.synapse.placeholder.related",
  '{"content":"{{bullet}} Related: {{field_contents}}", "link_style": "wiki", "list_separator": ", "}',
);
pref(
  "extensions.synapse.placeholder.notes",
  '{"content":"## Highlights and Annotations\\n\\n- {{field_contents}}", "field_contents": "{{content}}", "link_style": "wiki", "list_separator": "\\n- "}',
);
pref(
  "extensions.synapse.placeholder.tags",
  '{"content":"{{bullet}} Tags: {{field_contents}}", "field_contents": "#{{content}}", "link_style": "no-links", "list_separator": ", ", "remove_spaces": "true"}',
);
// 已移除 citekey 占位符默认配置（仍保留解析逻辑）
// pref(
//   "extensions.mdnotes.placeholder.citekey",
//   '{"content":"{{bullet}} Cite key: {{field_contents}}", "field_contents": "{{content}}", "link_style": "no-links"}',
// );
// （移除）pdfAttachments 默认配置
// pref(
//   "extensions.mdnotes.placeholder.pdfAttachments",
//   '{"content":"{{bullet}} PDF Attachments\\n\\t- {{field_contents}}", "field_contents": "{{content}}", "list_separator": "\\n\\t- "}',
// );
pref(
  "extensions.synapse.placeholder.url",
  '{"content":"{{bullet}} URL: {{field_contents}}", "field_contents": "{{content}}"}',
);
pref(
  "extensions.synapse.placeholder.DOI",
  '{"content":"{{bullet}} DOI: {{field_contents}}", "field_contents": "{{content}}", "link_style": "no-links"}',
);
pref(
  "extensions.synapse.placeholder.cloudLibrary",
  '{"content":"{{bullet}} {{field_contents}}", "field_contents": "[Cloud library]({{content}})"}',
);
pref(
  "extensions.synapse.placeholder.localLibrary",
  '{"content":"{{bullet}} {{field_contents}}", "field_contents": "[Local library]({{content}})"}',
);
pref(
  "extensions.synapse.placeholder.noteContent",
  '{"content":"{{field_contents}}"}',
);

// HTML → Markdown rules defaults / HTML 转 Markdown 规则默认值
pref("extensions.synapse.html.strong", false);
pref("extensions.synapse.html.em", false);
pref("extensions.synapse.html.strikethrough", false);
pref("extensions.synapse.html.underline", false);
pref("extensions.synapse.html.bullet", true);

// Frontmatter defaults / Frontmatter 默认
pref("extensions.synapse.frontmatter.enabled", true);
// 强制 YAML，仅保留 yaml 选项；存储也应为 yaml / Force YAML
pref("extensions.synapse.frontmatter.format", "yaml");

// Obsidian integration defaults / Obsidian 集成默认
pref("extensions.synapse.obsidian.attach_obsidian_uri", false);
pref("extensions.synapse.obsidian.block_ids", false);
pref("extensions.synapse.obsidian.vault", "");
pref("extensions.synapse.obsidian.dir", "");

// If there is an icon path in prefs UI, ensure it uses SVG logo
// This file may be template-only; no hardcoded icon strings found to replace.
