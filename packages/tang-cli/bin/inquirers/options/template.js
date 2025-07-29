/**
 * 创建项目类型选择
 * @returns 
 */
export const changeTemplate = () => {
  return {
    type: 'list',
    name: 'template',
    choices: [
      {
        name: 'react',
      },
      {
        name: 'vue',
      },
    ],
    message: 'Select a framework',
  };
};