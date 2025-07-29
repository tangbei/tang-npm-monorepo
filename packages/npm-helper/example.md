# tang-npm 使用示例

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 检查环境

```bash
npm run check
```

输出示例：
```
🔍 检查发布前准备状态...

✅ Node.js版本: v16.14.2
✅ Node.js版本符合要求
✅ npm版本: 8.5.0
✅ package.json配置检查:
   包名: tang-npm
   版本: 1.0.0
   描述: 一个用于一键自动tag、发包、引导登录npm的工具
   主文件: index.js
   许可证: ISC
✅ package.json配置完整
✅ 存在.npmignore文件
✅ Git配置:
   用户名: 唐贝
   邮箱: itangbei@sina.com
✅ 远程仓库配置:
origin  git@github.com:tangbei/tang-npm-monorepo.git (fetch)
origin  git@github.com:tangbei/tang-npm-monorepo.git (push)

📋 发布前检查清单:
□ 确保所有代码已提交到git
□ 确保在正确的分支上 (main/master)
□ 确保npm已登录
□ 确保package.json中的版本号正确
□ 确保.npmignore文件配置正确
□ 确保README.md文件存在且内容完整

🚀 运行 npm run release 开始发布流程
```

### 3. 执行发布

```bash
npm run release
```

发布流程示例：
```
🚀 开始一键发布流程...

📋 检查git状态...
✅ git工作区干净

🌿 检查git分支...
✅ 当前分支: main

📦 获取版本信息...
✅ 版本信息:
   当前版本: 1.0.0
   最新版本: 0.0.0

? 选择版本更新类型: (使用箭头键选择)
❯ 补丁版本 (patch) - 1.0.0 → 1.0.1
  次要版本 (minor) - 1.0.0 → 1.1.0
  主要版本 (major) - 1.0.0 → 2.0.0
  自定义版本

? 确认要发布 tang-npm 吗? (Y/n)

🔐 检查npm登录状态...
✅ 已登录npm，用户名: your-username

📝 更新版本号...
✅ 版本已更新为: 1.0.1

🏷️ 创建git tag...
✅ Git tag v1.0.1 已创建并推送

🚀 正在发布到npm...
✅ 发布成功！

🎉 发布完成！
📦 包名: tang-npm
📋 版本: 1.0.1
🔗 npm地址: https://www.npmjs.com/package/tang-npm
```

## 📋 版本更新示例

### Patch 版本 (修复bug)
```bash
# 当前版本: 1.0.0
# 选择: 补丁版本 (patch)
# 新版本: 1.0.1
```

### Minor 版本 (新功能)
```bash
# 当前版本: 1.0.0
# 选择: 次要版本 (minor)
# 新版本: 1.1.0
```

### Major 版本 (破坏性更新)
```bash
# 当前版本: 1.0.0
# 选择: 主要版本 (major)
# 新版本: 2.0.0
```

### 自定义版本
```bash
# 当前版本: 1.0.0
# 选择: 自定义版本
# 输入: 1.2.3
# 新版本: 1.2.3
```

## 🔧 高级用法

### 直接运行脚本

```bash
# 检查环境
node scripts/check.js

# 发布
node scripts/release.js

# 使用入口文件
node index.js check
node index.js release
```

### 环境变量配置

```bash
# 跳过git检查
SKIP_GIT_CHECK=true npm run release

# 指定npm registry
npm config set registry https://registry.npmjs.org/
```

### 自动化发布

可以结合CI/CD使用：

```yaml
# GitHub Actions 示例
name: Release
on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run release
```

## 🐛 故障排除

### 常见错误及解决方案

1. **npm登录失败**
   ```bash
   # 清除npm缓存
   npm cache clean --force
   
   # 重新登录
   npm login
   ```

2. **Git权限问题**
   ```bash
   # 检查SSH密钥
   ssh -T git@github.com
   
   # 或使用HTTPS
   git remote set-url origin https://github.com/username/repo.git
   ```

3. **版本冲突**
   ```bash
   # 检查npm上的版本
   npm view your-package-name version
   
   # 手动更新package.json中的版本
   ```

4. **发布权限不足**
   ```bash
   # 检查npm用户
   npm whoami
   
   # 检查包的所有者
   npm owner ls your-package-name
   ```

## 📚 最佳实践

1. **发布前检查**
   - 始终运行 `npm run check` 检查环境
   - 确保所有代码已提交
   - 确保在正确的分支上

2. **版本管理**
   - 遵循语义化版本规范
   - 为每个版本添加有意义的commit message
   - 使用git tag标记重要版本

3. **文档维护**
   - 保持README.md更新
   - 记录重要的变更
   - 提供清晰的使用示例

4. **测试**
   - 发布前进行充分测试
   - 使用CI/CD自动化测试
   - 保持测试覆盖率 