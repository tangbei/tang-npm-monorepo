/**
 * @fileoverview 项目创建核心逻辑
 * @author tanggoat
 * @version 1.0.0
 */

const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const fs = require('fs-extra');
const { execa } = require('execa');
const { generateProject } = require('./generator');
const { validateProjectName } = require('./utils');

/**
 * 创建项目的入口函数
 * @param {string} projectName - 项目名称
 * @param {Object} options - 命令行选项
 */
async function createProject(projectName, options = {}) {
  try {
    // 获取项目配置信息
    const config = await getProjectConfig(projectName, options);
    
    // 验证项目名称
    if (!validateProjectName(config.projectName)) {
      throw new Error('项目名称只能包含小写字母、数字、连字符和下划线');
    }

    // 检查项目目录是否已存在
    const projectPath = path.resolve(process.cwd(), config.projectName);
    if (fs.existsSync(projectPath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: chalk.yellow(`目录 ${config.projectName} 已存在，是否覆盖？`),
          default: false
        }
      ]);

      if (!overwrite) {
        console.log(chalk.gray('❌ 操作已取消'));
        return;
      }

      // 删除已存在的目录
      await fs.remove(projectPath);
    }

    // 显示创建进度
    const spinner = ora('正在创建项目...').start();

    try {
      // 生成项目文件
      await generateProject(config);
      
      spinner.succeed('项目创建成功！');

      // 显示后续步骤
      showNextSteps(config);

      // 询问是否立即安装依赖
      const { installDeps } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'installDeps',
          message: '是否立即安装项目依赖？',
          default: true
        }
      ]);

      if (installDeps) {
        await installDependencies(config.projectName);
      }

    } catch (error) {
      spinner.fail('项目创建失败');
      throw error;
    }

  } catch (error) {
    console.error(chalk.red('❌ 错误:'), error.message);
    throw error;
  }
}

/**
 * 获取项目配置信息
 * @param {string} projectName - 项目名称
 * @param {Object} options - 命令行选项
 * @returns {Object} 项目配置
 */
async function getProjectConfig(projectName, options) {
  const config = {
    projectName: '',
    template: 'react-ts',
    description: '',
    author: '',
    version: '1.0.0'
  };

  // 如果提供了项目名称，直接使用
  if (projectName) {
    config.projectName = projectName;
  } else {
    // 交互式获取项目名称
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '请输入项目名称:',
        validate: (input) => {
          if (!input.trim()) {
            return '项目名称不能为空';
          }
          if (!validateProjectName(input)) {
            return '项目名称只能包含小写字母、数字、连字符和下划线';
          }
          return true;
        }
      }
    ]);
    config.projectName = name;
  }

  // 如果指定了跳过交互，使用默认配置
  if (options.yes) {
    config.template = options.template || 'react-ts';
    config.description = `${config.projectName} - 基于webpack5+react18的前端项目`;
    config.author = 'Developer';
  } else {
    // 交互式获取其他配置
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: '请选择项目模板:',
        choices: [
          { name: 'TypeScript + React18', value: 'react-ts' },
          { name: 'JavaScript + React18', value: 'react' }
        ],
        default: options.template || 'react-ts'
      },
      {
        type: 'input',
        name: 'description',
        message: '项目描述:',
        default: `${config.projectName} - 基于webpack5+react18的前端项目`
      },
      {
        type: 'input',
        name: 'author',
        message: '作者:',
        default: 'Developer'
      }
    ]);

    config.template = answers.template;
    config.description = answers.description;
    config.author = answers.author;
  }

  return config;
}

/**
 * 安装项目依赖
 * @param {string} projectName - 项目名称
 */
async function installDependencies(projectName) {
  const projectPath = path.resolve(process.cwd(), projectName);
  
  console.log(chalk.blue('\n📦 正在安装项目依赖...'));
  
  const spinner = ora('安装依赖中...').start();
  
  try {
    // 切换到项目目录
    process.chdir(projectPath);
    
    // 安装依赖
    await execa('npm', ['install'], { 
      stdio: 'pipe',
      cwd: projectPath 
    });
    
    spinner.succeed('依赖安装完成！');
    
    console.log(chalk.green('\n🎉 项目创建并配置完成！'));
    console.log(chalk.blue(`\n📁 项目位置: ${projectPath}`));
    console.log(chalk.blue('🚀 开始开发:'));
    console.log(chalk.gray(`  cd ${projectName}`));
    console.log(chalk.gray('  npm run dev'));
    
  } catch (error) {
    spinner.fail('依赖安装失败');
    console.error(chalk.red('请手动运行 npm install 安装依赖'));
    throw error;
  }
}

/**
 * 显示后续步骤
 * @param {Object} config - 项目配置
 */
function showNextSteps(config) {
  console.log(chalk.green('\n✅ 项目创建成功！'));
  console.log(chalk.blue('\n📋 后续步骤:'));
  console.log(chalk.gray(`  1. cd ${config.projectName}`));
  console.log(chalk.gray('  2. npm install'));
  console.log(chalk.gray('  3. npm run dev'));
  console.log(chalk.gray('  4. 在浏览器中打开 http://localhost:3000'));
}

module.exports = {
  createProject
}; 