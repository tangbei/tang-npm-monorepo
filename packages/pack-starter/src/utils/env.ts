/**
 * 是否开发环境
 */
export const isDev = (): boolean => process.env['NODE_ENV'] === 'development'

/**
 * 是否生产环境
 */
export const isProd = (): boolean => process.env['NODE_ENV'] === 'production'
