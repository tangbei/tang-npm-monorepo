# @tanggoat/pack-start

基于webpack5+react18的前端项目脚手架工具

## 🚀 特性

- **现代化技术栈**: Webpack 5 + React 18
- **双模板支持**: TypeScript 和 JavaScript 两种模板
- **开箱即用**: 完整的开发环境配置
- **友好交互**: 命令行交互式问答
- **代码规范**: 内置 ESLint + Prettier 配置
- **热重载**: 开发服务器支持热重载
- **生产优化**: 生产环境构建优化

## 📦 安装

```bash
npm install -g @tanggoat/pack-start
```

## 🎯 使用方法

### 创建新项目

```bash
# 交互式创建项目
pack-start create

# 指定项目名称
pack-start create my-project

# 指定模板类型
pack-start create my-project --template react-ts

# 跳过交互，使用默认配置
pack-start create my-project --yes
```

### 命令行选项

- `--template, -t`: 选择模板类型 (`react-ts` 或 `react`)，默认为 `react-ts`
- `--yes, -y`: 跳过交互式问答，使用默认配置

## 📁 项目结构

生成的项目结构如下：

```
my-project/
├── public/              # 静态资源
│   └── index.html       # HTML模板
├── src/                 # 源代码
│   ├── components/      # React组件
│   ├── pages/          # 页面组件
│   ├── utils/          # 工具函数
│   ├── styles/         # 样式文件
│   ├── App.tsx         # 主应用组件
│   └── index.tsx       # 应用入口
├── webpack.config.js    # Webpack配置
├── tsconfig.json        # TypeScript配置 (react-ts模板)
├── .eslintrc.js         # ESLint配置
├── .prettierrc          # Prettier配置
├── package.json         # 项目配置
└── README.md           # 项目说明
```

## 🛠️ 技术栈

### react-ts 模板
- **构建工具**: Webpack 5
- **前端框架**: React 18
- **开发语言**: TypeScript
- **样式处理**: CSS/SCSS
- **代码规范**: ESLint + Prettier
- **类型检查**: TypeScript

### react 模板
- **构建工具**: Webpack 5
- **前端框架**: React 18
- **开发语言**: JavaScript (ES6+)
- **样式处理**: CSS/SCSS
- **代码规范**: ESLint + Prettier
- **转译工具**: Babel

## 📝 可用脚本

生成的项目包含以下 npm 脚本：

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 构建开发版本
npm run build:dev

# 代码检查
npm run lint

# 自动修复代码格式
npm run lint:fix

# 运行测试
npm test

# 监听模式运行测试
npm run test:watch

# 清理构建文件
npm run clean

# TypeScript类型检查 (仅react-ts模板)
npm run type-check
```

## 🔧 配置说明

### Webpack 配置
- 支持 TypeScript/JavaScript 编译
- 支持 CSS/SCSS 处理
- 支持图片和字体资源
- 开发服务器热重载
- 生产环境代码分割和优化

### ESLint 配置
- 支持 React 和 React Hooks 规则
- TypeScript 支持 (react-ts模板)
- 与 Prettier 集成

### Prettier 配置
- 统一的代码格式化规则
- 与 ESLint 集成

## 🎨 自定义配置

### 修改 Webpack 配置
编辑 `webpack.config.js` 文件来自定义构建配置。

### 修改 ESLint 规则
编辑 `.eslintrc.js` 文件来自定义代码检查规则。

### 修改 Prettier 格式
编辑 `.prettierrc` 文件来自定义代码格式化规则。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

© 2024 tanggoat. All rights reserved. 