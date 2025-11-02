# 阶段5：Automate/Assess（实施与评估）— 自定义模板字段修复

## 执行记录
- 已修复迁移逻辑：`migratePrefsPrefix` 无条件覆盖新前缀键（旧值存在时）。
- 已升级版本：`1.0.5`；已更新 `CHANGELOG.md`。
- 已重建：`.scaffold/build/synapse.xpi` 与 `xpi/Synapse-1.0.5.*.xpi`。
- 已同步 `update.json`（版本与哈希）。

## 验收用例（手动）
- 用例1：启动 Zotero → 检查偏好：`extensions.synapse.frontmatter.enabled/fields` 等键应与旧值一致。
- 用例2：选中一个常规条目 → 右键菜单“Create mdnotes file” → 导出文件包含用户 frontmatter 字段与占位符内容。
- 用例3：查看 `.scaffold/build/addon/manifest.json` → `version=1.0.5`，`id=synapse@bcs1037.github.io`。

## 评估
- 代码质量：仅变更迁移逻辑，单点影响，风险可控。
- 文档质量：对齐设计/任务/变更记录。
- 技术债务：低；未来可考虑为偏好迁移增加单元测试。