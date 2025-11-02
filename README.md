# synapse
A simple Zotero plugin for exporting item metadata to Obsidian notes.

> This plugin is a successor to the original [Mdnotes](https://github.com/argenos/zotero-mdnotes). The original author stopped maintenance after Zotero 7.0, but I really liked its simple and direct export method. So, I updated it to support Zotero 7 and 8. I kept the core features and adopted a cleaner, non-intrusive design, hence the new name "Synapse."

## Key Features

- Create mdnotes files: from Zotero’s context menu or the File menu, choose `Synapse → Create mdnotes file` to generate or update `.md` files for selected items (multi-select supported).
- Custom templates: load Markdown templates from the default template or a configured templates directory; supports placeholders and filters (e.g., `{{title}}`, `{{authors}}`, `{{collections}}`, `{{abstractNote}}`). Falls back to a built-in template when loading fails.
- YAML frontmatter: flexibly control output via a field list; when not configured, defaults to `title/year/collections/tags/doi`.
- File naming: supports a filename template (e.g., `{{author}} - {{year}} - {{title}}.md`), with shorthand placeholders; falls back to a safe filename if rendering fails.
- Batch export: select multiple items to batch create mdnotes files.
- Link with Obsidian: creates only one child attachment of type “Link to URL (file:///)” pointing to the newly generated Markdown file.

## Usage

1. After installing the plugin, open `Preferences → Synapse` and configure:
   - `directory` (export directory)
   - `templates.directory` and `template.default`
   - Optional: `filename.template`, Frontmatter, and HTML→Markdown switches
2. Select one or more items in the library:
   - Context menu: `Synapse → Create mdnotes file`
   - Or main menu: `File → Synapse → Create mdnotes file`
3. After export:
   - A corresponding `.md` file is generated or updated in the specified directory;
   - If “Create child note link” is enabled, the item will have a child “Link to URL” attachment pointing to `file:///.../xxx.md`.

### Example Template (copy into your template file)

```md
---
title: {{ title }}
year: {{ year }}
tags: {{ tags|list }}
doi: {{ DOI }}
---

# {{ title }}

> {{ abstractNote }}

## Notes

{{ notes }}
```

## Compatibility

- Supports Zotero 7/8; minimum `7.0`, up to `8.*` (see `update.json`).
- Cross-platform path handling and safe writes use Zotero official APIs (IOUtils/OS.File) with fallbacks.

## Install & Build

- Recommended: download the `.xpi` package from GitHub Releases and install in Zotero.
- Developer build:
  - `npm install`
  - `npm run build`
  - Build artifacts are located in `.scaffold/build/` (XPI file name follows configuration).

## License

- Licensed under `GNU AFFERO GENERAL PUBLIC LICENSE`.

## Acknowledgements

- Built on [zotero-plugin-template](https://github.com/windingwind/zotero-plugin-template).
- Thanks to the community for early [Mdnotes](https://github.com/argenos/zotero-mdnotes) explorations and template syntax contributions.
