# @tang-npm/request

A TypeScript HTTP request library based on Axios with enhanced interceptor support.

## Features

- 🚀 Built with TypeScript
- 🔧 Axios-based HTTP client
- 🎯 Request/Response interceptors
- 📦 Tree-shaking support
- 🎨 Multiple module formats (CJS, ESM)
- 📝 Full TypeScript declarations

## Installation

```bash
npm install @tang-npm/request
# or
yarn add @tang-npm/request
# or
pnpm add @tang-npm/request
```

## Usage

### Basic Usage

```typescript
import Request from '@tang-npm/request';

const request = new Request({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer token'
  }
});

// Make a request
const response = await request.request({
  url: '/users',
  method: 'GET'
});
```

### With Interceptors

```typescript
import Request from '@tang-npm/request';

const request = new Request({
  baseURL: 'https://api.example.com',
  interceptors: {
    requestInterceptors: (config) => {
      console.log('Request:', config);
      return config;
    },
    responseInterceptors: (response) => {
      console.log('Response:', response);
      return response;
    }
  }
});
```

## API

### Request Class

#### Constructor Options

- `baseURL`: Base URL for all requests
- `timeout`: Request timeout in milliseconds
- `headers`: Default headers
- `interceptors`: Request/Response interceptors

#### Methods

- `request<T>(config)`: Make an HTTP request
- `cancelRequest(url)`: Cancel a specific request
- `cancelAllRequest()`: Cancel all pending requests

### Interceptors

- `requestInterceptors`: Modify request config before sending
- `responseInterceptors`: Modify response data before returning
- `requestInterceptorsCatch`: Handle request errors
- `responseInterceptorsCatch`: Handle response errors

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev

# Clean dist
pnpm clean
```

## License

MIT 