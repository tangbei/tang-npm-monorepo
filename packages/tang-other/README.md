# @tanggoat/tang-other

tang-other 项目包

## 📦 安装

```bash
npm install @tanggoat/tang-other
```

## 🚀 使用 npm-helper 发包

本项目集成了 `@tanggoat/npm-helper` 工具，提供一键自动发包功能。

### 1. 检查发布环境

在发布前，建议先检查环境配置：

```bash
cd packages/tang-other
npm run check
```

这会检查：
- Node.js 版本
- npm 版本
- Git 配置
- package.json 配置
- 远程仓库配置

### 2. 一键发布

运行发布命令：

```bash
cd packages/tang-other
npm run release
```

发布流程包括：
1. 检查 git 工作区状态
2. 检查当前分支（建议在 main/master 分支）
3. 获取当前版本和 npm 最新版本
4. 选择版本更新类型（patch/minor/major/custom）
5. 确认发布
6. 检查 npm 登录状态，如未登录则引导登录
7. 更新版本号
8. 创建 git tag 并推送
9. 发布到 npm

### 3. Registry 管理

管理 npm registry 配置：

```bash
cd packages/tang-other
npm run registry
```

## 📋 版本更新类型

- **patch**: 补丁版本 (1.0.0 → 1.0.1) - 修复 bug
- **minor**: 次要版本 (1.0.0 → 1.1.0) - 新功能，向后兼容
- **major**: 主要版本 (1.0.0 → 2.0.0) - 破坏性更新
- **custom**: 自定义版本 - 手动输入版本号

## 🔧 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- Git

## �� 许可证

ISC License 