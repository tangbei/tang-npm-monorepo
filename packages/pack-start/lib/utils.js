/**
 * @fileoverview 工具函数集合
 * @author tanggoat
 * @version 1.0.0
 */

const path = require('path');
const fs = require('fs-extra');

/**
 * 验证项目名称是否合法
 * @param {string} name - 项目名称
 * @returns {boolean} 是否合法
 */
function validateProjectName(name) {
  // 项目名称只能包含小写字母、数字、连字符和下划线
  const validNameRegex = /^[a-z0-9-_]+$/;
  return validNameRegex.test(name);
}

/**
 * 检查目录是否为空
 * @param {string} dirPath - 目录路径
 * @returns {boolean} 是否为空
 */
function isDirectoryEmpty(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    return files.length === 0;
  } catch (error) {
    return true; // 如果目录不存在，认为是空的
  }
}

/**
 * 获取模板目录路径
 * @param {string} template - 模板类型
 * @returns {string} 模板目录路径
 */
function getTemplatePath(template) {
  return path.join(__dirname, '..', 'templates', template);
}

/**
 * 复制模板文件到目标目录
 * @param {string} templatePath - 模板路径
 * @param {string} targetPath - 目标路径
 * @param {Object} data - 模板数据
 */
async function copyTemplateFiles(templatePath, targetPath, data = {}) {
  try {
    // 确保目标目录存在
    await fs.ensureDir(targetPath);
    
    // 复制模板文件
    await fs.copy(templatePath, targetPath, {
      overwrite: true,
      filter: (src) => {
        // 过滤掉不需要复制的文件
        const basename = path.basename(src);
        return !basename.startsWith('.') && basename !== 'node_modules';
      }
    });
    
    // 处理模板文件中的变量替换
    await processTemplateFiles(targetPath, data);
    
  } catch (error) {
    throw new Error(`复制模板文件失败: ${error.message}`);
  }
}

/**
 * 处理模板文件中的变量替换
 * @param {string} targetPath - 目标路径
 * @param {Object} data - 替换数据
 */
async function processTemplateFiles(targetPath, data) {
  const files = await fs.readdir(targetPath, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(targetPath, file.name);
    
    if (file.isDirectory()) {
      // 递归处理子目录
      await processTemplateFiles(filePath, data);
    } else if (file.isFile()) {
      // 处理文件内容
      await processFileContent(filePath, data);
    }
  }
}

/**
 * 处理单个文件的内容替换
 * @param {string} filePath - 文件路径
 * @param {Object} data - 替换数据
 */
async function processFileContent(filePath, data) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    
    // 替换模板变量
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      content = content.replace(regex, data[key]);
    });
    
    // 替换特殊占位符
    if (data.projectName) {
      content = content.replace(/PROJECT_NAME/g, data.projectName);
    }
    if (data.description) {
      content = content.replace(/PROJECT_DESCRIPTION/g, data.description);
    }
    if (data.author) {
      content = content.replace(/PROJECT_AUTHOR/g, data.author);
    }
    if (data.version) {
      content = content.replace(/PROJECT_VERSION/g, data.version);
    }
    if (data.packageName) {
      content = content.replace(/PROJECT_PACKAGE_NAME/g, data.packageName);
    }
    
    // 写回文件
    await fs.writeFile(filePath, content, 'utf8');
    
  } catch (error) {
    // 如果文件不是文本文件，忽略错误
    console.warn(`警告: 无法处理文件 ${filePath}: ${error.message}`);
  }
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的大小
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 检查Node.js版本是否满足要求
 * @param {string} requiredVersion - 要求的版本
 * @returns {boolean} 是否满足要求
 */
function checkNodeVersion(requiredVersion = '16.0.0') {
  const currentVersion = process.version;
  const required = requiredVersion.split('.').map(Number);
  const current = currentVersion.slice(1).split('.').map(Number);
  
  for (let i = 0; i < Math.max(required.length, current.length); i++) {
    const req = required[i] || 0;
    const cur = current[i] || 0;
    
    if (cur > req) return true;
    if (cur < req) return false;
  }
  
  return true;
}

/**
 * 获取当前工作目录的绝对路径
 * @returns {string} 绝对路径
 */
function getCurrentWorkingDir() {
  return process.cwd();
}

/**
 * 检查是否为有效的包名
 * @param {string} name - 包名
 * @returns {boolean} 是否有效
 */
function isValidPackageName(name) {
  // npm包名规则：只能包含小写字母、数字、连字符和下划线，不能以点或下划线开头
  const validPackageNameRegex = /^[a-z0-9][a-z0-9-_]*$/;
  return validPackageNameRegex.test(name);
}

module.exports = {
  validateProjectName,
  isDirectoryEmpty,
  getTemplatePath,
  copyTemplateFiles,
  processTemplateFiles,
  processFileContent,
  formatFileSize,
  checkNodeVersion,
  getCurrentWorkingDir,
  isValidPackageName
}; 