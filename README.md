# axios-wrap
对axios的封装,更加易用

目前前端适用,稍加改动可用于后端

使用方法:
1. `git clone git@github.com:yilikun/axios-wrap.git`
2. `cd axios-wrap`
3. `npm i`
4. `cd apis`
5. `ts-node test.ts`

```ts
import getApis from "./index";

const all = getApis("http://127.0.0.1:3000/mock/174");
console.log(all);
console.log(all.users);
console.log(all.users.login({
  params: {

  },
  data: {
    username: "",
    password: ""
  }
}));

all.user.login({
  params: {

  },
  data: {
    username: "",
    password: ""
  }
}).then((res) => {
  console.log(res);
}).catch((err) => {
  console.log(err);
});

```