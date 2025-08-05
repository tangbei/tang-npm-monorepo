# Changeset 发布指南

本项目提供了完整的 changeset 发布自动化脚本，支持 beta、alpha、rc 和稳定版本的发布。

## 🚀 快速开始

```bash
# 发布稳定版本
pnpm release:stable

# 发布 beta 版本
pnpm release:beta

# 发布 alpha 版本
pnpm release:alpha

# 发布 rc 版本
pnpm release:rc

# 预演模式（推荐先测试）
pnpm release:dry-run
```

## 📋 可用的快捷命令

- `pnpm release` - 发布稳定版本
- `pnpm release:beta` - 发布 beta 版本
- `pnpm release:alpha` - 发布 alpha 版本
- `pnpm release:rc` - 发布 rc 版本
- `pnpm release:stable` - 发布稳定版本
- `pnpm release:dry-run` - 预演模式

## 🔧 高级用法

### 自定义标签

```bash
# 使用自定义标签发布 rc 版本
./scripts/release.sh --rc --tag v1.0.0-rc.1

# 使用自定义标签发布 beta 版本
./scripts/release.sh --beta --tag v2.0.0-beta.2
```

### 直接使用脚本

```bash
# Shell 版本
./scripts/release.sh --beta --dry-run
```

## 📝 发布流程

脚本会自动执行以下步骤：

1. **检查预发布环境** - 如果发现预发布版本，会自动退出预发布模式
2. **创建 changeset** - 运行 `pnpm changeset` 创建版本变更文件
3. **更新版本号** - 运行 `pnpm changeset version` 更新包版本号
4. **调整版本格式** - 预发布版本会自动转换为标准语义化版本格式
5. **发布到 npm** - 运行 `pnpm changeset publish` 发布包到 npm 仓库

## 🏷️ 版本标签说明

- **稳定版本**: 使用 `latest` 标签，版本号格式如 `2.0.5`
- **预发布版本**: 使用对应的预发布标签（beta、alpha、rc 或自定义标签），版本号格式如 `2.0.5-beta.0`

> **注意**: 预发布版本会自动将时间戳格式转换为标准的语义化版本格式。

## ⚠️ 注意事项

1. **发布前检查**：
   - 确保已经登录到 npm 账户：`npm whoami`
   - 确保有发布权限
   - 确保所有更改已提交到 Git

2. **推荐流程**：
   - 先使用 `--dry-run` 模式测试
   - 确认无误后再执行实际发布

3. **版本管理**：
   - 稳定版本会自动使用 `latest` 标签
   - 预发布版本会使用对应的预发布标签
   - 可以通过 `--tag` 参数自定义标签

4. **预发布环境切换**：
   - 从 beta 切换到 alpha 时，会自动退出 beta 环境
   - 从预发布切换到稳定版本时，会自动退出预发布环境
   - 所有版本切换都会自动处理日志聚合

## 🛠️ 故障排除

### 常见问题

1. **npm 登录问题**
   ```bash
   npm login
   npm whoami  # 检查登录状态
   ```

2. **权限问题**
   - 确保有包的发布权限
   - 检查 npm 账户设置

3. **版本冲突**
   - 检查 `.changeset` 目录中的文件
   - 确保版本号不冲突

### 调试模式

使用 `--dry-run` 模式可以预览发布流程而不实际执行：

```bash
pnpm release:dry-run
```

## 📚 相关文档

- [Changeset 官方文档](https://github.com/changesets/changesets)
- [npm 发布指南](https://docs.npmjs.com/cli/v8/commands/npm-publish)
- [语义化版本](https://semver.org/lang/zh-CN/)

## 🤝 贡献

如果需要修改发布脚本，请：

1. 修改对应的脚本文件
2. 更新 package.json 中的快捷命令
3. 更新文档说明
4. 测试所有功能正常 