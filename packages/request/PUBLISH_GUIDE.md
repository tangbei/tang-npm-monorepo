# 发布指南

## 发布前准备

1. **确保代码已提交**：
   ```bash
   git add .
   git commit -m "feat: prepare for release"
   git push
   ```

2. **检查构建**：
   ```bash
   pnpm build
   ```

3. **检查 dist 目录**：
   ```bash
   ls -la dist/
   ```

## 发布方式

### 方式1：使用 npm 命令

```bash
# 发布补丁版本 (1.0.0 -> 1.0.1)
npm run publish:patch

# 发布次要版本 (1.0.0 -> 1.1.0)
npm run publish:minor

# 发布主要版本 (1.0.0 -> 2.0.0)
npm run publish:major
```

### 方式2：手动发布

```bash
# 1. 更新版本号
npm version patch  # 或 minor, major

# 2. 构建
pnpm build

# 3. 发布
npm publish
```

### 方式3：使用发布脚本

```bash
# 给脚本添加执行权限
chmod +x scripts/publish.sh

# 运行发布脚本
./scripts/publish.sh
```

## 发布检查清单

- [ ] 代码已提交到 git
- [ ] 构建成功 (`pnpm build`)
- [ ] dist 目录存在且包含正确文件
- [ ] package.json 中的版本号正确
- [ ] 已登录 npm (`npm whoami`)
- [ ] 有发布权限

## 常见问题

### 1. 发布失败 - 权限不足
```bash
npm login
npm whoami  # 检查是否登录
```

### 2. 包名冲突
检查 package.json 中的 `name` 字段是否唯一

### 3. 版本号问题
```bash
npm version patch  # 自动更新版本号
```

## 发布后验证

1. 检查 npm 官网：https://www.npmjs.com/package/@tang-npm/request
2. 测试安装：
   ```bash
   npm install @tang-npm/request
   ```
3. 测试导入：
   ```javascript
   import Request from '@tang-npm/request';
   ```

## 回滚发布

如果发布有问题，可以回滚：

```bash
# 1. 删除已发布的版本
npm unpublish @tang-npm/request@1.0.0

# 2. 注意：npm 不允许在发布后 72 小时内重新发布相同版本
# 3. 需要发布新版本
npm version patch
npm publish
``` 