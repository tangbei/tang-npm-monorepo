/**
 * 内置插件定义
 * 提供常用的webpack插件配置
 */

import { Plugin, PluginContext } from '../types';
import { logger } from '../utils/logger';

// HTML 插件
export const htmlPlugin: Plugin = {
  name: 'html',
  version: '1.0.0',
  apply: async (context: PluginContext, options: any = {}) => {
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const pluginConfig = {
      name: 'html',
      options: {
        template: options.template || './public/index.html',
        filename: options.filename || 'index.html',
        inject: options.inject !== false,
        minify: options.minify || false,
        ...options
      }
    };
    context.addPlugin(pluginConfig);
    logger.info('HTML 插件已应用');
  }
};

// CSS 插件
export const cssPlugin: Plugin = {
  name: 'css',
  version: '1.0.0',
  apply: async (context: PluginContext, options: any = {}) => {
    // 添加 CSS 处理规则
    context.addRule({
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            sourceMap: context.config.mode === 'development'
          }
        }
      ]
    });
    
    logger.info('CSS 插件已应用');
  }
};

// 压缩插件
export const minifyPlugin: Plugin = {
  name: 'minify',
  version: '1.0.0',
  apply: async (context: PluginContext, options: any = {}) => {
    const TerserWebpackPlugin = require('terser-webpack-plugin');
    const pluginConfig = {
      name: 'terser',
      options: {
        terserOptions: {
          compress: {
            drop_console: options.dropConsole !== false,
            drop_debugger: options.dropDebugger !== false
          },
          ...options.terserOptions
        },
        ...options
      }
    };
    context.addPlugin(pluginConfig);
    logger.info('压缩插件已应用');
  }
};

// Gzip 压缩插件
export const compressionPlugin: Plugin = {
  name: 'compression',
  version: '1.0.0',
  apply: async (context: PluginContext, options: any = {}) => {
    const CompressionWebpackPlugin = require('compression-webpack-plugin');
    const pluginConfig = {
      name: 'compression',
      options: {
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8,
        ...options
      }
    };
    context.addPlugin(pluginConfig);
    logger.info('压缩插件已应用');
  }
};



// 复制插件
export const copyPlugin: Plugin = {
  name: 'copy',
  version: '1.0.0',
  apply: async (context: PluginContext, options: any = {}) => {
    const CopyWebpackPlugin = require('copy-webpack-plugin');
    const pluginConfig = {
      name: 'copy',
      options: {
        patterns: options.patterns || [
          {
            from: 'public',
            to: '.',
            globOptions: {
              ignore: ['**/index.html']
            }
          }
        ],
        ...options
      }
    };
    context.addPlugin(pluginConfig);
    logger.info('复制插件已应用');
  }
};

// 代码分割插件
export const splitChunksPlugin: Plugin = {
  name: 'split-chunks',
  version: '1.0.0',
  apply: async (context: PluginContext, options: any = {}) => {
    // 配置代码分割
    context.modifyConfig((config) => {
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5
          }
        },
        ...options
      };
      return config;
    });
    
    logger.info('代码分割插件已应用');
  }
};

// 环境变量插件
export const envPlugin: Plugin = {
  name: 'env',
  version: '1.0.0',
  apply: async (context: PluginContext, options: any = {}) => {
    const webpack = require('webpack');
    const pluginConfig = {
      name: 'define',
      options: {
        'process.env.NODE_ENV': JSON.stringify(context.config.mode),
        'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
        ...options.definitions
      }
    };
    context.addPlugin(pluginConfig);
    logger.info('环境变量插件已应用');
  }
};

// 热重载插件
export const hotReloadPlugin: Plugin = {
  name: 'hot-reload',
  version: '1.0.0',
  apply: async (context: PluginContext, options: any = {}) => {
    if (context.config.mode === 'development') {
      const webpack = require('webpack');
      const pluginConfig = {
        name: 'hmr',
        options: {}
      };
      context.addPlugin(pluginConfig);
      logger.info('热重载插件已应用');
    }
  }
};

// 进度条插件 (使用 webpackbar)
export const progressPlugin: Plugin = {
  name: 'progress',
  version: '1.0.0',
  apply: async (context: PluginContext, options: any = {}) => {
    const pluginConfig = {
      name: 'webpackbar',
      options: {
        name: context.config.name || 'pack-starter',
        color: context.context.mode === 'development' ? '#4caf50' : '#3f51b5',
        profile: true,
        reporter: {
          change: (context: any) => {
            // 只在状态变更时输出，避免重复
            if (context.state === 'done') {
              logger.success(`构建完成`);
            }
          },
          done: (context: any) => {
            // 构建完成时的回调
          },
          allDone: (context: any) => {
            // 所有构建任务完成
          },
          beforeAllDone: (context: any) => {
            // 准备完成所有构建任务
          },
          afterAllDone: (context: any) => {
            // 所有构建任务已完成
          }
        },
        ...options
      }
    };
    context.addPlugin(pluginConfig);
    logger.info('进度条插件已应用');
  }
};

// 导出所有内置插件
export const builtinPlugins = {
  html: htmlPlugin,
  css: cssPlugin,
  minify: minifyPlugin,
  compression: compressionPlugin,
  copy: copyPlugin,
  'split-chunks': splitChunksPlugin,
  env: envPlugin,
  'hot-reload': hotReloadPlugin,
  progress: progressPlugin
}; 