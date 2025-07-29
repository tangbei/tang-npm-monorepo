#!/usr/bin/env node

/**
 * npm-helper - 一键自动tag、发包、引导登录npm的工具
 * 
 * 提供完整的npm包发布流程自动化工具
 */

const { main: releaseMain } = require('../scripts/release');
const { checkPublishReadiness } = require('../scripts/check');
const { main: registryMain } = require('../scripts/registry');

/**
 * 发布方法 - 主入口
 */
async function publish() {
	try {
		console.log('🚀 npm-helper 发布工具启动...\n');
		await releaseMain();
	} catch (error) {
		console.error('❌ 发布过程中发生错误:', error.message);
		process.exit(1);
	}
}

/**
 * 检查方法
 */
async function check() {
	try {
		await checkPublishReadiness();
	} catch (error) {
		console.error('❌ 检查过程中发生错误:', error.message);
		process.exit(1);
	}
}

/**
 * Registry管理方法
 */
async function registry() {
	try {
		await registryMain();
	} catch (error) {
		console.error('❌ Registry管理过程中发生错误:', error.message);
		process.exit(1);
	}
}

// 如果直接运行此文件
if (require.main === module) {
	const command = process.argv[2];
	
	switch (command) {
		case 'check':
			check();
			break;
		case 'registry':
			registry();
			break;
		case 'publish':
		case 'release':
		default:
			publish();
			break;
	}
}

module.exports = {
	publish,
	check,
	registry
}; 