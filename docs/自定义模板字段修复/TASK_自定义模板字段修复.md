# 阶段3：Atomize（任务原子化）— 自定义模板字段修复

## 子任务拆分
1. 修复偏好迁移逻辑（代码）
   - 输入：旧前缀 `extensions.mdnotes.*` 的用户值
   - 输出：新前缀 `extensions.synapse.*` 被覆盖为旧值
   - 约束：幂等；遇到异常忽略但记录日志
   - 依赖：`hooks.onStartup` 必须调用迁移
2. 升级版本并更新变更日志
   - 输入：现有版本与变更内容
   - 输出：`package.json@version=1.0.5`，`CHANGELOG.md` 添加 1.0.5
   - 依赖：构建流程注入版本到 `manifest.json`
3. 重建 XPI 并校验更新清单
   - 输入：源代码、脚本
   - 输出：`.scaffold/build/synapse.xpi` 与 `xpi/Synapse-1.0.5.*.xpi`
   - 校验：`manifest.version=1.0.5`；`update.json` 版本与哈希一致

## 验收标准对齐
- 每个子任务均可独立验证，无跨模块破坏性变更。