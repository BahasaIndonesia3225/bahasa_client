//配置项（全局初始状态）
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

//配置项（内置布局）
export const layout = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
  };
};

import type { RequestConfig } from '@umijs/max';
const isDevelopment = process.env.NODE_ENV === 'development';
export const request: RequestConfig = {
  baseURL: isDevelopment ? "" : "http://www.bahasaindo.net",
  timeout: 10000,
  // other axios options you want
  errorConfig: {
    errorHandler() {},
    errorThrower() {},
  },
  requestInterceptors: [
    (url: any, options: any) => {
      //设置登陆token
      const token = localStorage.getItem('token');
      const headers: any = { token };
      return {
        url,
        options: { ...options, headers },
      };
    },
  ],
  responseInterceptors: [
    // 直接写一个 function，作为拦截器
    (response: any) => {
      const { status } = response;
      if (status === 200) {
      } else if (status === 401) {
        //未登录或登录失效
      }
      return response;
    },
  ],
};
