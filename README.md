# tang-monorepo
monorepo项目


## pnpm使用

### pnpm指令

#### 依赖包安装到工程的根目录
```
  pnpm install react -w
```
> 如果是一个开发依赖的话
```
  pnpm install react -wD
```

#### 给某个package单独安装指定依赖
```
  pnpm add axios --filter @tang/cli
```