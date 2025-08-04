import { resolveAppPath } from '../../utils/path';
import { IBaseOpts } from '../types';

function mergeConfig(opts: IBaseOpts) {
  const { userWebpackConfig } = opts;
  // entry
  mergeEntry({ ...opts, entry: userWebpackConfig?.entry });
  // alias
  mergeAlias({ ...opts, alias: userWebpackConfig?.alias });
}

/** 合并alias */
function mergeAlias(opts: IBaseOpts) {
  const { alias, config } = opts;
  if (!alias) {
    return;
  }
  Object.keys(alias || {}).forEach((key) => {
    // 需要真实路径
    config.resolve.alias.set(key, resolveAppPath(alias[key as keyof typeof alias]));
  })
}

/** 合并entry */
function mergeEntry(opts: IBaseOpts) {
  const { entry, config } = opts;
  if (!entry) {
    return;
  }
  if (typeof entry === 'string') {
    config.entry('main').add(entry);
  } else if(Array.isArray(entry)) {
    const ey = config.entry('main');
    entry.forEach(filePath => {
      ey.add(filePath);
    })
  } else {
    Object.keys(entry).forEach((key) => {
      const ey = config.entry(key);
      ey.add(entry[key as keyof typeof entry]);
    })
  }
}

export default mergeConfig;
