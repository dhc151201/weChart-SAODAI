const SingletonConfig = (function(){

  function SetDefault(environment){

    this.environment= environment;
    this.config= {
      BMapKey: "nk1h8AGd0h1YqW1IU2ip4gnF2QBqNL5V",
      QQMapKey: "FC6BZ-A5FC2-TTZU6-CIACX-N4GV6-63BXF",
      REQUEST: "",
      UPLOAD: "",
      WEBVIEW: "https://rrsd.rrkd.cn",
      ASSETSURL: "https://group2-1251487137.image.myqcloud.com/app/",
      environment: "c_test",
    };

    this.setRequest= function(){
      switch (this.environment){
        case 'pro':
          this.config.REQUEST = "https://rrsd.rrkd.cn";
          this.config.UPLOAD = "https://rrsd.rrkd.cn";
          this.config.environment = "c_pro";
          break;
        case 'test':
          this.config.REQUEST = "http://testsd.rrkd.cn:8030";
          this.config.UPLOAD = "http://testsd.rrkd.cn:8030";
          this.config.environment = "c_test";
          break;
        case 'zby':
          this.config.REQUEST = "http://172.16.80.36:9010";
          this.config.UPLOAD = "http://172.16.20.227:9012";
          this.config.environment = "c_zby";
          break;
        case 'dev':
        default :
          this.config.REQUEST = "http://172.16.60.81:9010";
          this.config.UPLOAD = "http://172.16.60.81:9012";
          this.config.environment = "c_dev";
      }
    };

  };

  //  储存唯一实例
  var config= undefined;

  var _static= {
    name: "SingletonConfig",
    getConfig: function(environment){
      if(config === undefined){
        config = new SetDefault(environment);
        config.setRequest();
      }
      return config;
    }
  };

  return _static;

})();

// 开发环境 dev
// 测试环境 test
// 线上环境 pro
// 本缘兄服务 zby
const environment= "test";

export default SingletonConfig.getConfig(environment).config;

