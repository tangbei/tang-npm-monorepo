#!/usr/bin/env node

/**
 * @fileoverview 基于webpack的前端脚手架工具主入口文件
 * @author tanggoat
 * @version 1.0.0
 */

const { Command } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const path = require('path');

// 动态确定lib目录路径
const libPath = path.join(__dirname, '..', 'lib');
const { createProject } = require(libPath + '/create');

// 创建命令行程序实例
const program = new Command();

// 显示欢迎信息
function showWelcome() {
  console.log(
    chalk.cyan(
      figlet.textSync('Pack Start', {
        horizontalLayout: 'full',
        font: 'Standard'
      })
    )
  );
  console.log(chalk.gray('🚀 基于webpack5+react18的前端项目脚手架工具\n'));
}

// 设置程序基本信息
program
  .name('pack-start')
  .description('基于webpack5+react18的前端项目脚手架工具')
  .version('1.0.0');

// 创建项目命令
program
  .command('create')
  .description('创建一个新的前端项目')
  .argument('[project-name]', '项目名称')
  .option('-t, --template <template>', '选择模板类型 (react-ts/react)', 'react-ts')
  .option('-y, --yes', '跳过交互式问答，使用默认配置')
  .action(async (projectName, options) => {
    try {
      showWelcome();
      await createProject(projectName, options);
    } catch (error) {
      console.error(chalk.red('❌ 创建项目失败:'), error.message);
      process.exit(1);
    }
  });

// 显示帮助信息
program
  .command('help')
  .description('显示帮助信息')
  .action(() => {
    showWelcome();
    program.help();
  });

// 处理未知命令
program.on('command:*', () => {
  console.error(chalk.red('❌ 错误: 未知命令'));
  console.log(chalk.yellow('💡 使用 --help 查看所有可用命令'));
  process.exit(1);
});

// 解析命令行参数
program.parse(); 