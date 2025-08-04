import fs from 'fs';
import path from 'path';
import { ProjectOptions } from '../../types';
import { CONFIG_FILE_NAME } from '../../utils/common';
import { logger } from '../../utils/logger';
import { PluginAPI } from '../PluginAPI';

/**
 * 新建.packrc.js 配置文件
 */
export default (api: PluginAPI, options: ProjectOptions) => {
  api.registerCommand({
    name: 'init',
    description: '初始化项目',
    fn: () => {
      // 获取配置文件的生成目录
      const filePath = options && options.path ? path.join(process.cwd(), options.path) : process.cwd();
      if (!fs.existsSync(filePath)) {
        logger.error(`目标目录不存在，请检查：${filePath}`);
        return;
      }
      const realFilePath = path.join(filePath, CONFIG_FILE_NAME);
      if (fs.existsSync(realFilePath)) {
        logger.error(`该目录下配置文件已存在：${realFilePath}`);
        return;
      }
      logger.info("正在生成配置文件...");
      fs.readFile(path.join(__dirname, '../../../templateConfig.js'), 'utf8', (err, data) => {
        if (err) {
          logger.error(`读取模板配置文件出错：${JSON.stringify(err)}`);
          return;
        }
        fs.writeFile(realFilePath, data, 'utf8', (err) => {
          if (err) {
            logger.error(`配置文件生成失败：${JSON.stringify(err)}`);
            return;
          }
          logger.info(`配置文件生成成功！文件地址：${realFilePath}`);
        });
      })
    }
  });
};