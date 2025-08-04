# Pack Starter

一个基于 Webpack 5 的强大构建工具，具有插件架构设计，支持代码拆分、资源压缩、热重载等功能。

## 特性

- 🚀 **基于 Webpack 5** - 使用最新的 Webpack 5 构建系统
- 🔌 **插件架构** - 内置插件系统，支持自定义插件扩展
- 📦 **代码拆分** - 智能的代码分割和懒加载
- 🗜️ **资源压缩** - 支持 JS/CSS 压缩和 Gzip 压缩
- 🔥 **热重载** - 开发环境支持热模块替换
- 🛠️ **开发服务器** - 完整的 Node.js 开发服务器
- 📝 **TypeScript** - 完全使用 TypeScript 开发
- 🎨 **彩色日志** - 美观的命令行输出

## 安装

```bash
npm install pack-starter
```

## 快速开始

### 1. 创建配置文件

在项目根目录创建 `packrc.js` 文件：

```javascript
module.exports = {
  name: 'my-project',
  entry: './src/index.js',
  output: {
    path: './dist',
    filename: '[name].[contenthash].js',
    publicPath: '/'
  },
  plugins: [
    {
      name: 'html',
      options: {
        template: './public/index.html'
      }
    },
    {
      name: 'css'
    }
  ],
  devServer: {
    port: 3000,
    hot: true
  }
};
```

### 2. 使用命令

```bash
# 启动开发服务器
npx pack serve

# 构建生产版本
npx pack build

# 清理输出目录
npx pack clean

# 查看可用插件
npx pack plugins
```

## 配置选项

### 基础配置

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `name` | string | - | 项目名称 |
| `version` | string | '1.0.0' | 项目版本 |
| `entry` | string/array/object | - | 入口文件 |
| `output.path` | string | './dist' | 输出目录 |
| `output.filename` | string | '[name].[contenthash].js' | 输出文件名 |
| `output.publicPath` | string | '/' | 公共路径 |
| `mode` | string | 'development' | 构建模式 |

### 开发服务器配置

```javascript
devServer: {
  port: 3000,                    // 端口号
  host: 'localhost',             // 主机地址
  open: true,                    // 自动打开浏览器
  hot: true,                     // 热重载
  historyApiFallback: true,      // 支持 SPA 路由
  proxy: {                       // API 代理
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

### 插件配置

```javascript
plugins: [
  {
    name: 'html',                // 插件名称
    options: {                   // 插件选项
      template: './public/index.html',
      filename: 'index.html'
    },
    enabled: true                // 是否启用
  }
]
```

## 内置插件

### HTML 插件

生成 HTML 文件：

```javascript
{
  name: 'html',
  options: {
    template: './public/index.html',
    filename: 'index.html',
    inject: true,
    minify: false
  }
}
```

### CSS 插件

处理 CSS 文件：

```javascript
{
  name: 'css',
  options: {
    filename: 'css/[name].[contenthash].css'
  }
}
```

### 压缩插件

代码压缩：

```javascript
{
  name: 'minify',
  options: {
    dropConsole: true,
    dropDebugger: true
  }
}
```

### 压缩插件 (Gzip)

Gzip 压缩：

```javascript
{
  name: 'compression',
  options: {
    algorithm: 'gzip',
    threshold: 10240
  }
}
```

### 复制插件

复制静态资源：

```javascript
{
  name: 'copy',
  options: {
    from: 'public',
    to: '.',
    ignore: ['**/index.html']
  }
}
```

### 代码分割插件

优化代码分割：

```javascript
{
  name: 'split-chunks',
  options: {
    chunks: 'all',
    minSize: 20000,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10
      }
    }
  }
}
```

### 环境变量插件

处理环境变量：

```javascript
{
  name: 'env',
  options: {
    definitions: {
      'process.env.API_URL': JSON.stringify('http://localhost:3000/api')
    }
  }
}
```

### 热重载插件

开发环境热重载：

```javascript
{
  name: 'hot-reload'
}
```

### 进度插件

显示构建进度：

```javascript
{
  name: 'progress',
  options: {
    activeModules: true,
    entries: true
  }
}
```

## 命令行选项

### build 命令

```bash
pack build [options]

选项:
  -m, --mode <mode>     构建模式 (development|production)
  -e, --env <env>       环境 (development|production|test)
  -c, --config <path>   配置文件路径
  --analyze             分析包大小
  --clean               构建前清理输出目录
```

### serve 命令

```bash
pack serve [options]

选项:
  -p, --port <port>     端口号
  -h, --host <host>     主机地址
  -o, --open            自动打开浏览器
  -c, --config <path>   配置文件路径
  --hot                 启用热模块替换
```

### clean 命令

```bash
pack clean [options]

选项:
  -c, --config <path>   配置文件路径
```

### plugins 命令

```bash
pack plugins

显示所有可用插件
```

## 自定义插件

### 创建插件

```typescript
import { Plugin, PluginContext } from 'pack-starter';

const myPlugin: Plugin = {
  name: 'my-plugin',
  version: '1.0.0',
  apply: async (context: PluginContext, options: any) => {
    // 插件逻辑
    context.addRule({
      test: /\.my$/,
      use: 'my-loader'
    });
  }
};
```

### 注册插件

```javascript
// 在配置文件中使用
module.exports = {
  // ... 其他配置
  plugins: [
    {
      name: 'my-plugin',
      options: {
        // 插件选项
      }
    }
  ]
};
```

## 项目结构

```
pack-starter/
├── src/
│   ├── types/           # 类型定义
│   ├── utils/           # 工具函数
│   ├── config/          # 配置加载器
│   ├── plugins/         # 插件系统
│   ├── build/           # 构建器
│   ├── cli.ts           # CLI 入口
│   └── index.ts         # 主入口
├── examples/            # 示例文件
├── dist/               # 构建输出
└── package.json
```

## 开发

### 安装依赖

```bash
pnpm install
```

### 构建

```bash
pnpm build
```

### 开发模式

```bash
pnpm dev
```

### 测试

```bash
pnpm test
```

### 代码检查

```bash
pnpm lint
```

### 格式化

```bash
pnpm format
```

## 许可证

ISC 