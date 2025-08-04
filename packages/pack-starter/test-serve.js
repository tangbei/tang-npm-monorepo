#!/usr/bin/env node

/**
 * 测试 serve 命令的脚本
 * 用于验证开发服务器功能是否正常工作
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 开始测试 serve 命令...');

// 切换到测试项目目录
const testProjectPath = path.join(__dirname, 'test-project');
process.chdir(testProjectPath);

console.log(`📁 切换到测试项目目录: ${testProjectPath}`);

// 启动开发服务器
const serveProcess = spawn('node', ['../../dist/cli.js', 'serve', '--port', '3001'], {
  stdio: 'pipe',
  shell: true
});

let serverStarted = false;
let testTimeout;

// 监听输出
serveProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('📤 服务器输出:', output.trim());
  
  // 检查服务器是否启动成功
  if (output.includes('开发服务器已启动') && !serverStarted) {
    serverStarted = true;
    console.log('✅ 开发服务器启动成功!');
    
    // 设置测试超时
    testTimeout = setTimeout(() => {
      console.log('⏰ 测试超时，关闭服务器...');
      serveProcess.kill('SIGINT');
    }, 10000); // 10秒后关闭
  }
});

serveProcess.stderr.on('data', (data) => {
  const error = data.toString();
  console.log('❌ 服务器错误:', error.trim());
});

// 监听进程退出
serveProcess.on('close', (code) => {
  if (testTimeout) {
    clearTimeout(testTimeout);
  }
  
  if (code === 0) {
    console.log('✅ 测试完成，服务器正常关闭');
  } else {
    console.log(`❌ 测试失败，退出码: ${code}`);
  }
});

// 处理进程中断
process.on('SIGINT', () => {
  console.log('🛑 收到中断信号，关闭测试...');
  serveProcess.kill('SIGINT');
  process.exit(0);
});

console.log('🚀 正在启动开发服务器...');
console.log('💡 提示: 按 Ctrl+C 可以停止测试'); 