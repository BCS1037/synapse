# 插件开发文档（Synapse）

## 版本与发布流程
- 修改代码后必须提升版本号（`package.json@version`），并更新 `CHANGELOG.md`。
- 执行构建：`npm run build`。产物：
  - `.scaffold/build/synapse.xpi`（别名，便于安装）
  - `xpi/Synapse-<version>.<host>.xpi`（完整档案）
  - `.scaffold/build/addon/manifest.json`（用于校验字段注入）
  - `.scaffold/build/update.json`（包含当前构建的 `sha512`）
- 同步根目录 `update.json`：将版本与 `update_hash` 更新为构建产物的值；`update_link` 指向 GitHub Release `synapse.xpi`。

## 偏好迁移策略
- 入口：`src/hooks.ts@onStartup` 调用 `migrateMdnotesToSynapse()`。
- 行为：当旧前缀存在值时，用旧值覆盖新前缀键（即使新键存在默认值）。
- 范围：目录、模板、文件名/组织、frontmatter、占位符、HTML 规则、Obsidian 设置。

## 调试与验收
- 设置导出目录（Preferences → Mdnotes → Export Directory）。
- 选中条目 → 右键“Create mdnotes file”生成文件。
- 检查导出文件：frontmatter 字段与占位符应符合偏好与模板。

## 注意事项
- 不在导出正文中追加 Obsidian URI（除非显式启用相关偏好）。
- 仅在启用 `create_notes_file` 时创建子笔记/URL 附件，避免重复附件。