import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig} from "axios";
import { merge } from "lodash";

// const getBaseUrl = (env) => {
//   let base = {
//     production: "/",
//     development: "http://localhost:3000",
//     test: "http://localhost:3001",
//   }[env];
//   if (!base) {
//     base = "/";
//   }
//   return base;
// };
// const getToken = () => {
//   return localStorage.getItem("AuthorizationToken");
// }
export default class HttpRequest {
  private defaultConfig: AxiosRequestConfig;
  private axios!: AxiosInstance;
  private token_prefix: string = "Bearer ";

  // private config: AxiosRequestConfig;

  constructor(baseURL: string = "") {
    this.defaultConfig = {
      baseURL,
      timeout: 1000 * 20, // 默认超时时长20s
      responseType: "json",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Accept": "application/json",
      },
      // withCredentials: true
    };
  }

  /**
   * 创建 axios 实例
   *
   * @param {Object} customConfig 用户自定义配置
   * @return {Axios} 返回 axios 实例
   * @memberof HttpRequest
   */
  public createAxiosInstance(customConfig): AxiosPromise {
    // 默认配置和用户自定义配置合并
    const config = merge(this.defaultConfig, customConfig);
    const axiosInstance: AxiosInstance = axios.create();
    // 调用拦截器
    this.interceptors(axiosInstance);
    // 返回实例
    this.axios = axiosInstance;
    return axiosInstance(config);
  }

  public getToken() {
    return localStorage.getItem(`${this.defaultConfig.baseURL}:AuthorizationToken` as string);
  }

  /**
   * 拦截器
   *
   * @param {Axios} instance
   * @memberof HttpRequest
   */
  public interceptors(instance) {
    // 请求拦截器
    instance.interceptors.request.use((config) => {
      const { headers, method, params, data, url } = config;
      // 每次请求都携带 token
      if (!url.includes("login")) {
        const token = `${this.token_prefix}${this.getToken()}` || "";
        if (token) {
          headers.Authorization = token;
        }
      }

      // 如果 Content-type 类型不为 'multipart/form-data;' （文件上传类型 ）
      if (!headers["Content-Type"].includes("multipart")) {
        // 如果请求方式为 post 方式，设置 Content-type 类型为 'application/x-www-form-urlencoded; charset=UTF-8'
        if (method === "post") {
          headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
        }
        // 根据 contentType 转换 data 数据
        const contentType = headers["Content-Type"];
        // Content-type类型 'application/json;'，服务器收到的raw body(原始数据) "{name:"nowThen",age:"18"}"（普通字符串）
        // Content-type类型 'application/x-www-form-urlencoded;'，服务器收到的raw body(原始数据) name=nowThen&age=18
        const paramData = (method === "get") ? params : data;
        // if (contentType) {
        //   config.data = contentType.includes("json") ? JSON.stringify(paramData) : qs.stringify(paramData);
        // }
      }
      return config;
    }, (error) => {
      // 处理响应错误
      // this.defaultConfig.isErrorHandle && errorHandle(error);
      return Promise.reject(error);
    });

    // 响应拦截器
    instance.interceptors.response.use((response) => {
      const { status, data } = response;

      // 正常响应
      if (status === 200 || (status < 300 || status === 304)) {
        if (data.code === 401) {
          // token 错误或者过期，需要重新登录，并清空 store 和 localstorge 中的 token
          // TODO: 跳转到登录界面
        }
        // 返回数据
        return Promise.resolve(data);
      }
      return Promise.reject(response);
    }, (error) => {
      // TODO: 处理响应错误
      // this.defaultConfig.isErrorHandle && errorHandle(error);
      return Promise.reject(error);
    });
  }

  /**
   * 通用
   * @param {String} type   请求类型:get,post...
   * @param {String} path   请求的url地址
   * @param {Object} param  请求的参数
   */
  public FETCH(type: string, path: string, param: object = {}, config = {}) {
    return new Promise((resolve, reject) => {
      this.axios[type](path, param, config)
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

  /**
   * 获取
   * @param {String} path   请求的url地址
   * @param {Object} param  请求的参数
   * @param {Object} config  配置
   */
  public GET(path: string, param: object = {}, config: object = {}) {
    return this.FETCH("get", path, { params: param, ...config });
  }

  /**
   * 添加
   * @param {String} path   请求的url地址
   * @param {Object} param  请求的参数
   * @param {Object} config  配置
   */
  public POST(path: string, param: object = {}, config: object = {}) {
    return this.FETCH("post", path, param, config);
  }

  /**
   * 修改
   * @param {String} path   请求的url地址
   * @param {Object} param  请求的参数
   * @param {Object} config  配置
   */
  public PUT(path: string, param: object = {}, config: object = {}) {
    return this.FETCH("put", path, param, config);
  }

  /**
   * 删除
   * @param {String} path   请求的url地址
   * @param {Object} param  请求的参数
   * @param {Object} config  配置
   */
  public DELETE(path: string, param: object = {}, config: object = {}) {
    return this.FETCH("delete", path, param, config);
  }

  /**
   * 上传表单方法
   * @param {String} path 请求的url地址
   * @param {Object} params 请求的参数
   * @param {Object} config  配置
   */
  public FORMDATA(path: string, params: object = {}, config: object = {}) {
    const formData = new FormData();
    Object.keys(params).forEach((key) => {
      formData.append(key, params[key]);
    });

    const defaultFormDataConfig = {
      method: "post",
      data: formData,
      headers: {
        "content-type": "multipart/form-data;charset=UTF-8",
      },
    };
    return new Promise((resolve, reject) => {
      this.axios(path, merge(defaultFormDataConfig, config)).then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }
}
