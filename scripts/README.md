# Changeset 发布脚本

这个目录包含了用于自动化 changeset 发布流程的脚本，支持 beta、alpha、rc 和稳定版本的发布。

## 脚本文件

- `release.sh` - Shell 脚本版本的发布脚本

## 使用方法

### 使用 Shell 脚本

```bash
# 发布稳定版本
pnpm release:stable

# 发布 beta 版本
pnpm release:beta

# 发布 alpha 版本
pnpm release:alpha

# 发布 rc 版本
pnpm release:rc

# 预演模式（不实际执行）
pnpm release:dry-run

# 自定义标签
./scripts/release.sh --rc --tag v1.0.0-rc.1
```

## 命令行选项

| 选项 | 描述 |
|------|------|
| `--beta` | 发布 beta 版本 |
| `--alpha` | 发布 alpha 版本 |
| `--rc` | 发布 rc 版本 |
| `--stable` | 发布稳定版本（默认） |
| `--tag <tag>` | 指定预发布标签 |
| `--dry-run` | 预演模式，不实际执行 |
| `--help`, `-h` | 显示帮助信息 |

## 发布流程

脚本会自动执行以下步骤：

1. **创建 changeset** - 运行 `pnpm changeset` 创建版本变更文件
2. **更新版本号** - 运行 `pnpm changeset version` 更新包版本号
3. **发布到 npm** - 运行 `pnpm changeset publish` 发布包到 npm 仓库

## 版本标签说明

- **稳定版本**: 使用 `latest` 标签
- **预发布版本**: 使用对应的预发布标签（beta、alpha、rc 或自定义标签）

## 注意事项

1. 确保已经登录到 npm 账户
2. 确保有发布权限
3. 建议先使用 `--dry-run` 模式测试
4. 发布前确保所有更改已提交到 Git

## 故障排除

如果遇到问题，可以：

1. 检查 npm 登录状态：`npm whoami`
2. 检查发布权限
3. 查看 changeset 配置是否正确
4. 使用 `--dry-run` 模式调试 