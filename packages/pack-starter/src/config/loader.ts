/**
 * 配置加载器
 * 负责读取和处理packrc.js配置文件
 */

import path from 'path';
import { FileUtils } from '../utils/file';
import { logger } from '../utils/logger';
import { PackConfig, BuildMode, Environment } from '../types';

export class ConfigLoader {
  private static readonly CONFIG_FILES = [
    'packrc.js',
    'packrc.ts',
    'pack.config.js',
    'pack.config.ts',
    'packrc.json',
    'pack.config.json'
  ];

  /**
   * 加载配置文件
   */
  static async loadConfig(cwd: string, configPath?: string): Promise<PackConfig> {
    try {
      let config: PackConfig;

      if (configPath) {
        // 使用指定的配置文件
        config = await this.loadFromPath(configPath, cwd);
      } else {
        // 自动查找配置文件
        config = await this.findAndLoadConfig(cwd);
      }

      // 验证和标准化配置
      return this.normalizeConfig(config, cwd);
    } catch (error) {
      logger.error('加载配置失败', error);
      throw error;
    }
  }

  /**
   * 从指定路径加载配置
   */
  private static async loadFromPath(configPath: string, cwd: string): Promise<PackConfig> {
    const absolutePath = FileUtils.absolute(configPath, cwd);
    
    if (!(await FileUtils.exists(absolutePath))) {
      throw new Error(`配置文件未找到: ${absolutePath}`);
    }

    const ext = FileUtils.getExt(absolutePath);
    
    if (ext === '.json') {
      return await FileUtils.readJson<PackConfig>(absolutePath);
    } else {
      // 动态导入JS/TS文件
      return await this.loadJsConfig(absolutePath);
    }
  }

  /**
   * 查找并加载配置文件
   */
  private static async findAndLoadConfig(cwd: string): Promise<PackConfig> {
    for (const configFile of this.CONFIG_FILES) {
      const configPath = FileUtils.join(cwd, configFile);
      
      if (await FileUtils.exists(configPath)) {
        return await this.loadFromPath(configPath, cwd);
      }
    }

    // 如果没有找到配置文件，返回默认配置
    logger.warn('未找到配置文件packrc.js，使用默认配置');
    return this.getDefaultConfig();
  }

  /**
   * 加载JS/TS配置文件
   */
  private static async loadJsConfig(configPath: string): Promise<PackConfig> {
    try {
      // 清除require缓存，确保获取最新配置
      delete require.cache[require.resolve(configPath)];
      
      const config = require(configPath);
      
      // 处理不同的导出方式
      if (typeof config === 'function') {
        return config();
      } else if (config.default) {
        return config.default;
      } else if (config.module && config.module.exports) {
        return config.module.exports;
      } else {
        return config;
      }
    } catch (error) {
      logger.error(`加载 JS 配置文件失败: ${configPath}`, error);
      throw error;
    }
  }

  /**
   * 获取默认配置
   */
  private static getDefaultConfig(): PackConfig {
    return {
      name: 'pack-project',
      version: '1.0.0',
      description: '基于 Webpack 5 的项目',
      entry: './src/index.js',
      output: {
        path: './dist',
        filename: '[name].[contenthash].js',
        publicPath: '/'
      },
      mode: 'development',
      env: 'development',
      plugins: [],
      devServer: {
        port: 3000,
        host: 'localhost',
        open: true,
        hot: true,
        historyApiFallback: true
      },
      optimization: {
        splitChunks: true,
        minimize: false,
        compression: false
      },
      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {}
      },
      module: {
        rules: []
      }
    };
  }

  /**
   * 标准化配置
   */
  private static normalizeConfig(config: PackConfig, cwd: string): PackConfig {
    const normalized = { ...config };

    // 确保必要字段存在
    normalized.name = normalized.name || 'pack-project';
    normalized.version = normalized.version || '1.0.0';
    normalized.mode = normalized.mode || 'development';
    normalized.env = normalized.env || 'development';

    // 标准化输出配置
    if (!normalized.output) {
      normalized.output = {};
    }
    normalized.output.path = FileUtils.absolute(normalized.output.path || './dist', cwd);
    normalized.output.filename = normalized.output.filename || '[name].[contenthash].js';
    normalized.output.publicPath = normalized.output.publicPath || '/';

    // 标准化入口配置
    if (normalized.entry) {
      if (typeof normalized.entry === 'string') {
        normalized.entry = FileUtils.absolute(normalized.entry, cwd);
      } else if (Array.isArray(normalized.entry)) {
        normalized.entry = normalized.entry.map(entry => 
          typeof entry === 'string' ? FileUtils.absolute(entry, cwd) : entry
        );
      } else if (typeof normalized.entry === 'object') {
        const normalizedEntry: Record<string, string> = {};
        for (const [key, value] of Object.entries(normalized.entry)) {
          normalizedEntry[key] = typeof value === 'string' ? FileUtils.absolute(value, cwd) : value as string;
        }
        normalized.entry = normalizedEntry;
      }
    }

    // 标准化开发服务器配置
    if (!normalized.devServer) {
      normalized.devServer = {};
    }
    normalized.devServer.port = normalized.devServer.port || 3000;
    normalized.devServer.host = normalized.devServer.host || 'localhost';
    normalized.devServer.open = normalized.devServer.open ?? true;
    normalized.devServer.hot = normalized.devServer.hot ?? true;
    normalized.devServer.historyApiFallback = normalized.devServer.historyApiFallback ?? true;

    // 标准化优化配置
    if (!normalized.optimization) {
      normalized.optimization = {};
    }
    normalized.optimization.splitChunks = normalized.optimization.splitChunks ?? true;
    normalized.optimization.minimize = normalized.optimization.minimize ?? false;
    normalized.optimization.compression = normalized.optimization.compression ?? false;

    // 标准化解析配置
    if (!normalized.resolve) {
      normalized.resolve = {};
    }
    normalized.resolve.extensions = normalized.resolve.extensions || ['.js', '.jsx', '.ts', '.tsx', '.json'];
    normalized.resolve.alias = normalized.resolve.alias || {};

    // 标准化模块配置
    if (!normalized.module) {
      normalized.module = {};
    }
    normalized.module.rules = normalized.module.rules || [];

    // 标准化插件配置
    normalized.plugins = normalized.plugins || [];

    return normalized;
  }

  /**
   * 验证配置
   */
  static validateConfig(config: PackConfig): void {
    const errors: string[] = [];

    if (!config.name) {
      errors.push('配置必须包含 "name" 字段');
    }

    if (!config.entry) {
      errors.push('配置必须包含 "entry" 字段');
    }

    if (!config.output) {
      errors.push('配置必须包含 "output" 字段');
    }

    if (errors.length > 0) {
      throw new Error(`配置验证失败:\n${errors.join('\n')}`);
    }
  }

  /**
   * 合并配置
   */
  static mergeConfig(base: PackConfig, override: Partial<PackConfig>): PackConfig {
    return {
      ...base,
      ...override,
      output: {
        ...base.output,
        ...override.output
      },
      devServer: {
        ...base.devServer,
        ...override.devServer
      },
      optimization: {
        ...base.optimization,
        ...override.optimization
      },
      resolve: {
        ...base.resolve,
        ...override.resolve,
        alias: {
          ...base.resolve?.alias,
          ...override.resolve?.alias
        }
      },
      module: {
        ...base.module,
        ...override.module,
        rules: [
          ...(base.module?.rules || []),
          ...(override.module?.rules || [])
        ]
      },
      plugins: [
        ...(base.plugins || []),
        ...(override.plugins || [])
      ]
    };
  }
} 