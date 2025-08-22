# @tanggoat/request

一个基于 Axios 的 TypeScript HTTP 请求库，提供强大的拦截器支持和类型安全。

## ✨ 特性

- 🚀 **基于 Axios**: 基于成熟的 Axios 库，稳定可靠
- 🔧 **TypeScript 支持**: 完整的类型定义，开发体验优秀
- 🎯 **拦截器系统**: 支持请求和响应拦截器，灵活可扩展
- 📦 **多格式输出**: 支持 CommonJS 和 ES Module 格式
- 🌳 **Tree-shaking**: 支持现代打包工具的 Tree-shaking 优化
- 🎨 **拦截器链**: 支持全局拦截器和单个请求拦截器
- 🚫 **请求取消**: 支持请求取消和批量取消功能

## 📦 安装

```bash
# 使用 npm
npm install @tanggoat/request

# 使用 yarn
yarn add @tanggoat/request

# 使用 pnpm
pnpm add @tanggoat/request
```

## 🚀 快速开始

### 基础用法

```typescript
import Request from '@tanggoat/request';

// 创建请求实例
const request = new Request({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer your-token'
  }
});

// 发送请求
const response = await request.request({
  url: '/users',
  method: 'GET'
});

console.log(response);
```

### 使用拦截器

```typescript
import Request from '@tanggoat/request';

const request = new Request({
  baseURL: 'https://api.example.com',
  interceptors: {
    // 请求拦截器
    requestInterceptors: (config) => {
      console.log('发送请求:', config);
      // 可以在这里修改请求配置
      config.headers = {
        ...config.headers,
        'X-Custom-Header': 'value'
      };
      return config;
    },
    
    // 响应拦截器
    responseInterceptors: (response) => {
      console.log('收到响应:', response);
      // 可以在这里处理响应数据
      return response.data;
    },
    
    // 请求错误拦截器
    requestInterceptorsCatch: (error) => {
      console.error('请求错误:', error);
      return Promise.reject(error);
    },
    
    // 响应错误拦截器
    responseInterceptorsCatch: (error) => {
      console.error('响应错误:', error);
      return Promise.reject(error);
    }
  }
});
```

## 📚 API 文档

### Request 类

#### 构造函数

```typescript
new Request(config: CreateRequestConfig)
```

**配置选项:**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `baseURL` | `string` | 否 | 基础 URL |
| `timeout` | `number` | 否 | 请求超时时间（毫秒） |
| `headers` | `Record<string, string>` | 否 | 默认请求头 |
| `interceptors` | `RequestInterceptors` | 否 | 拦截器配置 |

#### 方法

##### `request<T>(config: RequestConfig<T>): Promise<T>`

发送 HTTP 请求。

**参数:**
- `config`: 请求配置对象

**返回值:**
- `Promise<T>`: 响应数据的 Promise

**配置选项:**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `url` | `string` | 是 | 请求 URL |
| `method` | `string` | 否 | HTTP 方法（默认: GET） |
| `data` | `any` | 否 | 请求体数据 |
| `params` | `any` | 否 | URL 查询参数 |
| `headers` | `Record<string, string>` | 否 | 请求头 |
| `interceptors` | `RequestInterceptors` | 否 | 单个请求的拦截器 |

##### `cancelRequest(url: string | string[]): void`

取消指定的请求。

**参数:**
- `url`: 要取消的请求 URL 或 URL 数组

##### `cancelAllRequest(): void`

取消所有正在进行的请求。

### 拦截器类型

#### RequestInterceptors

```typescript
interface RequestInterceptors<T> {
  requestInterceptors?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
  requestInterceptorsCatch?: (err: any) => any;
  responseInterceptors?: (config: T) => T;
  responseInterceptorsCatch?: (err: any) => any;
}
```

## 🔧 高级用法

### 单个请求拦截器

```typescript
const response = await request.request({
  url: '/api/users',
  method: 'POST',
  data: { name: 'John' },
  interceptors: {
    requestInterceptors: (config) => {
      // 为这个特定请求添加特殊处理
      config.headers['X-Request-ID'] = generateRequestId();
      return config;
    },
    responseInterceptors: (response) => {
      // 处理这个特定请求的响应
      return transformResponse(response);
    }
  }
});
```

### 错误处理

```typescript
try {
  const response = await request.request({
    url: '/api/users',
    method: 'GET'
  });
} catch (error) {
  if (error.response) {
    // 服务器响应了错误状态码
    console.error('响应错误:', error.response.status, error.response.data);
  } else if (error.request) {
    // 请求已发出但没有收到响应
    console.error('请求错误:', error.request);
  } else {
    // 设置请求时发生错误
    console.error('错误:', error.message);
  }
}
```

### 请求取消

```typescript
// 发送请求
const responsePromise = request.request({
  url: '/api/long-running-task',
  method: 'POST'
});

// 在某个时刻取消请求
setTimeout(() => {
  request.cancelRequest('/api/long-running-task');
}, 5000);

// 或者取消所有请求
request.cancelAllRequest();
```

## 📝 类型定义

### 基础类型

```typescript
// 请求配置
interface RequestConfig<T = AxiosResponse> extends InternalAxiosRequestConfig {
  interceptors?: RequestInterceptors<T>;
}

// 拦截器
interface RequestInterceptors<T> {
  requestInterceptors?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
  requestInterceptorsCatch?: (err: any) => any;
  responseInterceptors?: (config: T) => T;
  responseInterceptorsCatch?: (err: any) => any;
}

// 创建配置
interface CreateRequestConfig<T = AxiosResponse> extends CreateAxiosDefaults {
  interceptors?: RequestInterceptors<T>;
}
```

## 🧪 开发

### 本地开发

```bash
# 克隆仓库
git clone <repository-url>
cd tang-npm-monorepo

# 安装依赖
pnpm install

# 进入 request 包目录
cd packages/request

# 开发模式（监听文件变化）
pnpm dev

# 构建
pnpm build

# 清理构建文件
pnpm clean
```

### 测试构建

```bash
# 构建项目
pnpm build

# 检查构建结果
ls -la dist/
```

## 📦 发布

```bash
# 发布补丁版本
pnpm run publish:patch

# 发布次要版本
pnpm run publish:minor

# 发布主要版本
pnpm run publish:major
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [Axios 官方文档](https://axios-http.com/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [NPM 包页面](https://www.npmjs.com/package/@tang-npm/request) 