# npm Registry 管理功能

## 📦 功能概述

npm-helper 工具现在支持在发布时自动切换npm源，支持多种常用的npm镜像源，让发布更加灵活和高效。

## 🚀 支持的 Registry

### 1. npm官方源
- **地址**: `https://registry.npmjs.org/`
- **特点**: 官方源，更新最及时，包最完整
- **适用场景**: 发布到npm官方仓库

### 2. 淘宝镜像源
- **地址**: `https://registry.npmmirror.com/`
- **特点**: 国内访问速度快，同步及时
- **适用场景**: 国内用户发布，访问速度快

### 3. 腾讯镜像源
- **地址**: `https://mirrors.cloud.tencent.com/npm/`
- **特点**: 腾讯云提供，稳定性好
- **适用场景**: 企业级项目发布

### 4. 华为镜像源
- **地址**: `https://mirrors.huaweicloud.com/repository/npm/`
- **特点**: 华为云提供，企业级服务
- **适用场景**: 企业级项目发布

### 5. 自定义Registry
- **特点**: 支持任何符合npm规范的registry地址
- **适用场景**: 私有npm仓库、公司内部registry等

## 🔧 使用方法

### 1. 发布时选择Registry

运行发布命令时，工具会自动提示选择registry：

```bash
pnpm release
```

发布流程会包含registry选择步骤：
```
🚀 开始一键发布流程...

📦 配置npm registry...
📦 当前npm registry: https://registry.npmjs.org/

? 选择npm registry: (使用箭头键选择)
❯ npm官方源 (https://registry.npmjs.org/)
  淘宝镜像源 (https://registry.npmmirror.com/)
  腾讯镜像源 (https://mirrors.cloud.tencent.com/npm/)
  华为镜像源 (https://mirrors.huaweicloud.com/repository/npm/)
  自定义registry
```

### 2. 独立管理Registry

#### 查看当前registry
```bash
pnpm registry current
```

#### 查看所有可用registry
```bash
pnpm registry list
```

#### 快速切换registry
```bash
# 切换到淘宝镜像源
pnpm registry switch taobao

# 切换到npm官方源
pnpm registry switch npm

# 切换到腾讯镜像源
pnpm registry switch tencent

# 切换到华为镜像源
pnpm registry switch huawei
```

#### 设置自定义registry
```bash
pnpm registry set https://your-custom-registry.com/
```

#### 测试registry连接
```bash
# 测试当前registry
pnpm registry test

# 测试指定registry
pnpm registry test https://registry.npmmirror.com/
```

## 📋 完整命令列表

| 命令 | 说明 | 示例 |
|------|------|------|
| `pnpm registry list` | 显示所有可用的registry | - |
| `pnpm registry current` | 显示当前registry | - |
| `pnpm registry test [registry]` | 测试registry连接 | `pnpm registry test https://registry.npmmirror.com/` |
| `pnpm registry set <url>` | 设置registry | `pnpm registry set https://registry.npmmirror.com/` |
| `pnpm registry switch <name>` | 快速切换registry | `pnpm registry switch taobao` |

## 🔍 Registry 选择建议

### 发布场景选择

1. **发布到npm官方仓库**
   - 选择: npm官方源
   - 原因: 确保包能正确发布到npm官方

2. **国内用户发布**
   - 选择: 淘宝镜像源
   - 原因: 访问速度快，同步及时

3. **企业级项目**
   - 选择: 腾讯镜像源 或 华为镜像源
   - 原因: 稳定性好，企业级服务

4. **私有仓库**
   - 选择: 自定义registry
   - 原因: 支持私有npm仓库

### 网络环境选择

1. **国内网络**
   - 推荐: 淘宝镜像源、腾讯镜像源、华为镜像源
   - 优势: 访问速度快，稳定性好

2. **国外网络**
   - 推荐: npm官方源
   - 优势: 更新最及时，包最完整

3. **企业内网**
   - 推荐: 自定义registry（公司内部registry）
   - 优势: 符合企业安全策略

## ⚠️ 注意事项

### 1. 发布权限
- 确保在选择的registry上有发布权限
- 不同registry可能需要不同的账号登录

### 2. 包名冲突
- 不同registry之间包名可能冲突
- 建议使用scope包名避免冲突

### 3. 同步延迟
- 镜像源可能存在同步延迟
- 重要更新建议使用官方源

### 4. 网络稳定性
- 选择稳定的registry避免发布失败
- 可以先用`test`命令测试连接

## 🛠️ 高级用法

### 环境变量配置

可以通过环境变量预设registry：

```bash
# 设置默认registry
export NPM_REGISTRY=https://registry.npmmirror.com/

# 运行发布命令
pnpm release
```

### CI/CD 集成

在CI/CD中自动设置registry：

```yaml
# GitHub Actions 示例
- name: Set npm registry
  run: |
    npm config set registry https://registry.npmmirror.com/
  
- name: Publish package
  run: |
    pnpm release
```

### 批量切换

为多个项目批量切换registry：

```bash
# 脚本示例
for project in */; do
  cd "$project"
  pnpm registry switch taobao
  cd ..
done
```

## 🔗 相关链接

- [npm官方文档](https://docs.npmjs.com/)
- [淘宝npm镜像](https://npmmirror.com/)
- [腾讯npm镜像](https://mirrors.cloud.tencent.com/npm/)
- [华为npm镜像](https://mirrors.huaweicloud.com/repository/npm/) 