import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { ProjectOptions } from '../../types';
import { logger } from '../../utils/logger';
import { PluginAPI } from '../PluginAPI';

export default (api: PluginAPI, options: ProjectOptions) => {
  api.registerCommand({
    name: 'serve',
    description: '启动开发服务器',
    fn: async (args: Record<string, string>) => {
      logger.info('开始启动开发服务器...');

      try {
        // 获取webpack配置
        const compiler = api.resolveWebpackCompile();

        // 添加热模块替换插件
        if (options.server.hot) {
          options.server.plugins = options.server.plugins || [];
          options.server.plugins.push(new Webpack.HotModuleReplacementPlugin());
        }

        const devServer = new WebpackDevServer(options.server, compiler);
        
        // 启动服务器
        await devServer.start();
        
        // 获取实际的服务器地址
        
        logger.success(`开发服务器已启动: ${options.server.https ? 'https' : 'http'}://${options.server.host}:${options.server.port}`);
        
        // 处理进程退出
        const cleanup = () => {
          logger.info('正在关闭开发服务器...');
          devServer.stop();
          process.exit(0);
        };

        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);

      } catch (error) {
        logger.error('启动开发服务器失败', error);
        process.exit(1);
      }
    }
  })
}