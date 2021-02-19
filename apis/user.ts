export default {
  // 用户登录
  login: {
    method: "post",
    url: "/api/v1/login"
  },
  // 用户登出
  logout: {
    method: "get",
    url: "/api/v1/logout"
  },
  // 获取账号信息
  getInfo: {
    method: "get",
    url: "/api/v1/account"
  },

};
