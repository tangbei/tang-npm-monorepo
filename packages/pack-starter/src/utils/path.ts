import { realpathSync } from 'fs';
import * as path from 'path';

const cwd = process.cwd();
const appRootDir = realpathSync(cwd);

/**
 * 获取绝对的路径
 */
export const resolveAppPath = (relativePath: string): string =>
  path.resolve(appRootDir, relativePath);
