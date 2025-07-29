const { exec } = require('child_process');
const util = require('util');
const inquirer = require('inquirer');

const execAsync = util.promisify(exec);

/**
 * 获取当前npm registry
 * @returns {Promise<string>}
 */
async function getCurrentRegistry() {
	try {
		const { stdout } = await execAsync('npm config get registry');
		return String(stdout || '').trim();
	} catch (error) {
		console.error('❌ 获取当前npm registry失败:', error.message);
		return 'https://registry.npmjs.org/';
	}
}

/**
 * 设置npm registry
 * @param {string} registry registry地址
 * @returns {Promise<boolean>}
 */
async function setRegistry(registry) {
	try {
		await execAsync(`npm config set registry ${registry}`);
		console.log(`✅ npm registry已设置为: ${registry}`);
		return true;
	} catch (error) {
		console.error('❌ 设置npm registry失败:', error.message);
		return false;
	}
}

/**
 * 显示所有可用的registry
 */
function showAvailableRegistries() {
	console.log('📦 可用的npm registry:');
	console.log('');
	console.log('1. npm官方源');
	console.log('   地址: https://registry.npmjs.org/');
	console.log('   特点: 官方源，更新最及时');
	console.log('');
	console.log('2. 淘宝镜像源');
	console.log('   地址: https://registry.npmmirror.com/');
	console.log('   特点: 国内访问速度快，同步及时');
	console.log('');
  console.log('3. 铭师堂镜像源');
	console.log('   地址: https://tip-npm.mistong.com/');
	console.log('   特点: 国内访问速度快，同步及时');
	console.log('');
	console.log('4. 腾讯镜像源');
	console.log('   地址: https://mirrors.cloud.tencent.com/npm/');
	console.log('   特点: 腾讯云提供，稳定性好');
	console.log('');
	console.log('5. 华为镜像源');
	console.log('   地址: https://mirrors.huaweicloud.com/repository/npm/');
	console.log('   特点: 华为云提供，企业级服务');
	console.log('');
	console.log('6. 自定义registry');
	console.log('   可以设置任何符合npm规范的registry地址');
}

/**
 * 快速切换registry
 * @param {string} registryName registry名称
 * @returns {Promise<boolean>}
 */
async function quickSwitchRegistry(registryName) {
	const registryMap = {
		'npm': 'https://registry.npmjs.org/',
		'taobao': 'https://registry.npmmirror.com/',
    'mistong': 'https://tip-npm.mistong.com/',
		'tencent': 'https://mirrors.cloud.tencent.com/npm/',
		'huawei': 'https://mirrors.huaweicloud.com/repository/npm/'
	};
	
	const registry = registryMap[registryName];
	if (!registry) {
		console.error(`❌ 不支持的registry: ${registryName}`);
		return false;
	}
	
	return await setRegistry(registry);
}

/**
 * 交互式选择registry
 * @returns {Promise<string>}
 */
async function selectRegistry() {
	const currentRegistry = await getCurrentRegistry();
	console.log(`\n📦 当前npm registry: ${currentRegistry}`);
	
	const { registry } = await inquirer.prompt([
		{
			type: 'list',
			name: 'registry',
			message: '选择npm registry:',
			choices: [
				{ name: 'npm官方源 (https://registry.npmjs.org/)', value: 'https://registry.npmjs.org/' },
				{ name: '淘宝镜像源 (https://registry.npmmirror.com/)', value: 'https://registry.npmmirror.com/' },
				{ name: '铭师堂镜像源 (https://tip-npm.mistong.com/)', value: 'https://tip-npm.mistong.com/' },
				{ name: '腾讯镜像源 (https://mirrors.cloud.tencent.com/npm/)', value: 'https://mirrors.cloud.tencent.com/npm/' },
				{ name: '华为镜像源 (https://mirrors.huaweicloud.com/repository/npm/)', value: 'https://mirrors.huaweicloud.com/repository/npm/' },
				{ name: '自定义registry', value: 'custom' }
			]
		}
	]);
	
	if (registry === 'custom') {
		const { customRegistry } = await inquirer.prompt([
			{
				type: 'input',
				name: 'customRegistry',
				message: '请输入自定义registry地址:',
				default: 'https://registry.npmjs.org/',
				validate: (input) => {
					if (input.startsWith('http://') || input.startsWith('https://')) {
						return true;
					}
					return '请输入有效的URL地址';
				}
			}
		]);
		return customRegistry;
	}
	
	return registry;
}

/**
 * 测试registry连接
 * @param {string} registry registry地址
 * @returns {Promise<boolean>}
 */
async function testRegistry(registry) {
	try {
		console.log(`🔍 测试registry连接: ${registry}`);
		const { stdout } = await execAsync(`npm ping --registry ${registry}`);
		console.log('✅ registry连接正常');
		return true;
	} catch (error) {
		console.error('❌ registry连接失败:', error.message);
		return false;
	}
}

/**
 * 主函数
 */
async function main() {
	const command = process.argv[2];
	
	switch (command) {
		case 'list':
		case 'show':
			showAvailableRegistries();
			break;
			
		case 'current':
			const current = await getCurrentRegistry();
			console.log(`📦 当前npm registry: ${current}`);
			break;
			
		case 'test':
			const registryToTest = process.argv[3] || await getCurrentRegistry();
			await testRegistry(registryToTest);
			break;
			
		case 'set':
			const registryToSet = process.argv[3];
			if (registryToSet) {
				await setRegistry(registryToSet);
			} else {
				console.log('❌ 请指定registry地址');
				console.log('用法: node registry.js set <registry-url>');
			}
			break;
			
		case 'switch':
			const registryName = process.argv[3];
			if (registryName) {
				await quickSwitchRegistry(registryName);
			} else {
				console.log('❌ 请指定registry名称');
				console.log('用法: node registry.js switch <npm|taobao|tencent|huawei>');
			}
			break;
			
		default:
			console.log('📦 npm registry 管理工具');
			console.log('');
			console.log('使用方法:');
			console.log('  node registry.js list                   显示所有可用的registry');
			console.log('  node registry.js current                 显示当前registry');
			console.log('  node registry.js test [registry]        测试registry连接');
			console.log('  node registry.js set <registry-url>     设置registry');
			console.log('  node registry.js switch <name>          快速切换registry');
			console.log('');
			console.log('快速切换选项:');
			console.log('  npm      - npm官方源');
			console.log('  taobao   - 淘宝镜像源');
			console.log('  tencent  - 腾讯镜像源');
			console.log('  huawei   - 华为镜像源');
			console.log('');
			console.log('示例:');
			console.log('  node registry.js switch taobao');
			console.log('  node registry.js set https://registry.npmmirror.com/');
			console.log('  node registry.js test');
			break;
	}
}

// 如果直接运行此脚本
if (require.main === module) {
	main();
}

module.exports = {
  main,
	getCurrentRegistry,
	setRegistry,
	selectRegistry,
	quickSwitchRegistry,
	testRegistry,
	showAvailableRegistries
}; 