import { AxiosResponse, history, request, RequestOptions, type RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';
import { refreshToken } from './apis/auth';
import { getInitialState } from './app';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

async function useRefreshToken(response: AxiosResponse) {
  // 获取初始状态
  const initialState = await getInitialState();

  // 使用 refreshToken 获取新的 token
  const refreshResponse = await refreshToken();
  console.log('refreshToken', refreshResponse);

  if (refreshResponse.data && refreshResponse.data.access_token) {
    // 更新 token
    const newToken = refreshResponse.data.access_token;
    initialState.token = newToken;
    localStorage.setItem('token', newToken);

    // 重新发起原始请求
    const retryResponse = await request(response.config.url!, {
      ...response.config,
      headers: {
        ...response.config.headers,
        Authorization: `Bearer ${newToken}`,
      },
    });

    return retryResponse;
  } else {
    // refresh-token 请求失败，跳转到登录页
    history.push('/user/login');
  }
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType } =
        res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        console.log('请求地址', error.response.config.url);
        if (error.response.status === 401 && !error.response.config.url.includes('refresh-token')) {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useRefreshToken(error.response);
        } else {
          message.error(`Response status:${error.response.status}`);
        }
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    async (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      const initialState = await getInitialState();
      config.headers = {
        Authorization: `Bearer ${initialState.token}`,
      };
      return { ...config };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure;

      if (data?.success === false) {
        message.error('请求失败！');
      }
      return response;
    },
  ],
};
