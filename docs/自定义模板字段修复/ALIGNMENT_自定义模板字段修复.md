# 阶段1：Align（对齐阶段）— 自定义模板字段修复

## 项目上下文分析
- 技术栈：Zotero 7/8 插件，TypeScript + ESM，zotero-plugin-scaffold。
- 核心模块：`TemplateEngine`（模板渲染）、`PlaceholderResolver`（占位符解析）、`MdnotesService`（导出逻辑）、`prefs`（偏好迁移）。
- 依赖关系：模板渲染依赖偏好设置；偏好迁移在启动阶段执行，决定渲染上下文是否包含用户自定义字段。

## 原始需求与问题
- 症状：导出条目时，自定义模板字段（frontmatter/placeholder）未被正确应用。
- 直接原因：旧 `extensions.mdnotes.*` 的用户自定义值没有覆盖新前缀 `extensions.synapse.*` 的默认值，导致渲染上下文丢失或被默认值覆盖。

## 边界与约束
- 不改动模板语法及字段命名（维持现有 `{{title}}` 等约定）。
- 不引入破坏性变更（保持现有菜单与导出路径）。
- 遵循项目规则：修改必须提升版本号并更新 CHANGELOG/设计/开发文档。

## 需求理解与目标
- 在检测到旧前缀存在用户值时，迁移逻辑应无条件覆盖新前缀对应键，使用户自定义字段生效。
- 重新打包 XPI 并提供安装路径，确保实际导出内容包含自定义 frontmatter 与占位符。

## 疑问与澄清（内部消解）
- 是否需要 UI 变更？否，仅逻辑修复。
- 是否需要数据回滚？否，迁移为幂等覆盖；继续运行不会损坏数据。

## 验收标准（AC）
- AC1：首次启动后，`extensions.synapse.frontmatter.fields` 与占位符设置应与用户在旧前缀中的值一致。
- AC2：执行“创建 mdnotes 文件”后，导出的 Markdown 包含用户指定的 frontmatter 字段（如 title/authors/year/…）。
- AC3：`manifest.json` 的 `applications.zotero.id` 为 `synapse@bcs1037.github.io` 且版本号为 1.0.5。
- AC4：根目录 `update.json` 的 `version=1.0.5` 与构建产物哈希一致。