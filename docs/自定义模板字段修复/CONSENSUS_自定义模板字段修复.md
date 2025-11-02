# 阶段1终局：Consensus（共识）— 自定义模板字段修复

## 共识要点
- 迁移策略：当旧前缀存在值时，覆盖新前缀对应键（不受默认值影响）。
- 影响范围：仅偏好迁移逻辑；不更改模板语法与 UI。
- 版本策略：修复发布为 `1.0.5`，变更记录写入 `CHANGELOG.md`。
- 发布工序：重建 XPI，校验 `manifest` 与 `update.json`，交付安装路径。

## 可测试验收
- 启动后检查偏好：`extensions.synapse.frontmatter.*` 等值与旧前缀一致。
- 导出后文件包含用户 frontmatter 与占位符内容。
- `manifest.json`/`update.json` 与版本号、哈希一致。