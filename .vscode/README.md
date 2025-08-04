# VSCode 调试配置指南

## 调试配置说明

本项目已配置好 VSCode 调试环境，支持对 monorepo 中的子应用进行断点调试。

### 可用的调试配置

1. **Debug Pack Starter CLI** - 调试 build 命令
2. **Debug Pack Starter Serve** - 调试 serve 命令  
3. **Debug Pack Starter Init** - 调试 init 命令
4. **Debug Pack Starter with Custom Args** - 自定义参数调试

### 使用方法

1. **设置断点**：
   - 在 TypeScript 源码文件中点击行号左侧设置断点
   - 支持在 `src/` 目录下的所有 `.ts` 文件中设置断点

2. **启动调试**：
   - 按 `F5` 或点击调试面板中的绿色播放按钮
   - 选择对应的调试配置
   - 程序会在断点处停止执行

3. **调试控制**：
   - `F5` - 继续执行
   - `F10` - 单步跳过
   - `F11` - 单步进入
   - `Shift+F11` - 单步跳出
   - `Ctrl+Shift+F5` - 重启调试

### 任务配置

- **Build Pack Starter** - 构建 pack-starter 项目
- **Dev Pack Starter** - 启动开发模式（监听文件变化）
- **Clean Pack Starter** - 清理构建输出
- **Install Dependencies** - 安装依赖

### 快捷键

- `Ctrl+Shift+P` - 打开命令面板
- `Ctrl+Shift+` ` - 打开终端
- `Ctrl+Shift+D` - 打开调试面板

### 注意事项

1. 确保在调试前已经运行过 `npm run build` 生成源码映射文件
2. 调试时会自动使用源码映射，可以直接在 TypeScript 源码中设置断点
3. 如果修改了源码，需要重新构建才能看到最新的调试效果 