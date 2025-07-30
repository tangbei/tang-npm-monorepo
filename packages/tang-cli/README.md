# Tang CLI

一个现代化的前端项目脚手架工具，支持 React 项目模板。

## 特性

- 🚀 基于 Vite 构建工具
- ⚛️ 支持 React + JavaScript/TypeScript
- 📦 开箱即用的项目配置
- 🎨 现代化的 UI 设计
- 🔧 ESLint 代码规范配置

## 安装

```bash
npm install -g @tanggoat/tang-cli
```

## 使用方法

### 交互式创建项目

```bash
tang-cli create vite
```

然后按照提示选择：
1. 项目名称
2. 框架类型（React）
3. 是否支持 TypeScript

### 直接指定参数创建项目

```bash
# 创建 React + TypeScript 项目
tang-cli create vite my-react-app -t react-ts

# 创建 React + JavaScript 项目
tang-cli create vite my-react-app -t react
```

## 支持的模板

| 模板名称 | 描述 | 文件扩展名 |
|---------|------|-----------|
| `react` | React + JavaScript | `.jsx` |
| `react-ts` | React + TypeScript | `.tsx` |

## 项目结构

创建的项目包含以下文件和配置：

```
my-project/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.jsx (或 App.tsx)
│   ├── App.css
│   ├── index.css
│   └── main.jsx (或 main.tsx)
├── index.html
├── package.json
├── vite.config.js (或 vite.config.ts)
├── tsconfig.json (TypeScript 项目)
├── tsconfig.node.json (TypeScript 项目)
└── .eslintrc.cjs
```

## 开发

创建项目后，进入项目目录并安装依赖：

```bash
cd my-project
npm install
npm run dev
```

## 可用的脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建
- `npm run lint` - 运行 ESLint 检查

## 技术栈

- **构建工具**: Vite
- **框架**: React 18
- **语言**: JavaScript / TypeScript
- **样式**: CSS
- **代码规范**: ESLint
- **包管理器**: npm

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

ISC 