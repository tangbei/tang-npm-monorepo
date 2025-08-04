#!/usr/bin/env node

/**
 * CLI调试版本
 * 用于调试命令行参数结构
 */

import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';

const program = new Command();

const pkg = require(path.resolve(__dirname, '../package.json'));

const debugAction = (...args: any[]) => {
  console.log(chalk.cyan('=== DEBUG INFO ==='));
  console.log(chalk.yellow('PACK-STARTER当前版本号：'), chalk.green(pkg.version));
  console.log(chalk.yellow('参数数量：'), chalk.green(args.length));
  
  // 分析参数结构
  args.forEach((arg, index) => {
    console.log(chalk.yellow(`参数 ${index}:`));
    if (typeof arg === 'object' && arg !== null) {
      if (arg._name) {
        console.log(chalk.green('  命令名称：'), arg._name);
      }
      if (arg._optionValues) {
        console.log(chalk.green('  选项值：'), arg._optionValues);
      }
      if (arg.args) {
        console.log(chalk.green('  参数：'), arg.args);
      }
      if (arg.rawArgs) {
        console.log(chalk.green('  原始参数：'), arg.rawArgs);
      }
    } else {
      console.log(chalk.green('  值：'), arg);
    }
  });
  
  // 提取命令名称
  const commandName = args.find(arg => arg._name)?._name || 'unknown';
  console.log(chalk.yellow('检测到的命令：'), chalk.green(commandName));
  
  // 设置环境变量
  if (commandName === 'serve') {
    process.env.NODE_ENV = 'development';
    console.log(chalk.yellow('环境变量设置：'), chalk.green('NODE_ENV=development'));
  } else {
    process.env.NODE_ENV = 'production';
    console.log(chalk.yellow('环境变量设置：'), chalk.green('NODE_ENV=production'));
  }
  
  console.log(chalk.cyan('=================='));
  console.log('');
}

// 设置程序基本信息
program
  .name('pack')
  .description('基于 Webpack 5 的强大构建工具，具有插件架构设计')
  .version('1.0.0');

// 初始化命令
program
  .command('init')
  .alias('i')
  .option('-ph, --path [path]', '指定生成路径')
  .description('生成配置文件到本地')
  .action(debugAction);

// 开发服务器命令
program
  .command('serve')
  .alias('s')
  .option('-p, --port <port>', '端口号', '3000')
  .option('-h, --host <host>', '主机地址', 'localhost')
  .option('-o, --open', '自动打开浏览器')
  .description('运行当前项目')
  .action(debugAction);

// 构建命令
program
  .command('build')
  .alias('b')
  .option('-m, --mode <mode>', '构建模式 (development|production)', 'production')
  .option('-e, --env <env>', '环境 (development|production|test)', 'production')
  .option('-c, --config <path>', '配置文件路径')
  .option('--analyze', '分析包大小')
  .option('--clean', '构建前清理输出目录')
  .option('-pg, --progress', '显示构建进度')
  .description('编译当前项目，编译结果输出到指定(默认dist)目录')
  .action(debugAction);

// 清理命令
program
  .command('clean')
  .alias('c')
  .option('-c, --config <path>', '配置文件路径')
  .description('清理输出目录')
  .action(debugAction);

// 插件命令
program
  .command('plugins')
  .alias('p')
  .description('列出可用插件')
  .action(debugAction);

// 默认命令
program
  .command('*')
  .action(() => {
    program.help();
  });

// 解析命令行参数
program.parse(process.argv); 