# 阶段2：Architect（架构设计）— 自定义模板字段修复

## 分层设计与模块影响
- Prefs 层（`src/utils/prefs.ts`）
  - 函数：`migratePrefsPrefix(oldPrefix,newPrefix,keys)`
  - 变更：若旧值存在（非 undefined/null），无条件写入新前缀键。
  - 设计理由：Zotero Prefs 是 KV 存储，默认值可能掩盖用户值，必须强制覆盖以保证一致性。
- Hooks 层（`src/hooks.ts`）
  - 启动流程：`onStartup` 中调用 `migrateMdnotesToSynapse()`，确保修复立即生效。
- 模板层（`src/modules/template.ts`）
  - 保持现有：`buildItemContext` 构造上下文，`addFrontmatter` 按偏好字段生成 YAML。

## 接口契约（关键）
- 输入：旧前缀键集合（目录、模板、文件名、frontmatter、占位符、HTML 规则、Obsidian 设置）。
- 输出：新前缀键值被覆盖为旧值（若存在）。
- 约束：无枚举 API，使用白名单键迁移；幂等。

## 依赖关系图（简述）
`onStartup` → `migrateMdnotesToSynapse` → `migratePrefsPrefix` → 更新 `extensions.synapse.*` → 渲染上下文 → `TemplateEngine.renderItemToMarkdown` → `MdnotesService.createMdnotesFile`