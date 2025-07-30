# Tang CLI 使用示例

## 安装

```bash
# 全局安装
npm install -g @tanggoat/tang-cli

# 或者使用 pnpm
pnpm add -g @tanggoat/tang-cli
```

## 使用方法

### 1. 交互式创建项目

```bash
tang-cli create vite
```

然后按照提示选择：
- 项目名称：`my-awesome-app`
- 框架类型：选择 `React + TypeScript`
- 是否支持 TypeScript：选择 `true`

### 2. 直接指定参数创建项目

```bash
# 创建 React + TypeScript 项目
tang-cli create vite my-react-app -t react-ts

# 创建 React + JavaScript 项目
tang-cli create vite my-react-app -t react
```

### 3. 开发项目

创建完成后，进入项目目录并启动开发服务器：

```bash
cd my-awesome-app
npm install
npm run dev
```

## 支持的命令

```bash
# 查看帮助
tang-cli --help

# 查看版本
tang-cli --version

# 创建项目
tang-cli create <build-method> [app-name] [options]
```

## 支持的构建方法

目前只支持 `vite` 构建工具：

```bash
tang-cli create vite my-app
```

## 支持的模板

| 模板名称 | 描述 | 文件扩展名 |
|---------|------|-----------|
| `react` | React + JavaScript | `.jsx` |
| `react-ts` | React + TypeScript | `.tsx` |

## 项目结构

创建的项目包含以下文件和配置：

```
my-app/
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

## 可用的脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建
- `npm run lint` - 运行 ESLint 检查

## 技术栈

- **构建工具**: Vite 5.x
- **框架**: React 18
- **语言**: JavaScript / TypeScript
- **样式**: CSS
- **代码规范**: ESLint
- **包管理器**: npm 