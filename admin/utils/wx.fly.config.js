var Fly = require("./../libs/fly/wx.fly.min.js");

var fly = new Fly();

fly.config.headers = { }
fly.config.timeout = 3000;
fly.config.baseURL = "https://baidu.com"
//设置公共的Get参数
fly.config.params = { "token": "testtoken" };

//添加请求拦截器
fly.interceptors.request.use((request) => {
  //终止请求
  //var err=new Error("xxx")
  //err.request=request
  //return Promise.reject(new Error(""))

  //可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
  return request;
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  (response) => {
    let data= response.data;
    if(data.code== 0){
        
    }
    //登录状态 - 未登录 
    else if(data.code== 104){
      
    }
    //未成功 - 提示类
    else if (data.code == 200) {
      
    }
    else{
      
    }
    
    //只将请求结果的data字段返回
    return response.data
  },
  (err) => {
    //发生网络错误后会走到这里
    return Promise.resolve("ssss")
  }
)

module.exports.fly= fly;
