/**
 * 插件管理器
 * 负责插件的注册、加载和执行
 */

import { Plugin, PluginConfig, PluginContext, PackConfig, BuildContext } from '../types';
import { logger } from '../utils/logger';

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private config: PackConfig;
  private context: BuildContext;

  constructor(config: PackConfig, context: BuildContext) {
    this.config = config;
    this.context = context;
  }

  /**
   * 注册插件
   */
  registerPlugin(name: string, plugin: Plugin): void {
    if (this.plugins.has(name)) {
      logger.warn(`插件 "${name}" 已注册，正在覆盖...`);
    }
    
    this.plugins.set(name, plugin);
    logger.debug(`插件已注册: ${name}`);
  }

  /**
   * 获取插件
   */
  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * 检查插件是否存在
   */
  hasPlugin(name: string): boolean {
    return this.plugins.has(name);
  }

  /**
   * 获取所有插件名称
   */
  getPluginNames(): string[] {
    return Array.from(this.plugins.keys());
  }

  /**
   * 执行插件
   */
  async executePlugins(): Promise<void> {
    const pluginConfigs = this.config.plugins || [];
    const executedPlugins = new Set<string>();
    
    for (const pluginConfig of pluginConfigs) {
      if (!executedPlugins.has(pluginConfig.name)) {
        await this.executePlugin(pluginConfig);
        executedPlugins.add(pluginConfig.name);
      }
    }
  }

  /**
   * 执行单个插件
   */
  private async executePlugin(pluginConfig: PluginConfig): Promise<void> {
    const { name, options = {}, enabled = true } = pluginConfig;

    if (!enabled) {
      logger.debug(`插件 "${name}" 已禁用，跳过...`);
      return;
    }

    const plugin = this.plugins.get(name);
    if (!plugin) {
      logger.warn(`插件 "${name}" 未找到，跳过...`);
      return;
    }

    try {
      // 创建插件上下文
      const pluginContext: PluginContext = {
        config: this.config,
        context: this.context,
        addPlugin: (newPlugin: PluginConfig) => {
          this.config.plugins = this.config.plugins || [];
          this.config.plugins.push(newPlugin);
        },
        addRule: (rule: any) => {
          this.config.module = this.config.module || {};
          this.config.module.rules = this.config.module.rules || [];
          this.config.module.rules.push(rule);
        },
        addAlias: (alias: Record<string, string>) => {
          this.config.resolve = this.config.resolve || {};
          this.config.resolve.alias = this.config.resolve.alias || {};
          Object.assign(this.config.resolve.alias, alias);
        },
        modifyConfig: (modifier: (config: PackConfig) => PackConfig) => {
          this.config = modifier(this.config);
        }
      };

      // 执行插件
      if (typeof plugin.apply === 'function') {
        await plugin.apply(pluginContext, options);
      }

      // logger.success(`插件 "${name}" 执行成功`);
    } catch (error) {
      logger.error(`执行插件 "${name}" 失败`, error);
      throw error;
    }
  }

  /**
   * 批量注册插件
   */
  registerPlugins(plugins: Record<string, Plugin>): void {
    for (const [name, plugin] of Object.entries(plugins)) {
      this.registerPlugin(name, plugin);
    }
  }

  /**
   * 移除插件
   */
  removePlugin(name: string): boolean {
    return this.plugins.delete(name);
  }

  /**
   * 清空所有插件
   */
  clearPlugins(): void {
    this.plugins.clear();
  }

  /**
   * 获取插件数量
   */
  getPluginCount(): number {
    return this.plugins.size;
  }

  /**
   * 验证插件配置
   */
  validatePluginConfig(pluginConfig: PluginConfig): boolean {
    if (!pluginConfig.name) {
      logger.error('插件配置必须包含 "name" 字段');
      return false;
    }

    if (!this.plugins.has(pluginConfig.name)) {
      logger.warn(`插件 "${pluginConfig.name}" 未注册`);
      return false;
    }

    return true;
  }

  /**
   * 获取插件信息
   */
  getPluginInfo(name: string): { name: string; version?: string } | null {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      return null;
    }

    return {
      name: plugin.name,
      version: plugin.version
    };
  }

  /**
   * 列出所有插件信息
   */
  listPlugins(): Array<{ name: string; version?: string }> {
    return Array.from(this.plugins.values()).map(plugin => ({
      name: plugin.name,
      version: plugin.version
    }));
  }
} 