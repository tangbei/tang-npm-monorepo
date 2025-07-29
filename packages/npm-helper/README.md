# tang-npm

一个用于一键自动tag、发包、引导登录npm的工具，简化npm包的发布流程。

## ✨ 功能特性

- 🔍 **环境检查**: 自动检查Node.js、npm、git配置等环境
- 🔐 **自动登录**: 引导用户登录npm，支持交互式登录
- 📦 **版本管理**: 支持patch、minor、major版本更新，也支持自定义版本
- 🏷️ **Git Tag**: 自动创建和推送git tag
- 🚀 **一键发布**: 完整的发布流程，从检查到发布一步到位
- 📋 **状态检查**: 发布前检查git状态、分支、未提交文件等

## 📦 安装

```bash
npm install tang-npm
```

或者克隆项目后安装依赖：

```bash
git clone <repository-url>
cd tang-npm
npm install
```

## 🚀 使用方法

### 1. 检查发布环境

在发布前，建议先检查环境配置：

```bash
npm run check
```

这会检查：
- Node.js版本
- npm版本
- Git配置
- package.json配置
- 远程仓库配置

### 2. 一键发布

运行发布命令：

```bash
npm run release
```

发布流程包括：
1. 检查git工作区状态
2. 检查当前分支（建议在main/master分支）
3. 获取当前版本和npm最新版本
4. 选择版本更新类型
5. 确认发布
6. 检查npm登录状态，如未登录则引导登录
7. 更新版本号
8. 创建git tag并推送
9. 发布到npm

## 📋 版本更新类型

- **patch**: 补丁版本 (1.0.0 → 1.0.1) - 修复bug
- **minor**: 次要版本 (1.0.0 → 1.1.0) - 新功能，向后兼容
- **major**: 主要版本 (1.0.0 → 2.0.0) - 破坏性更新
- **custom**: 自定义版本 - 手动输入版本号

## 🔧 配置要求

### package.json 必要字段

```json
{
  "name": "your-package-name",
  "version": "1.0.0",
  "description": "包描述",
  "main": "index.js",
  "license": "ISC"
}
```

### Git 配置

确保已配置Git用户信息：

```bash
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱"
```

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- Git

## 📁 项目结构

```
tang-npm/
├── scripts/
│   ├── release.js    # 主发布脚本
│   ├── check.js      # 环境检查脚本
│   └── version.js    # 版本管理工具
├── package.json
└── README.md
```

## 🔍 脚本说明

### release.js
主发布脚本，包含完整的发布流程：
- 环境检查
- 版本选择
- npm登录
- git操作
- npm发布

### check.js
环境检查脚本，检查发布前的准备状态：
- Node.js和npm版本
- Git配置
- package.json配置
- 远程仓库配置

### version.js
版本管理工具：
- 获取npm最新版本
- 获取本地当前版本
- 版本号更新

## 🛠️ 自定义配置

### .npmignore 文件

建议创建 `.npmignore` 文件来控制发布内容：

```
node_modules/
.git/
.gitignore
README.md
scripts/
*.log
```

### 环境变量

可以通过环境变量自定义行为：

```bash
# 跳过某些检查
SKIP_GIT_CHECK=true npm run release

# 指定npm registry
npm config set registry https://registry.npmjs.org/
```

## 🐛 常见问题

### Q: 发布失败，提示权限不足
A: 确保已正确登录npm，并且有该包的发布权限

### Q: Git tag创建失败
A: 检查是否有未提交的更改，确保在正确的分支上

### Q: 版本号格式错误
A: 确保版本号格式为 `x.y.z`，如 `1.0.0`

### Q: 无法获取npm最新版本
A: 可能是首次发布，或者网络问题，工具会自动处理

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

ISC License

## 🔗 相关链接

- [npm官方文档](https://docs.npmjs.com/)
- [语义化版本](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/) 