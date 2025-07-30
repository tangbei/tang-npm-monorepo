/**
 * @description 创建项目指令
 */
import inquirer from 'inquirer';
import { changeTemplate, changeVariant, inputProjectName } from "../../inquirers/options/index.js";
import { InvalidArgumentError } from 'commander';
import chalk from 'chalk';
import { hasTemplate, getSupportTs, generateTemplate } from '../../utils/index.js';
import path from 'path';
import fs from 'fs-extra';

const create = (program, call) => {
  program
    .command("create")
    .argument("<build-method>", "build tools", validateBuildMethod)
    .argument("[app-name]", "app name", validateAppName)
    .description("create a new project powered by tang-cli")
    .option("-t, --template <value>", "create a new project by template", validateTemplate)
    .action(async (method, projectName, option) => {
      let item = {};
       // 判断用户是否输入 projectName 
       if (!projectName) {
         item = await inquirer.prompt([inputProjectName(), changeTemplate(), changeVariant()]);
         // string转为boolean
         item.supportTs = item.supportTs === 'true' ? true : false
         await createProject(method, item);
         return call && call({ method, ...item });
       }
      // 如果用户没有输入 模板参数，则提供项目类型选择 react/vue
      if (!option.template) {
        item = await getFramework(option);
        item.supportTs = item.supportTs === 'true' ? true : false
      } else {
        item = option;
        item.supportTs = getSupportTs(item.template)
      }
      await createProject(method, { projectName, ...item });
      call && call({ method, projectName, ...item });
    });
};

/**
 * 创建项目
 * @param {string} method 构建方法
 * @param {Object} options 选项
 */
async function createProject(method, options) {
  const { projectName, template, supportTs } = options;
  
  // 确定模板名称
  let templateName = template;
  if (supportTs && !template.endsWith('-ts')) {
    templateName = `${template}-ts`;
  }
  
  // 验证模板是否存在
  if (!hasTemplate(templateName)) {
    console.error(chalk.red(`❌ Template ${templateName} is not supported`));
    process.exit(1);
  }
  
  // 创建项目目录
  const targetDir = path.resolve(process.cwd(), projectName);
  
  // 检查目录是否已存在
  if (await fs.pathExists(targetDir)) {
    console.error(chalk.red(`❌ Directory ${projectName} already exists`));
    process.exit(1);
  }
  
  try {
    // 生成项目模板
    await generateTemplate(templateName, projectName, targetDir);
    
    // 显示后续步骤
    console.log(chalk.green('\n🎉 Project created successfully!'));
    console.log(chalk.cyan('\nNext steps:'));
    console.log(chalk.white(`  cd ${projectName}`));
    console.log(chalk.white('  npm install'));
    console.log(chalk.white('  npm run dev'));
    console.log(chalk.white('\nHappy coding! 🚀'));
    
  } catch (error) {
    console.error(chalk.red(`❌ Failed to create project: ${error.message}`));
    process.exit(1);
  }
}

/**
 * @description 校验构建方式
 * @param {String} appName 项目名称
 * @returns appName
 */
function validateBuildMethod(val) {
  if (val === 'vite') return val;
  else
    throw new InvalidArgumentError(
      chalk.red(
        `
        "<build-method>构建方式，只支持值为：${chalk.green("vite")}!请重新输入`
      )
    );
}

/**
 * @description 校验项目名称
 * @param {String} appName 项目名称
 * @returns appName
 */
function validateAppName(appName) {
  var reg = /^[a-zA-Z][-_a-zA-Z0-9]/;
  if (!reg.test(appName)) {
    throw new InvalidArgumentError(
      chalk.red(`<app-name>项目名称必须以字母开头且长度大于2，请重新输入！`)
    );
  }
  return appName;
}

/**
 * @description 校验模板
 * @param {String} template 模板名称
 * @returns template
 */
function validateTemplate(template) {
  if (hasTemplate(template)) return template
  else {
   console.log(chalk.white(`error: option '-t, --template <value>' argument '${template}' is invalid`))
  }
}

async function getFramework() {
  let answer = await inquirer.prompt([changeTemplate(), changeVariant()]);
  return answer;
}

export default create;