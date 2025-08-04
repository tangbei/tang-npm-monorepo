import type * as http from 'http';

/**
 * 从proxyRes获取body数据，返回json对象
 * @param {*} proxyRes
 * @param {*} res
 */
export function getBody(proxyRes: http.IncomingMessage): Promise<{ code: number }> {
  return new Promise((resolve, reject) => {
      let body: any = []
      proxyRes.on('data', function (chunk) {
          body.push(chunk)
      })
      proxyRes.on('end', function () {
          body = Buffer.concat(body).toString()
          resolve(JSON.parse(body))
      })
  })
}

export const CONFIG_FILE_NAME = '.packrc.js';
