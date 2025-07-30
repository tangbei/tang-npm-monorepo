const { exec } = require('child_process');
const util = require('util');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const { getLatestVersion, getCurrentVersion, packageName, selectVersionType, updateVersion } = require('./version');
const { selectRegistry, setRegistry } = require('./registry');

const execAsync = util.promisify(exec);

/**
 * 检查npm是否已登录
 * @returns {Promise<boolean>}
 */
async function checkNpmLogin() {
	try {
		const { stdout } = await execAsync('npm whoami');
		const username = String(stdout || '').trim();
		console.log(`✅ 已登录npm，用户名: ${username}`);
		return true;
	} catch (error) {
		console.log('❌ 未登录npm');
		return false;
	}
}

/**
 * 引导用户登录npm
 * @returns {Promise<boolean>}
 */
async function loginToNpm() {
	console.log('\n🔐 需要登录npm才能发布包');
	
	const { shouldLogin } = await inquirer.prompt([
		{
			type: 'confirm',
			name: 'shouldLogin',
			message: '是否现在登录npm？',
			default: true
		}
	]);
	
	if (!shouldLogin) {
		console.log('❌ 取消发布');
		return false;
	}
	
	try {
		console.log('正在打开npm登录页面...');
		await execAsync('npm login');
		console.log('✅ npm登录成功');
		return true;
	} catch (error) {
		console.error('❌ npm登录失败:', error.message);
		return false;
	}
}

/**
 * 检查git状态
 * @returns {Promise<boolean>}
 */
async function checkGitStatus() {
	try {
		const { stdout } = await execAsync('git status --porcelain');
		const output = String(stdout || '').trim();
		if (output) {
			console.log('❌ 有未提交的更改，请先提交更改');
			console.log('未提交的文件:');
			console.log(output);
			return false;
		}
		console.log('✅ git工作区干净');
		return true;
	} catch (error) {
		console.error('❌ 检查git状态失败:', error.message);
		return false;
	}
}

/**
 * 检查是否在正确的分支
 * @returns {Promise<boolean>}
 */
async function checkGitBranch() {
	try {
		const { stdout } = await execAsync('git branch --show-current');
		const currentBranch = String(stdout || '').trim();
		
		if (currentBranch !== 'main' && currentBranch !== 'master') {
			console.log(`⚠️  当前分支: ${currentBranch}`);
			const { shouldContinue } = await inquirer.prompt([
				{
					type: 'confirm',
					name: 'shouldContinue',
					message: '建议在main/master分支发布，是否继续？',
					default: false
				}
			]);
			return shouldContinue;
		}
		
		console.log(`✅ 当前分支: ${currentBranch}`);
		return true;
	} catch (error) {
		console.error('❌ 检查git分支失败:', error.message);
		return false;
	}
}

/**
 * 创建git tag
 * @param {string} version 版本号
 * @returns {Promise<void>}
 */
async function createGitTag(version) {
	await execAsync(`git add .`);
	try {
		await execAsync(`git commit -m "chore: bump version to ${version}"`);
	} catch (error) {
		console.error('❌ 创建git tag失败1:', error.message);
		throw error;
	}
	try {
		await execAsync(`git tag v${version}`);
	} catch (error) {
		console.error('❌ 创建git tag失败2:', error.message);
	}
	try {
		await execAsync(`git push origin HEAD`);
	} catch (error) {
		console.error('❌ 创建git tag失败3:', error.message);
	}
	try {
		await execAsync(`git push origin v${version}`);
		console.log(`✅ Git tag v${version} 已创建并推送`);
	} catch (error) {
		console.error('❌ 创建git tag失败4:', error.message);
	}
}

/**
 * 发布到npm
 * @returns {Promise<void>}
 */
async function publishToNpm() {
	try {
		console.log('🚀 正在发布到npm...');
		await execAsync('npm publish --access public');
		console.log('✅ 发布成功！');
	} catch (error) {
		console.error('❌ 发布失败:', error.message);
		throw error;
	}
}

/**
 * 主函数
 */
async function main() {
	console.log('🚀 开始一键发布流程...\n');
	
	try {
		// 1. 选择npm registry
		console.log('📦 配置npm registry...');
		const selectedRegistry = await selectRegistry();
		const registrySet = await setRegistry(selectedRegistry);
		if (!registrySet) {
			console.log('❌ 无法设置npm registry，退出发布流程');
			return;
		}
		
		// 2. 检查git状态
		console.log('📋 检查git状态...');
		if (!(await checkGitStatus())) {
			return;
		}
		
		// 3. 检查git分支
		console.log('🌿 检查git分支...');
		if (!(await checkGitBranch())) {
			return;
		}
		
		// 4. 获取版本信息
		console.log('📦 获取版本信息...');
		const currentVersion = getCurrentVersion();
		let latestVersion;
		
		try {
			latestVersion = await getLatestVersion();
		} catch (error) {
			console.log('⚠️  无法获取npm上的最新版本，可能是首次发布');
			latestVersion = '0.0.0';
		}
		
		// 5. 选择版本类型
		const versionType = await selectVersionType(currentVersion, latestVersion);
		
		// 6. 确认发布
		const { confirm } = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'confirm',
				message: `确认要发布 ${packageName} 到 ${selectedRegistry} 吗？`,
				default: false
			}
		]);
		
		if (!confirm) {
			console.log('❌ 取消发布');
			return;
		}
		
		// 7. 检查npm登录状态
		console.log('🔐 检查npm登录状态...');
		const isLoggedIn = await checkNpmLogin();
		
		if (!isLoggedIn) {
			const loginSuccess = await loginToNpm();
			if (!loginSuccess) {
				return;
			}
		}
		
		// 8. 更新版本号
		console.log('📝 更新版本号...');
		const newVersion = await updateVersion(versionType);
		
		// 9. 创建git tag
		console.log('🏷️  创建git tag...');
		await createGitTag(newVersion);
		
		// 10. 发布到npm
		await publishToNpm();
		
		console.log('\n🎉 发布完成！');
		console.log(`📦 包名: ${packageName}`);
		console.log(`📋 版本: ${newVersion}`);
		console.log(`🌐 Registry: ${selectedRegistry}`);
		
		// 根据registry生成不同的链接
		if (selectedRegistry.includes('npmmirror.com')) {
			console.log(`🔗 包地址: https://www.npmmirror.com/package/${packageName}`);
		} else if (selectedRegistry.includes('registry.npmjs.org')) {
			console.log(`🔗 包地址: https://www.npmjs.com/package/${packageName}`);
		} else {
			console.log(`🔗 包地址: ${selectedRegistry}${packageName}`);
		}
		
	} catch (error) {
		console.error('❌ 发布过程中发生错误:', error.message);
		process.exit(1);
	}
}

// 如果直接运行此脚本
if (require.main === module) {
	main();
}

module.exports = {
	main,
	checkNpmLogin,
	loginToNpm,
	checkGitStatus,
	checkGitBranch,
	createGitTag,
	publishToNpm
};