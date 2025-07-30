const { exec } = require('child_process');
const util = require('util');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const execAsync = util.promisify(exec);

// 获取package.json中的包名
let packageJson, packageName;
try {
	// 修改为读取当前工作目录下的 package.json
	const packageJsonPath = path.join(process.cwd(), 'package.json');
	packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
	packageName = packageJson.name;
} catch (error) {
	console.error('❌ 无法读取package.json文件:', error.message);
	process.exit(1);
}

/**
 * 获取最新版本号
 * @returns Promise<string>
 */
async function getLatestVersion() {
	try {
		const {stdout} = await exec(`npm show ${packageName} version`);
		// 确保stdout是字符串类型
		const output = String(stdout || '').trim().replace(/^v/, ''); // 删除可能存在的前导 v
		return output;
	} catch (error) {
		console.error(`❌ 获取最新版本失败: ${error.message}`);
		throw error; // 抛出错误，以便可以在调用此函数的地方捕获并处理
	}
}

/**
 * 获取当前本地版本号
 * @returns string
 */
function getCurrentVersion() {
	return packageJson.version;
}

/**
 * 获取下一个patch版本号
 * @param {string} currentVersion 当前版本号
 * @returns {string} 下一个patch版本号
 */
function getNextPatchVersion(currentVersion) {
	const versionParts = currentVersion.split('.');
	if (versionParts.length >= 3) {
		const patch = parseInt(versionParts[2]) + 1;
		return `${versionParts[0]}.${versionParts[1]}.${patch}`;
	}
	// 如果版本号格式不正确，返回当前版本
	return currentVersion;
}

/**
 * 获取下一个预发布版本号
 * @param {string} currentVersion 当前版本号
 * @param {string} prereleaseType 预发布类型 (beta 或 alpha)
 * @returns {string} 下一个预发布版本号
 */
function getNextPrereleaseVersion(currentVersion, prereleaseType) {
	// 检查当前版本是否已经是预发布版本
	const prereleaseMatch = currentVersion.match(new RegExp(`^(\\d+\\.\\d+\\.\\d+)-${prereleaseType}\\.(\\d+)$`));
	
	if (prereleaseMatch) {
		// 如果当前版本已经是同类型的预发布版本，递增预发布号
		const baseVersion = prereleaseMatch[1];
		const prereleaseNumber = parseInt(prereleaseMatch[2]) + 1;
		return `${baseVersion}-${prereleaseType}.${prereleaseNumber}`;
	} else {
		// 如果当前版本不是预发布版本，创建新的预发布版本
		const baseVersion = getNextPatchVersion(currentVersion);
		return `${baseVersion}-${prereleaseType}.1`;
	}
}

/**
 * 选择版本类型
 * @param {string} currentVersion 当前版本
 * @param {string} latestVersion 最新版本
 * @returns {Promise<string>}
 */
async function selectVersionType(currentVersion, latestVersion) {
	console.log(`\n📦 版本信息:`);
	console.log(`   当前版本: ${currentVersion}`);
	console.log(`   最新版本: ${latestVersion}`);
	
	const { versionType } = await inquirer.prompt([
		{
			type: 'list',
			name: 'versionType',
			message: '选择版本更新类型:',
			choices: [
				{ name: '补丁版本 (patch) - 1.0.0 → 1.0.1', value: 'patch' },
				{ name: '次要版本 (minor) - 1.0.0 → 1.1.0', value: 'minor' },
				{ name: '主要版本 (major) - 1.0.0 → 2.0.0', value: 'major' },
				{ name: 'Beta版本 (beta) - 1.0.0 → 1.0.1-beta.1', value: 'beta' },
				{ name: 'Alpha版本 (alpha) - 1.0.0 → 1.0.1-alpha.1', value: 'alpha' },
				{ name: '自定义版本', value: 'custom' }
			]
		}
	]);
	
	if (versionType === 'custom') {
		const { customVersion } = await inquirer.prompt([
			{
				type: 'input',
				name: 'customVersion',
				message: '请输入自定义版本号 (格式: x.y.z 或 x.y.z-beta.n 或 x.y.z-alpha.n):',
				validate: (input) => {
					// 支持标准版本号和预发布版本号
					if (/^\d+\.\d+\.\d+(-\w+\.\d+)?$/.test(input)) {
						return true;
					}
					return '请输入有效的版本号格式 (x.y.z 或 x.y.z-beta.n 或 x.y.z-alpha.n)';
				}
			}
		]);
		return customVersion;
	}
	
	// 处理beta和alpha版本 - 自动递增
	if (versionType === 'beta' || versionType === 'alpha') {
		const newVersion = getNextPrereleaseVersion(currentVersion, versionType);
		console.log(`📝 自动生成${versionType}版本: ${newVersion}`);
		return newVersion;
	}
	
	return versionType;
}

/**
 * 更新版本号
 * @param {string} versionType 版本类型
 * @returns {Promise<string>}
 */
async function updateVersion(versionType) {
	try {
		let newVersion;
		
		if (versionType === 'patch' || versionType === 'minor' || versionType === 'major') {
			const { stdout } = await execAsync(`npm version ${versionType} --no-git-tag-version`);
			newVersion = String(stdout || '').trim().replace(/^v/, '');
		} else {
			// 自定义版本
			const { stdout } = await execAsync(`npm version ${versionType} --no-git-tag-version`);
			newVersion = String(stdout || '').trim().replace(/^v/, '');
		}
		
		console.log(`✅ 版本已更新为: ${newVersion}`);
		return newVersion;
	} catch (error) {
		console.error('❌ 更新版本失败:', error.message);
		throw error;
	}
}

module.exports = {
	getLatestVersion,
	getCurrentVersion,
	getNextPatchVersion,
	getNextPrereleaseVersion,
	selectVersionType,
	updateVersion,
	packageName
};