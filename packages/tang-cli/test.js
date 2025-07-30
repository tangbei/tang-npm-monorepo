#!/usr/bin/env node

import { generateTemplate } from './bin/utils/template-generator.js';
import path from 'path';
import fs from 'fs-extra';

async function testTemplateGeneration() {
  const testDir = path.join(process.cwd(), 'test-output');
  
  // 清理测试目录
  if (await fs.pathExists(testDir)) {
    await fs.remove(testDir);
  }
  
  console.log('🧪 Testing template generation...');
  
  try {
    // 测试 React + TypeScript 模板
    await generateTemplate('react-ts', 'test-react-ts', path.join(testDir, 'react-ts'));
    console.log('✅ React + TypeScript template generated successfully');
    
    // 测试 React + JavaScript 模板
    await generateTemplate('react', 'test-react', path.join(testDir, 'react'));
    console.log('✅ React + JavaScript template generated successfully');
    
    console.log('\n🎉 All templates generated successfully!');
    console.log(`📁 Check the generated templates in: ${testDir}`);
    
  } catch (error) {
    console.error('❌ Template generation failed:', error.message);
    process.exit(1);
  }
}

testTemplateGeneration(); 