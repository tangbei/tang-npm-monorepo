/**
 * @description 创建项目指令
 */
import inquirer from 'inquirer';
import { changeTemplate, changeVariant, inputProjectName } from "../../inquirers/options/index.js";
import { InvalidArgumentError } from 'commander';
import chalk from 'chalk';
import { hasTemplate, getSupportTs } from '../../utils/index.js';

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
      call && call({ method, projectName, ...item });
    });
};

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