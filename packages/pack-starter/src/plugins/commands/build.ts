import { rimrafSync } from 'rimraf';
import webpack from 'webpack';
import { ProjectOptions } from '../../types';
import { logger } from '../../utils/logger';
import { PluginAPI } from '../PluginAPI';

export default (api: PluginAPI, options: ProjectOptions) => {
  api.registerCommand({
    name: 'build',
    description: '构建应用代码',
    fn: async (args: Record<string, string>) => {
      logger.info('开始构建...');
      
      const webpackConfig = api.resolveWebpackConfig();

      if (options.webpack?.outputPath) {
        rimrafSync(options.webpack.outputPath);
      }

      webpack(webpackConfig, (error, stats) => {
        if (error) {
          logger.error('Webpack 编译错误', error);
          process.exit(1);
        }

        if (stats?.hasErrors()) {
          const errors = stats.toJson().errors;

          logger.error('构建失败！失败原因：');

          if (errors) {
            for(const _err of errors) {
              logger.error(`${JSON.stringify(_err)} \n`);
            }
          }
          process.exit(1);
        }

        if (stats?.hasWarnings()) {
          const info = stats.toJson();
          logger.warn('Webpack 编译警告');
          if (info.warnings) {
            logger.warn(JSON.stringify(info.warnings));
          }
        }

        logger.success(`Webpack 构建完成！耗时: ${stats?.endTime! - stats?.startTime!}ms`);
      });
    }
  })
}