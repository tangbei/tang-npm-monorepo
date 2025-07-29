#!/usr/bin/env node

/**
 * tang-other 包使用示例
 * 展示如何使用 npm-helper 进行发包
 */

const { TangOther, check, publish, registry, formatMessage } = require('./index');

async function main() {
  console.log('🚀 tang-other 包使用示例\n');

  // 创建实例
  const tangOther = new TangOther();
  console.log('📦 包信息:', tangOther.getInfo());

  // 示例 1: 格式化消息
  console.log('\n📝 示例 1: 格式化消息');
  console.log(formatMessage('Hello World!'));

  // 示例 2: 检查发布环境
  console.log('\n🔍 示例 2: 检查发布环境');
  console.log('注意: 这需要在实际项目中运行');
  // await check(); // 取消注释以实际运行

  // 示例 3: 发布流程
  console.log('\n🚀 示例 3: 发布流程');
  console.log('注意: 这需要在实际项目中运行');
  // await publish(); // 取消注释以实际运行

  // 示例 4: Registry 管理
  console.log('\n🔧 示例 4: Registry 管理');
  console.log('注意: 这需要在实际项目中运行');
  // await registry(); // 取消注释以实际运行

  console.log('\n✅ 示例运行完成');
  console.log('\n📋 使用说明:');
  console.log('1. 在 tang-other 目录下运行: npm run check');
  console.log('2. 在 tang-other 目录下运行: npm run release');
  console.log('3. 在 tang-other 目录下运行: npm run registry');
}

// 运行示例
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main }; 