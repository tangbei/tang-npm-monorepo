import * as Config from 'webpack-chain'

import { IBaseOpts } from '../types/index.js';

const imageInlineSizeLimit = 4 * 1024;

interface IAddAssetRules extends IBaseOpts{
  config: Config;
}

export function addAssetRules(opts: IAddAssetRules) {
  const { config } = opts;
  const rule = config.module.rule('asset');
  /** avif格式图片 */
  rule.oneOf('avif').test(/\.avif$/).type('asset' as never).parser({
    dataUrlCondition: {
      maxSize: imageInlineSizeLimit,
    },
  }).merge({ mimetype: 'image/avif' });

  /** 字体文件 */
  rule.oneOf('font').test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/).type('asset' as never).parser({
    dataUrlCondition: {
      maxSize: imageInlineSizeLimit,
    },
  });
  /** 视频 */
  rule.oneOf('video').test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/).type('asset' as never).parser({
    dataUrlCondition: {
      maxSize: imageInlineSizeLimit,
    },
  });
  /** 一般格式的图片 */
  rule.oneOf('picture').test(/\.(bmp|gif|jpg|jpeg|png|svg)$/).type('asset' as never).parser({
    dataUrlCondition: {
      maxSize: imageInlineSizeLimit,
    },
  });
}
