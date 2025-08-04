/**
 * Webpack构建器
 * 负责将配置转换为webpack配置并执行构建
 */

import webpack from 'webpack';
import { builtinPlugins } from '../plugins/builtin';
import { PluginManager } from '../plugins/manager';
import { BuildContext, PackConfig } from '../types';
import { logger } from '../utils/logger';

export class WebpackBuilder {
  private config: PackConfig;
  private context: BuildContext;
  private pluginManager: PluginManager;

  constructor(config: PackConfig, context: BuildContext) {
    this.config = config;
    this.context = context;
    this.pluginManager = new PluginManager(config, context);
    
    // 注册内置插件
    this.pluginManager.registerPlugins(builtinPlugins);
  }

  /**
   * 构建项目
   */
  async build(): Promise<void> {
    try {
      // 执行插件
      await this.pluginManager.executePlugins();
      
      // 生成webpack配置
      const webpackConfig = this.generateWebpackConfig();
      
      // 执行构建
      await this.runWebpack(webpackConfig);
    } catch (error) {
      logger.error('构建失败', error);
      throw error;
    }
  }

  /**
   * 启动开发服务器
   */
  async serve(): Promise<void> {
    try {
      logger.info('启动开发服务器...');
      
      // 执行插件
      await this.pluginManager.executePlugins();
      
      // 生成webpack配置
      const webpackConfig = this.generateWebpackConfig();
      
      // 启动开发服务器
      await this.runDevServer(webpackConfig);
    } catch (error) {
      logger.error('启动开发服务器失败', error);
      throw error;
    }
  }

  /**
   * 生成webpack配置
   */
  private generateWebpackConfig(): webpack.Configuration {
    const config: webpack.Configuration = {
      mode: this.config.mode,
      entry: this.config.entry,
      output: {
        path: this.config.output!.path,
        filename: this.config.output!.filename,
        publicPath: this.config.output!.publicPath,
        clean: this.config.output!.clean !== false
      },
      resolve: {
        extensions: this.config.resolve?.extensions || ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: this.config.resolve?.alias || {}
      },
      module: {
        rules: this.config.module?.rules || []
      },
      plugins: this.createWebpackPlugins(),
      optimization: this.createOptimizationConfig(),
      devtool: this.config.mode === 'development' ? 'eval-source-map' : false
    };

    // 添加开发服务器配置
    if (this.config.devServer && this.config.mode === 'development') {
      config.devServer = this.createDevServerConfig();
    }

    return config;
  }

  /**
   * 创建webpack插件
   */
  private createWebpackPlugins(): any[] {
    const plugins: any[] = [];
    const pluginConfigs = this.config.plugins || [];

    for (const pluginConfig of pluginConfigs) {
      const { name, options = {} } = pluginConfig;
      
      try {
        switch (name) {
          case 'html':
            const HtmlWebpackPlugin = require('html-webpack-plugin');
            plugins.push(new HtmlWebpackPlugin(options));
            break;
            
          case 'mini-css-extract':
            const MiniCssExtractPlugin = require('mini-css-extract-plugin');
            plugins.push(new MiniCssExtractPlugin(options));
            break;
            
          case 'terser':
            const TerserWebpackPlugin = require('terser-webpack-plugin');
            plugins.push(new TerserWebpackPlugin(options));
            break;
            
          case 'compression':
            const CompressionWebpackPlugin = require('compression-webpack-plugin');
            plugins.push(new CompressionWebpackPlugin(options));
            break;
            
          case 'copy':
            const CopyWebpackPlugin = require('copy-webpack-plugin');
            plugins.push(new CopyWebpackPlugin(options));
            break;
            
          case 'define':
            plugins.push(new webpack.DefinePlugin(options));
            break;
            
          case 'hmr':
            plugins.push(new webpack.HotModuleReplacementPlugin());
            break;
            
          case 'progress':
          case 'webpackbar':
            const WebpackBar = require('webpackbar');
            plugins.push(new WebpackBar({
              name: 'pack-starter',
              color: '#3f51b5',
              profile: true,
              ...options
            }));
            break;
            
          case 'css':
            // CSS 插件不需要创建 webpack 插件，它只是添加 loader 规则
            // 规则已经在插件执行时添加到了配置中
            break;
            
          default:
            // 对于未知插件，不输出警告，因为可能是自定义插件
            break;
        }
      } catch (error) {
        logger.error(`创建插件失败: ${name}`, error);
      }
    }

    return plugins;
  }

  /**
   * 创建优化配置
   */
  private createOptimizationConfig(): webpack.Configuration['optimization'] {
    const optimization: webpack.Configuration['optimization'] = {};

    if (this.config.optimization?.splitChunks && typeof this.config.optimization.splitChunks === 'object') {
      optimization.splitChunks = this.config.optimization.splitChunks;
    } else if (this.config.optimization?.splitChunks === true) {
      optimization.splitChunks = {
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
          }
        }
      };
    }

    if (this.config.optimization?.minimize) {
      optimization.minimize = true;
      optimization.minimizer = this.config.optimization.minimizer || [];
    }

    return optimization;
  }

  /**
   * 创建开发服务器配置
   */
  private createDevServerConfig(): any {
    const devServer = this.config.devServer || {};
    
    return {
      port: devServer.port || 3000,
      host: devServer.host || 'localhost',
      open: devServer.open !== false,
      hot: devServer.hot !== false,
      historyApiFallback: devServer.historyApiFallback !== false,
      proxy: devServer.proxy || {},
      static: devServer.static || {
        directory: './public',
        publicPath: '/'
      },
      headers: devServer.headers || {},
      compress: true,
      client: {
        overlay: {
          errors: true,
          warnings: false
        }
      }
    };
  }

  /**
   * 运行webpack构建
   */
  private async runWebpack(config: webpack.Configuration): Promise<void> {
    return new Promise((resolve, reject) => {
      webpack(config, (err, stats) => {
        if (err) {
          logger.error('Webpack 编译错误', err);
          reject(err);
          return;
        }

        if (stats) {
          const info = stats.toJson();
          
          if (stats.hasErrors()) {
            logger.error('Webpack 编译失败');
            if (info.errors) {
              logger.error(JSON.stringify(info.errors));
            }
            reject(new Error('Webpack 编译失败'));
            return;
          }

          if (stats.hasWarnings()) {
            logger.warn('Webpack 编译警告');
            if (info.warnings) {
              logger.warn(JSON.stringify(info.warnings));
            }
          }

          logger.info(`Webpack 编译完成，构建时间: ${stats.endTime! - stats.startTime!}ms`);
        }

        resolve();
      });
    });
  }

  /**
   * 运行开发服务器
   */
  private async runDevServer(config: webpack.Configuration): Promise<void> {
    const { default: WebpackDevServer } = await import('webpack-dev-server');
    
    const compiler = webpack(config);
    if (!compiler) {
      throw new Error('创建 webpack 编译器失败');
    }
    const devServer = new WebpackDevServer(config.devServer, compiler);
    
    return new Promise((resolve, reject) => {
      devServer.start()
        .then(() => {
          logger.success(`开发服务器已启动: http://${config.devServer!.host}:${config.devServer!.port}`);
        })
        .catch((error: any) => {
          logger.error('启动开发服务器失败', error);
          reject(error);
        });

      // 处理进程退出
      process.on('SIGINT', () => {
        devServer.stop();
        process.exit(0);
      });
    });
  }

  /**
   * 获取插件管理器
   */
  getPluginManager(): PluginManager {
    return this.pluginManager;
  }

  /**
   * 获取当前配置
   */
  getConfig(): PackConfig {
    return this.config;
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<PackConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
} 