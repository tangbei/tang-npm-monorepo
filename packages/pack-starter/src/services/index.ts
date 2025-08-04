/**
 * 服务类
 * 统一处理所有命令的业务逻辑
 */
import readPkg from 'read-pkg';
import webpack from 'webpack';
import * as WebpackChainConfig from 'webpack-chain';
import { WebpackBuilder } from '../build/webpack';
import { getProjectOptions } from '../config/getConfig';
import { ConfigLoader } from '../config/loader';
import { PluginAPI } from '../plugins/PluginAPI';
import { BuildContext, BuildMode, CliOptions, Environment, ICommand, ICommandName, ICommandPlugin, Interceptor, IPackage, PackConfig, ProjectOptions, RequestHandler } from '../types';
import { logger } from '../utils/logger';
import { setDefaultConfig } from '../webpack';

const pluginNameRegEx = /^(@ewt\/|ewt-)plugin-/;

export class Service {
  private commandName: ICommandName;

  /**
   * 指令集
   */
  commands: {
    [name: string]: ICommand;
  } = {};

  context: string;

  pkg: IPackage = {};

  projectOptions: ProjectOptions;

  /**
   * 用于缓存插件动态调用的 chainWebpack 函数
   */
  webpackChainFns: ((webpackChainConfig: WebpackChainConfig) => void)[] = [];

  /**
   * 注册的插件集
   */
  commandPlugins: ICommandPlugin[] = [];

  /**
   * 请求体处理fn
   */
  serverRequestHandlers: RequestHandler[];
  /**
   * 返回体处理fn
   */
  serverResponseHandlers: Interceptor[];

  constructor(commandName: ICommandName) {
    this.commandName = commandName;
    this.context = process.cwd();

    this.pkg = this.getPkg();
    this.projectOptions = commandName === ICommandName.INIT ? {} as ProjectOptions : getProjectOptions();

    this.commandPlugins = this.initCommandsPlugins();

    // console.log('this.commandPlugins---', this.commandPlugins);

    this.serverRequestHandlers = [];
    this.serverResponseHandlers = [];
  }

  init(): void {
    this.commandPlugins.forEach(({ id, fn }) => {
      // 判断 fn 是否是一个方法（函数）
      if (fn && typeof fn === 'function') {
        console.log(`正在初始化插件: ${id}`);
        fn(new PluginAPI(id, this), this.projectOptions);
      }
    });
  }

  /**
   * 获取 package.json
   */
  getPkg(): IPackage {
    return readPkg.sync({ cwd: this.context });
  }

  initCommandsPlugins() {
    const idToPlugin = (id: string) => {
      let fn = require(id);
      // require 会导出一个 { default: [Function] } 的对象，转换一下
      if (typeof fn === 'object' && fn.default) {
        fn = fn.default;
      }
      
      // 确保 fn 是一个函数
      if (typeof fn !== 'function') {
        console.warn(`插件 ${id} 导出的不是一个函数:`, typeof fn);
        return null;
      }
      
      return {
        id: id.replace(/^.\//, 'built-in:'),
        fn,
      };
    };

    const builtInPlugins = [
      '../plugins/commands/init',
      '../plugins/commands/build',
      '../plugins/commands/serve',
    ].map(idToPlugin).filter((plugin): plugin is ICommandPlugin => plugin !== null);

    const { dependencies, devDependencies } = this.pkg;
    const projectPlugins = Object.keys(devDependencies || {})
      .concat(Object.keys(dependencies || {}))
      .filter((packageName) => pluginNameRegEx.test(packageName))
      .map((id) => {
        return idToPlugin(id);
      })
      .filter((plugin): plugin is ICommandPlugin => plugin !== null);

    // TODO: 支持声明本地插件
    return builtInPlugins.concat(projectPlugins);
  }

  /**
   * 获取 webpack JSON 配置
   */
  resolveWebpackConfig(): webpack.Configuration {
    // TODO: 缓存
    const chainableConfig = new WebpackChainConfig.default() as WebpackChainConfig;
    const isProd = process.env.NODE_ENV === 'production';
    // 合并用户自定义的webpack、默认配置
    setDefaultConfig({ 
      config: chainableConfig,
      isProd,
      showProgress: true, // TODO: 默认开启进度条
      userWebpackConfig: this.projectOptions.webpack
    });
    // apply chains
    this.webpackChainFns.forEach((fn) => fn(chainableConfig));

    // 调用用户配置的 chain 函数，优先级最高
    this.projectOptions.webpack?.chain?.(chainableConfig);
    return chainableConfig.toConfig();
  }

  resolveWebpackCompile(): webpack.Compiler {
    const config = this.resolveWebpackConfig();
    // this.projectOptions.server
    // const devServerConfig = getServerConfig();
    const compiler = webpack(config);
    if (!compiler) {
      throw new Error('创建 webpack 编译器失败');
    }
    return compiler;
  }

  /**
   * 执行命令
   */
  run(args: Record<string, string>) {
    this.init();
    const name = this.commandName as string;
    const command = this.commands[name];
    if (!command && name) {
      logger.error(`命令 "${name}" 不存在`);
      process.exit(1);
    }

    const { fn } = command;
    return fn(args);
  }

  /**
   * 处理构建命令
   */
  private async handleBuild(options: CliOptions): Promise<void> {
    logger.info('开始构建项目...');
    
    // 加载配置
    const config = await this.loadConfig(options);
    
    // 更新配置
    const updatedConfig = this.updateBuildConfig(config, options);

    // 创建构建上下文
    const context = this.createBuildContext(updatedConfig, options);

    // 创建构建器并执行构建
    const builder = new WebpackBuilder(updatedConfig, context);
    await builder.build();

    logger.success('构建完成！');
  }

  /**
   * 处理开发服务器命令
   */
  private async handleServe(options: CliOptions): Promise<void> {
    logger.info('启动开发服务器...');
    
    // 加载配置
    const config = await this.loadConfig(options);
    
    // 更新配置
    const updatedConfig = this.updateServeConfig(config, options);

    // 创建构建上下文
    const context = this.createBuildContext(updatedConfig, options);

    // 创建构建器并启动开发服务器
    const builder = new WebpackBuilder(updatedConfig, context);
    await builder.serve();
  }

  /**
   * 处理清理命令
   */
  private async handleClean(options: CliOptions): Promise<void> {
    logger.info('清理输出目录...');
    
    // 加载配置
    const config = await this.loadConfig(options);
    
    // 清理输出目录
    const { FileUtils } = await import('../utils/file');
    if (config.output?.path) {
      await FileUtils.remove(config.output.path);
    }
    
    logger.success('输出目录清理完成！');
  }

  /**
   * 处理插件命令
   */
  private async handlePlugins(): Promise<void> {
    logger.info('可用插件列表:');
    
    const { builtinPlugins } = await import('../plugins/builtin');
    
    const pluginList = Object.entries(builtinPlugins).map(([name, plugin]) => ({
      name,
      version: plugin.version || '1.0.0',
      description: this.getPluginDescription(name)
    }));

    logger.table(pluginList);
  }

  /**
   * 处理初始化命令
   */
  private async handleInit(options: CliOptions): Promise<void> {
    logger.info('初始化项目...');
    
    const initPath = options.path || './my-project';
    logger.info(`将在 ${initPath} 创建新项目`);
    
    // TODO: 实现项目初始化逻辑
    // 1. 创建目录结构
    // 2. 生成配置文件
    // 3. 安装依赖
    
    logger.success('项目初始化完成！');
  }

  /**
   * 加载配置文件
   */
  private async loadConfig(options: CliOptions): Promise<PackConfig> {
    return await ConfigLoader.loadConfig(this.context, options.config);
  }

  /**
   * 更新构建配置
   */
  private updateBuildConfig(config: PackConfig, options: CliOptions): PackConfig {
    const updatedConfig = {
      ...config,
      mode: (options.mode as BuildMode) || 'production',
      env: (options.env as Environment) || 'production'
    };

    // 如果启用了进度显示，添加webpackbar插件配置
    if (options.progress !== false) {
      updatedConfig.plugins = updatedConfig.plugins || [];
      updatedConfig.plugins.push({
        name: 'webpackbar',
        options: {
          name: 'pack-starter',
          color: '#3f51b5',
          profile: true
        }
      });
    }

    return updatedConfig;
  }

  /**
   * 更新开发服务器配置
   */
  private updateServeConfig(config: PackConfig, options: CliOptions): PackConfig {
    const updatedConfig = {
      ...config,
      mode: 'development' as BuildMode,
      env: 'development' as Environment,
      devServer: {
        ...config.devServer,
        port: parseInt(String(options.port || '3000')),
        host: options.host || 'localhost',
        open: options.open !== false,
        hot: options.hot !== false
      }
    };

    // 在开发模式下也支持进度显示
    if (options.progress !== false) {
      updatedConfig.plugins = updatedConfig.plugins || [];
      updatedConfig.plugins.push({
        name: 'webpackbar',
        options: {
          name: 'pack-starter',
          color: '#4caf50',
          profile: true
        }
      });
    }

    return updatedConfig;
  }

  /**
   * 创建构建上下文
   */
  private createBuildContext(config: PackConfig, options: CliOptions): BuildContext {
    return {
      config,
      options,
      cwd: this.context,
      env: config.env || 'development',
      mode: config.mode || 'development'
    };
  }

  /**
   * 获取插件描述
   */
  private getPluginDescription(name: string): string {
    const descriptions: Record<string, string> = {
      html: '生成 HTML 文件',
      css: '处理 CSS 文件',
      minify: '压缩 JavaScript 代码',
      compression: '启用 Gzip 压缩',
      copy: '复制静态资源',
      'split-chunks': '优化代码分割',
      env: '处理环境变量',
      'hot-reload': '启用热模块替换',
      progress: '显示构建进度'
    };

    return descriptions[name] || '暂无描述';
  }

  /**
   * 设置工作目录
   */
  setCwd(cwd: string): void {
    this.context = cwd;
  }

  /**
   * 获取当前工作目录
   */
  getCwd(): string {
    return this.context;
  }

  /**
   * 获取命令名称
   */
  getCommandName(): string {
    return this.commandName;
  }
} 