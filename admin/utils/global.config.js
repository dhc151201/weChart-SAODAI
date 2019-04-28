const config= {
  BMapKey: "nk1h8AGd0h1YqW1IU2ip4gnF2QBqNL5V",
  QQMapKey: "RVZBZ-JZ6WX-K7K4X-Z7OJU-L5W4F-JCBJN",
  REQUEST: "",
  UPLOAD: "",
  WEBVIEW: "https://rrsd.rrkd.cn",
  ASSETSURL: "https://group2-1251487137.image.myqcloud.com/app/",
}

// 开发环境 dev
// 测试环境 test 
// 线上环境 pro 
// 本源服务 zby
let environment = "test"; 

switch (environment){
  case 'pro':
    config.REQUEST = "https://rrsd.rrkd.cn";
    config.UPLOAD = "https://rrsd.rrkd.cn";
    break;
  case 'test':  
    config.REQUEST = "http://testsd.rrkd.cn:8030"; 
    config.UPLOAD = "http://testsd.rrkd.cn:8030";
    break;
  case 'zby': 
    config.REQUEST = "http://172.16.80.58:9010";
    config.UPLOAD = "http://172.16.60.81:9012";
    break;
  case 'dev': 
  default : 
    config.REQUEST = "http://172.16.60.81:9010";
    config.UPLOAD = "http://172.16.60.81:9012";
}

export default config;

