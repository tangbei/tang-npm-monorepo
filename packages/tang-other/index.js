// 引入 npm-helper 包
const npmHelper = require('@tanggoat/npm-helper');

/**
 * tang-other 包的主要功能
 */
class TangOther {
  constructor() {
    this.name = '@tanggoat/tang-other';
    this.version = require('./package.json').version;
  }

  /**
   * 获取包信息
   */
  getInfo() {
    return {
      name: this.name,
      version: this.version,
      description: 'tang-other 项目包'
    };
  }

  /**
   * 使用 npm-helper 检查发布环境
   */
  async checkPublishEnvironment() {
    try {
      console.log('🔍 检查发布环境...');
      await npmHelper.check();
      console.log('✅ 发布环境检查通过');
      return true;
    } catch (error) {
      console.error('❌ 发布环境检查失败:', error.message);
      return false;
    }
  }

  /**
   * 使用 npm-helper 执行发布流程
   */
  async publish() {
    try {
      console.log('🚀 开始发布流程...');
      await npmHelper.publish();
      console.log('✅ 发布成功');
      return true;
    } catch (error) {
      console.error('❌ 发布失败:', error.message);
      return false;
    }
  }

  /**
   * 使用 npm-helper 管理 registry
   */
  async manageRegistry() {
    try {
      console.log('🔧 管理 npm registry...');
      await npmHelper.registry();
      return true;
    } catch (error) {
      console.error('❌ Registry 管理失败:', error.message);
      return false;
    }
  }

  /**
   * 示例工具函数
   */
  formatMessage(message) {
    return `[${this.name}] ${message}`;
  }
}

// 创建实例
const tangOther = new TangOther();

// 导出模块
module.exports = {
  TangOther,
  tangOther,
  // 直接导出 npm-helper 功能
  npmHelper,
  // 便捷方法
  check: () => tangOther.checkPublishEnvironment(),
  publish: () => tangOther.publish(),
  registry: () => tangOther.manageRegistry(),
  formatMessage: (msg) => tangOther.formatMessage(msg)
};

// 如果直接运行此文件，显示包信息
if (require.main === module) {
	const command = process.argv[2];
	
	switch (command) {
		case 'check':
			tangOther.checkPublishEnvironment();
			break;
		case 'registry':
			tangOther.manageRegistry();
			break;
		case 'publish':
		case 'release':
		default:
			tangOther.publish();
			break;
	}
}