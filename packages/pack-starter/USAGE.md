# Pack Starter 使用指南

## 安装

### 全局安装
```bash
npm install -g pack-starter
```

### 本地安装
```bash
npm install --save-dev pack-starter
```

## 快速开始

### 1. 创建项目配置文件

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

#### 全局安装后使用
```bash
# 启动开发服务器
pack serve

# 构建生产版本
pack build

# 清理输出目录
pack clean

# 查看可用插件
pack plugins
```

#### 本地安装后使用
```bash
# 使用 npx
npx pack serve
npx pack build

# 或在 package.json 中添加脚本
{
  "scripts": {
    "dev": "pack serve",
    "build": "pack build",
    "clean": "pack clean"
  }
}
```

## 项目结构示例

```
my-project/
├── src/
│   ├── index.js          # 入口文件
│   ├── styles.css        # 样式文件
│   └── components/       # 组件目录
├── public/
│   └── index.html        # HTML 模板
├── packrc.js             # 配置文件
└── package.json
```

## 配置文件选项

### 基础配置
- `name`: 项目名称
- `entry`: 入口文件路径
- `output.path`: 输出目录
- `output.filename`: 输出文件名格式
- `mode`: 构建模式 (development/production)

### 插件配置
```javascript
plugins: [
  {
    name: 'html',          // 插件名称
    options: {             // 插件选项
      template: './public/index.html'
    },
    enabled: true          // 是否启用
  }
]
```

### 开发服务器配置
```javascript
devServer: {
  port: 3000,              // 端口号
  host: 'localhost',       // 主机地址
  open: true,              // 自动打开浏览器
  hot: true,               // 热重载
  proxy: {                 // API 代理
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
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
    inject: true
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

### 代码分割插件
优化代码分割：
```javascript
{
  name: 'split-chunks',
  options: {
    chunks: 'all',
    minSize: 20000
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

## 自定义插件

### 创建插件
```javascript
// my-plugin.js
module.exports = {
  name: 'my-plugin',
  version: '1.0.0',
  apply: async (context, options) => {
    // 插件逻辑
    context.addRule({
      test: /\.my$/,
      use: 'my-loader'
    });
  }
};
```

### 使用自定义插件
```javascript
// packrc.js
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

## 故障排除

### 常见问题

1. **配置文件未找到**
   - 确保 `packrc.js` 文件在项目根目录
   - 检查文件名是否正确

2. **插件未找到**
   - 检查插件名称是否正确
   - 确保插件已正确注册

3. **构建失败**
   - 检查入口文件是否存在
   - 查看错误日志获取详细信息

### 调试模式
```bash
# 启用详细日志
DEBUG=pack:* pack build
```

## 更多信息

- [完整文档](./README.md)
- [示例项目](./examples/)
- [插件开发指南](./PLUGINS.md) 