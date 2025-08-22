import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import type { CreateRequestConfig, RequestConfig, RequestInterceptors } from './types';

class Request {
  instance: AxiosInstance;

  interceptors: RequestInterceptors<AxiosResponse>;

  abortControllerMap: Map<string, AbortController>;

  constructor(config: CreateRequestConfig) {
    this.instance = axios.create(config);
    // 初始化存放取消请求控制器Map
    this.abortControllerMap = new Map();
    this.interceptors = config.interceptors || {};

    // 拦截器执行顺序:接口请求 -> 实例请求 -> 全局请求 -> 实例响应 -> 全局响应 -> 接口响应
    this.requestInterceptors();
    
    this.responseInterceptors();
  }

  /**
   * 接口请求拦截器
   */
  requestInterceptors() {
    // 全局请求拦截器
    this.instance.interceptors.request.use((request: InternalAxiosRequestConfig) => {
      // console.log('全局请求拦截器request', request);
      const abortController = new AbortController();
      const url = request.url || '';
      request.signal = abortController.signal;
      this.abortControllerMap.set(url, abortController);
      return request;
    }, error => {
      return Promise.reject(error);
    });

    // 实例请求拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptors,
      this.interceptors?.requestInterceptorsCatch
    );
  }

  /**
   * 接口响应拦截器
   */
  responseInterceptors() {
    // 实例响应拦截器
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptors,
      this.interceptors?.responseInterceptorsCatch
    );

    // 全局响应拦截器
    this.instance.interceptors.response.use((response: AxiosResponse) => {
      // console.log('全局响应拦截器response', response);
      const url = response.config.url || '';
      this.abortControllerMap.delete(url);
      return response.data;
    }, error => {
      return Promise.reject(error);
    });
  }


  request<T>(config: RequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // 如果我们为单个请求设置拦截器，这里使用单个请求的拦截器
      if (config.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(config as any)
      }
      this.instance
        .request<any, T>(config)
        .then(res => {
          // 如果我们为单个响应设置拦截器，这里使用单个响应的拦截器
          if (config.interceptors?.responseInterceptors) {
            res = config.interceptors.responseInterceptors(res)
          }
          resolve(res)
        })
        .catch((err: any) => {
          reject(err)
        })
      // .finally(() => {})
    });
  }

  /**
   * 取消指定请求
   * @param url 请求地址
   */
  cancelRequest(url: string | string[]) {
    const urlList = Array.isArray(url) ? url : [url];

    for (const _url of urlList) {
      this.abortControllerMap.get(_url)?.abort();
      this.abortControllerMap.delete(_url);
    }
  }

  /**
   * 取消全部请求
   */
  cancelAllRequest() {
    this.abortControllerMap.forEach(abortController => {
      abortController.abort();
    });
    this.abortControllerMap.clear();
  }
}

export default Request;