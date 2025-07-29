#!/usr/bin/env node

/**
 * tang-npm - 一键自动tag、发包、引导登录npm的工具
 * 
 * 提供完整的npm包发布流程自动化工具
 */

const { main: release } = require('../scripts/release');
const { checkPublishReadiness } = require('../scripts/check');

/**
 * 检查发布环境
 */
function check() {
	return checkPublishReadiness();
}

/**
 * 执行发布流程
 */
function publish() {
	return release();
}

// 如果直接运行此文件
if (require.main === module) {
	const command = process.argv[2];
	
	switch (command) {
		case 'check':
			check();
			break;
		case 'release':
		case 'publish':
			publish();
			break;
		default:
			console.log('tang-npm - 一键自动tag、发包、引导登录npm的工具');
			console.log('');
			console.log('使用方法:');
			console.log('  node index.js check    检查发布环境');
			console.log('  node index.js release  执行发布流程');
			console.log('');
			console.log('或者使用npm脚本:');
			console.log('  npm run check    检查发布环境');
			console.log('  npm run release  执行发布流程');
			break;
	}
}

module.exports = {
	check,
	publish,
	release
}; 