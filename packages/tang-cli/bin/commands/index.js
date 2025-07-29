import { program } from 'commander';
import chalk from 'chalk';
import { help, create } from './options/index.js';

const commands = () => {
  return new Promise((resolve, reject) => {
    program.name(chalk.green('tang-cli')).usage('[global options] command');
    // 版本信息
    program.version(chalk.yellow('1.0.0'), '-v, --version');
    program.option('-F, --framework', 'super vue,react');

    // 创建项目
    create(program, (item) => {
      resolve(item);
    });
    // 帮助信息
    help(program);
    // 解析命令
    program.parse(process.argv);
  });
};
export default commands;