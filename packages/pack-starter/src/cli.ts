#!/usr/bin/env node

/**
 * CLI入口文件
 * 处理命令行参数和主要逻辑
 */

import chalk from 'chalk';
import { Command } from 'commander';
import path from 'path';
import { Service } from './services';

const program = new Command();

const pkg = require(path.resolve(__dirname, '../package.json'));

const commonAction = async (...args: any[]) => {
  console.log(`PACK-STARTER当前版本号：${chalk.green(pkg.version)}`);
  
  // 提取命令名称和选项
  const commandName = args[args.length - 1]._name;
  const options = args[0] || {};
  
  // 设置环境变量
  if (commandName === 'serve') {
    process.env.NODE_ENV = 'development';
  } else if (commandName === 'build') {
    process.env.NODE_ENV = 'production';
  }
  
  console.log('命令名称:', commandName);
  console.log('选项:', options);
  
  try {
    await new Service(commandName).run(options);
  } catch (e) {
    console.log(chalk.red(e as string));
    process.exit(1);
  }
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
  .action(commonAction);

// 开发服务器命令
program
  .command('serve')
  .alias('s')
  .option('-p, --port <port>', '端口号', '3000')
  .option('-h, --host <host>', '主机地址', 'localhost')
  .option('-o, --open', '自动打开浏览器')
  .option('-c, --config <path>', '配置文件路径')
  .option('--hot', '启用热模块替换')
  .description('运行当前项目')
  .action(commonAction);

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
  .action(commonAction);

// 清理命令
program
  .command('clean')
  .alias('c')
  .option('-c, --config <path>', '配置文件路径')
  .description('清理输出目录')
  .action(commonAction);

// 插件命令
program
  .command('plugins')
  .alias('p')
  .description('列出可用插件')
  .action(commonAction);

// 解析命令行参数
program.parse(process.argv);