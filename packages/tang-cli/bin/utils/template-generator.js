import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 生成项目模板
 * @param {string} templateName 模板名称
 * @param {string} projectName 项目名称
 * @param {string} targetDir 目标目录
 */
export async function generateTemplate(templateName, projectName, targetDir) {
  const templateDir = path.join(__dirname, '../templates', templateName);
  
  // 检查模板是否存在
  if (!await fs.pathExists(templateDir)) {
    throw new Error(`Template ${templateName} not found`);
  }

  // 复制模板文件到目标目录
  await fs.copy(templateDir, targetDir);

  // 替换模板变量
  await replaceTemplateVariables(targetDir, { projectName });

  console.log(`✅ Project ${projectName} created successfully with ${templateName} template!`);
}

/**
 * 替换模板中的变量
 * @param {string} dir 目录路径
 * @param {Object} variables 变量对象
 */
async function replaceTemplateVariables(dir, variables) {
  const files = await getAllFiles(dir);
  
  for (const file of files) {
    if (file.endsWith('.json') || file.endsWith('.html') || file.endsWith('.md')) {
      let content = await fs.readFile(file, 'utf8');
      
      // 替换变量
      for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        content = content.replace(regex, value);
      }
      
      await fs.writeFile(file, content, 'utf8');
    }
  }
}

/**
 * 获取目录下所有文件
 * @param {string} dir 目录路径
 * @returns {Promise<string[]>} 文件路径数组
 */
async function getAllFiles(dir) {
  const files = [];
  
  async function scan(currentDir) {
    const items = await fs.readdir(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = await fs.stat(fullPath);
      
      if (stat.isDirectory()) {
        await scan(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }
  
  await scan(dir);
  return files;
} 