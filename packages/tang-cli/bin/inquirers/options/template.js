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
        name: 'React + JavaScript',
        value: 'react'
      },
      {
        name: 'React + TypeScript',
        value: 'react-ts'
      }
    ],
    message: 'Select a framework and variant',
  };
};