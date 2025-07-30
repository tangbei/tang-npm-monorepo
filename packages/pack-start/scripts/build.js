/**
 * @fileoverview 构建脚本
 * @author tanggoat
 * @version 1.0.0
 */

const fs = require('fs-extra');
const path = require('path');

/**
 * 构建脚本主函数
 */
async function build() {
  try {
    console.log('🔨 开始构建...');
    
    // 创建构建输出目录
    const buildDir = path.join(__dirname, '..', 'dist');
    await fs.ensureDir(buildDir);
    
    // 复制bin目录
    const binSrc = path.join(__dirname, '..', 'bin');
    const binDest = path.join(buildDir, 'bin');
    await fs.copy(binSrc, binDest);
    
    // 复制lib目录
    const libSrc = path.join(__dirname, '..', 'lib');
    const libDest = path.join(buildDir, 'lib');
    await fs.copy(libSrc, libDest);
    
    // 复制templates目录
    const templatesSrc = path.join(__dirname, '..', 'templates');
    const templatesDest = path.join(buildDir, 'templates');
    await fs.copy(templatesSrc, templatesDest);
    
    // 复制package.json
    const packageSrc = path.join(__dirname, '..', 'package.json');
    const packageDest = path.join(buildDir, 'package.json');
    await fs.copy(packageSrc, packageDest);
    
    // 复制README.md
    const readmeSrc = path.join(__dirname, '..', 'README.md');
    const readmeDest = path.join(buildDir, 'README.md');
    await fs.copy(readmeSrc, readmeDest);
    
    console.log('✅ 构建完成！构建文件已输出到 dist 目录');
    
  } catch (error) {
    console.error('❌ 构建失败:', error.message);
    process.exit(1);
  }
}

// 执行构建
build(); 