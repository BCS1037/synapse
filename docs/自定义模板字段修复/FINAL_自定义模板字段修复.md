# 阶段6：Final（交付）— 自定义模板字段修复

## 交付物
- 修复后的 XPI：
  - `.scaffold/build/synapse.xpi`
  - `xpi/Synapse-1.0.5.<host>.xpi`
- 更新清单：`update.json@version=1.0.5`，`sha512` 与构建一致。
- 文档：ALIGNMENT/CONSENSUS/DESIGN/TASK/ACCEPTANCE/FINAL/TODO。

## 安装与验证
- Zotero 7/8：工具 → 插件 → 齿轮 → 从文件安装 → 选择 `.scaffold/build/synapse.xpi`。
- 选择条目 → 右键菜单“Create mdnotes file” → 检查导出的 frontmatter 与占位符内容。

## 后续事项
- 建议将新 XPI 上传至 GitHub Release `v1.0.5` 并更新发布说明。