import getApis from "./index";

const all = getApis("http:///127.0.0.1:3000/mock/174");
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
