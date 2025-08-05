# tang-monorepo

基于pnpm workspace的monorepo项目，包含多个前端开发工具和脚手架。

## 📦 Packages

### 🚀 [@tanggoat/pack-start](./packages/pack-start/README.md)
基于webpack5+react18的前端项目脚手架工具
- **功能**: 快速创建React项目，支持TypeScript和JavaScript模板
- **技术栈**: Webpack 5 + React 18 + TypeScript/JavaScript
- **特性**: 开箱即用、交互式问答、代码规范配置

### 🔧 [@tanggoat/npm-helper](./packages/npm-helper/README.md)
一键自动tag、发包、引导登录npm的工具
- **功能**: 自动化npm包发布流程
- **特性**: 版本管理、git tag创建、npm登录引导
- **版本**: 1.0.10-beta.3

### 🛠️ [@tanggoat/pack-starter](./packages/pack-starter/README.md)
项目启动器工具集
- **功能**: 快速创建和初始化各种类型的项目模板
- **特性**: 支持多种框架模板、交互式配置、代码规范预设
- **状态**: 开发中

### 📚 [@tanggoat/tang-other](./packages/tang-other/README.md)
其他工具和库
- **功能**: 收集各种辅助工具和库
- **状态**: 开发中

## 🚀 快速开始

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
# 进入特定包目录
cd packages/pack-start

# 构建
pnpm build

# 发布
pnpm release
```

## 📖 pnpm使用指南

### pnpm指令

#### 依赖包安装到工程的根目录
```bash
pnpm install react -w
```
> 如果是一个开发依赖的话
```bash
pnpm install react -wD
```

#### 给某个package单独安装指定依赖
```bash
pnpm add axios --filter @tanggoat/pack-start
```

#### 运行特定包的脚本
```bash
pnpm run build --filter @tanggoat/pack-start
```

#### 发布特定包
```bash
pnpm run release --filter @tanggoat/pack-start
```

## 🏗️ 项目结构

```
tang-npm-monorepo/
├── packages/
│   ├── pack-start/          # 前端脚手架工具
│   ├── npm-helper/          # npm发布工具
│   ├── pack-starter/        # 通用CLI工具
│   └── tang-other/          # 其他工具库
├── pnpm-workspace.yaml      # pnpm workspace配置
└── README.md               # 项目说明
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

© 2025 tanggoat. All rights reserved.