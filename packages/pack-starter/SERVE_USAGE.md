# Serve 开发服务器使用指南

## 概述

Pack-Starter 的 `serve` 命令用于启动开发服务器，提供热模块替换(HMR)、实时重载等开发体验功能。

## 基本用法

### 启动开发服务器

```bash
# 使用默认配置启动
pack serve

# 或者使用别名
pack s
```

### 自定义端口和主机

```bash
# 指定端口
pack serve --port 8080

# 指定主机
pack serve --host 0.0.0.0

# 同时指定端口和主机
pack serve --port 8080 --host 0.0.0.0
```

### 控制浏览器行为

```bash
# 自动打开浏览器
pack serve --open

# 不自动打开浏览器
pack serve --open false
```

### 热模块替换

```bash
# 启用热模块替换（默认）
pack serve --hot

# 禁用热模块替换
pack serve --hot false
```

## 配置选项

### CLI 选项

| 选项 | 描述 | 默认值 |
|------|------|--------|
| `-p, --port <port>` | 服务器端口 | `3000` |
| `-h, --host <host>` | 服务器主机 | `localhost` |
| `-o, --open` | 自动打开浏览器 | `true` |
| `--hot` | 启用热模块替换 | `true` |
| `-c, --config <path>` | 配置文件路径 | 自动查找 |

### 配置文件选项

在 `.packrc.js` 中配置开发服务器：

```javascript
module.exports = {
  // 开发服务器配置
  server: {
    host: 'localhost',
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true,
    compress: true,
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
};
```

## 功能特性

### 1. 热模块替换 (HMR)

- 修改代码后自动更新浏览器，无需手动刷新
- 保持应用状态，提升开发效率
- 支持 CSS 热更新

### 2. 实时错误显示

- 编译错误直接在浏览器中显示
- 语法错误实时提示
- 友好的错误界面

### 3. 静态文件服务

- 自动服务 `public` 目录下的静态文件
- 支持图片、字体等资源文件

### 4. 代理配置

支持 API 代理，解决跨域问题：

```javascript
// .packrc.js
module.exports = {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};
```

### 5. 历史路由支持

- 支持 React Router、Vue Router 等 SPA 路由
- 刷新页面不会 404

## 开发体验

### 启动流程

1. **配置加载**: 读取 `.packrc.js` 配置文件
2. **Webpack 配置**: 生成开发环境 webpack 配置
3. **服务器启动**: 启动 webpack-dev-server
4. **浏览器打开**: 自动打开默认浏览器（如果启用）
5. **热更新**: 监听文件变化，自动更新

### 文件监听

开发服务器会监听以下文件变化：

- JavaScript/TypeScript 文件
- CSS/SCSS/Less 文件
- HTML 模板文件
- 静态资源文件

### 错误处理

- 编译错误：在浏览器中显示错误信息
- 运行时错误：在控制台显示详细错误
- 网络错误：自动重试连接

## 高级配置

### 自定义中间件

```javascript
// .packrc.js
module.exports = {
  server: {
    setupMiddlewares: (middlewares, devServer) => {
      // 添加自定义中间件
      middlewares.unshift({
        name: 'custom-middleware',
        path: '/api',
        middleware: require('express').static('public')
      });
      return middlewares;
    }
  }
};
```

### HTTPS 支持

```javascript
// .packrc.js
module.exports = {
  server: {
    https: true,
    // 或者使用自定义证书
    https: {
      key: fs.readFileSync('/path/to/server.key'),
      cert: fs.readFileSync('/path/to/server.crt')
    }
  }
};
```

### 多页面应用

```javascript
// .packrc.js
module.exports = {
  webpack: {
    entry: {
      app: './src/app.js',
      admin: './src/admin.js'
    }
  },
  server: {
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/'
    }
  }
};
```

## 故障排除

### 端口被占用

如果默认端口被占用，可以：

```bash
# 使用其他端口
pack serve --port 3001

# 或者让系统自动分配端口
pack serve --port 0
```

### 热更新不工作

1. 检查是否启用了 `--hot` 选项
2. 确认文件路径正确
3. 检查 webpack 配置中的 HMR 插件

### 代理不生效

1. 检查代理配置语法
2. 确认目标服务器正在运行
3. 检查网络连接

### 静态文件无法访问

1. 确认 `public` 目录存在
2. 检查文件权限
3. 验证 `static` 配置

## 性能优化

### 开发环境优化

- 启用 `compress` 压缩响应
- 使用 `historyApiFallback` 支持 SPA 路由
- 配置合适的 `watchOptions`

### 内存优化

- 合理配置 `watchOptions.ignored`
- 避免监听不必要的文件
- 定期重启开发服务器

## 相关命令

- `pack build` - 构建生产版本
- `pack clean` - 清理构建文件
- `pack plugins` - 查看可用插件

## 技术实现

Serve 命令通过以下技术栈实现：

- **Webpack 5**: 模块打包和开发服务器
- **webpack-dev-server**: 开发服务器核心
- **Hot Module Replacement**: 热模块替换
- **Express**: 中间件支持
- **Socket.io**: 实时通信 