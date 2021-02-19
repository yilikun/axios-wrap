import { AxiosInstance, AxiosPromise, AxiosRequestConfig } from "axios";
import {readdirSync} from "fs";
import HttpRequest from "../index";

// enum ApiModule {
//   User = "users"
// }
type ApiFunctionType = (options: AxiosRequestConfig) => AxiosPromise;

interface ISingleApi {
  [key: string]: ApiFunctionType;
}

interface IApi {
  [key: string]: ISingleApi;
}

/**
 * 初始化http请求
 * @param  {string} baseURL  http://cyclone.com
 */
export default (baseURL: string) => {
  const httpRequest = new HttpRequest(baseURL);
  const files = readdirSync(__dirname);
  // const apis: Partial<Record<ApiModule, any>> = {};
  const apis: IApi = {};
  for (const fileName of files) {
    if (fileName === "index.ts" || fileName === "test.ts") {
      continue;
    }
    const router = require(`${__dirname}/${fileName}`);
    const singleApi = fileName.replace(".ts", "");
    apis[singleApi] = Object.keys(router.default).reduce((prev, cur) => {
      prev[cur] = (options = {}) => httpRequest.createAxiosInstance({ ...router.default[cur], ...options });
      return prev;
    }, {});
  }
  return apis;
};
