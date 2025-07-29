const { exec } = require('child_process');
const util = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = util.promisify(exec);

/**
 * 检查Node.js版本
 */
async function checkNodeVersion() {
	try {
		const { stdout } = await execAsync('node --version');
		const version = String(stdout || '').trim();
		console.log(`✅ Node.js版本: ${version}`);
		
		// 检查是否为LTS版本
		const majorVersion = parseInt(version.replace('v', '').split('.')[0]);
		if (majorVersion >= 16) {
			console.log('✅ Node.js版本符合要求');
		} else {
			console.log('⚠️  建议使用Node.js 16+ LTS版本');
		}
	} catch (error) {
		console.error('❌ 无法获取Node.js版本:', error.message);
	}
}

/**
 * 检查npm版本
 */
async function checkNpmVersion() {
	try {
		const { stdout } = await execAsync('npm --version');
		const version = String(stdout || '').trim();
		console.log(`✅ npm版本: ${version}`);
	} catch (error) {
		console.error('❌ 无法获取npm版本:', error.message);
	}
}

/**
 * 检查git配置
 */
async function checkGitConfig() {
	try {
		const { stdout: name } = await execAsync('git config user.name');
		const { stdout: email } = await execAsync('git config user.email');
		console.log(`✅ Git配置:`);
		console.log(`   用户名: ${String(name || '').trim()}`);
		console.log(`   邮箱: ${String(email || '').trim()}`);
	} catch (error) {
		console.error('❌ Git配置不完整:', error.message);
		console.log('请运行以下命令配置Git:');
		console.log('git config --global user.name "你的用户名"');
		console.log('git config --global user.email "你的邮箱"');
	}
}

/**
 * 检查远程仓库
 */
async function checkRemoteRepository() {
	try {
		const { stdout } = await execAsync('git remote -v');
		const output = String(stdout || '').trim();
		if (output) {
			console.log('✅ 远程仓库配置:');
			console.log(output);
		} else {
			console.log('❌ 未配置远程仓库');
		}
	} catch (error) {
		console.error('❌ 检查远程仓库失败:', error.message);
	}
}

/**
 * 检查package.json配置
 */
function checkPackageJson() {
	try {
		// 修改为读取当前工作目录下的 package.json
		const packageJsonPath = path.join(process.cwd(), 'package.json');
		const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
		
		console.log('✅ package.json配置检查:');
		console.log(`   包名: ${packageJson.name}`);
		console.log(`   版本: ${packageJson.version}`);
		console.log(`   描述: ${packageJson.description || '未设置'}`);
		console.log(`   主文件: ${packageJson.main || '未设置'}`);
		console.log(`   许可证: ${packageJson.license || '未设置'}`);
		
		// 检查必要字段
		const requiredFields = ['name', 'version'];
		const missingFields = requiredFields.filter(field => !packageJson[field]);
		
		if (missingFields.length > 0) {
			console.log(`❌ 缺少必要字段: ${missingFields.join(', ')}`);
		} else {
			console.log('✅ package.json配置完整');
		}
		
		// 检查是否有.npmignore文件
		const npmignorePath = path.join(__dirname, '../.npmignore');
		if (fs.existsSync(npmignorePath)) {
			console.log('✅ 存在.npmignore文件');
		} else {
			console.log('⚠️  建议创建.npmignore文件来控制发布内容');
		}
		
	} catch (error) {
		console.error('❌ 检查package.json失败:', error.message);
	}
}

/**
 * 检查发布前准备状态
 */
async function checkPublishReadiness() {
	try {
		console.log('🔍 检查发布前准备状态...\n');
		
		await checkNodeVersion();
		await checkNpmVersion();
		checkPackageJson();
		await checkGitConfig();
		await checkRemoteRepository();
		
		console.log('\n📋 发布前检查清单:');
		console.log('□ 确保所有代码已提交到git');
		console.log('□ 确保在正确的分支上 (main/master)');
		console.log('□ 确保npm已登录');
		console.log('□ 确保package.json中的版本号正确');
		console.log('□ 确保.npmignore文件配置正确');
		console.log('□ 确保README.md文件存在且内容完整');
		
		console.log('\n🚀 运行 npm run release 开始发布流程');
	} catch (error) {
		console.error('❌ 检查过程中发生错误:', error.message);
		process.exit(1);
	}
}

// 如果直接运行此脚本
if (require.main === module) {
	checkPublishReadiness();
}

module.exports = {
	checkPublishReadiness,
	checkNodeVersion,
	checkNpmVersion,
	checkGitConfig,
	checkRemoteRepository,
	checkPackageJson
}; 