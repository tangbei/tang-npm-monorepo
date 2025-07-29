const { exec } = require('child_process');
const util = require('util');
const fs = require('fs');
const path = require('path');

// 获取package.json中的包名
let packageJson, packageName;
try {
	const packageJsonPath = path.join(__dirname, '../package.json');
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
		const latestVersion = stdout.trim().replace(/^v/, ''); // 删除可能存在的前导 v
		return latestVersion;
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

module.exports = {
	getLatestVersion,
	getCurrentVersion,
	packageName
};