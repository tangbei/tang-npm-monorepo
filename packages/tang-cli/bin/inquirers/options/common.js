import chalk from 'chalk';

/**
 * 选择是否支持ts
 * @returns 
 */
export const changeVariant = () => {
  return {
    type: 'list',
    name: 'supportTs',
    choices: [
      {
        name: 'true',
      },
      {
        name: 'false',
      }
    ],
    message: 'Support TS(default by javascript)',
  };
};

/**
 * 输入项目名称
 * @returns 
 */
export const inputProjectName = () => {
  return {
    type: 'input',
    name: 'projectName',
    default: 'vite-app-project',
    validate: function (appName) {
      var done = this.async();
      var reg = /^[a-zA-Z][-_a-zA-Z0-9]/;
      if (!reg.test(appName)) {
        done(chalk.red(`<app-name>项目名称必须以字母开头且长度大于2，请重新输入！`));
      }
      done(null, true);
    },
    message: 'Project name',
  };
};