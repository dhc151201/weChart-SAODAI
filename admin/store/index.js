const Store = require('./store.js');
import config from './../utils/global.config.js'
import router from './../utils/router.js'
import behavior from './../utils/behavior.js'
import tool from './../utils/public.tool.js'
import $ from './../utils/wx.request.js'
import $url from './../utils/url.config.js'
import $api from './../utils/request.api.js'
import watch from "./../utils/watch.js"

let store = new Store({

  state: {
    //配置信息 静态资源图片路径
    assetsUrl: config.ASSETSURL,
    //是否全屏手机
    fullSen: false,
    //定位信息
    location: {},
    //0为正式入驻， 1为临时店铺
    typeIn: 0,  
    //用户登录后相关信息
    user: wx.getStorageSync("userInfo") || {},
    //用户地址列表
    addressList: []
  },

  //全局页面生命周期监听,将会优先执行此监听
  pageLisener: {
    onLoad(options) {
      wx.hideShareMenu();
      if (this.watch instanceof Object) {
        watch.setWatcher(this);
      }
      //参数挂载
      this.options= options;
      //标题设置, 建议在page.json处配置
      let config = router.CONFIG[this.route];
      if (config){
        config.meta.title && wx.setNavigationBarTitle({
          title: config.meta.title
        })
      }
      //登录校验
      //this.isLogin();
      // onLoad时自动调取本地缓存数据 onLoadGetLocalStorage
      this.getLocalStorageHandel();
    },
    onShow(){
      //登录校验
      this.isLogin();
      //store状态管理器 记录当前路由 
      store.setState({
        route: this.route
      });
      //自动刷新数据
      this.loaded && this.refreshDataAutoHandel();
      
    },
    onHide(){
      this.loaded= true;
    }


  },

  //全局方法
  methods: {

    //--------------------- about 接口api config
    $url,
    $api,

    //--------------------- about route
    navigateTo: router.navigateTo,
    redirectTo: router.redirectTo,
    navigateBack: router.navigateBack,
    href: router.href,

    //--------------------- about loading,toast,dialog
    toast: behavior.toast.show,
    loadingShow: behavior.loading.show,
    loadingHide: behavior.loading.hide,
    dialog: behavior.dialog,
    confirm: behavior.dialog.confirm,
    alert: behavior.dialog.alert,

    //--------------------- about request
    GET: $.get,
    POST: $.post,

    //--------------------- about tool
    tool: tool,

    //--------------------- about filters
    filters: tool.filters,

    //自动读取本地数据执行配置项函数  亦可在各自page里其他周期函数处视情况调用此方法
    getLocalStorageHandel: function(){
      if (this.onLoadGetLocalStorage instanceof Function) {
        if (this.onLoadGetLocalStorage() instanceof Array) {
          console.log("page onLoad auto load stroage: ", this.onLoadGetLocalStorage());
          let Object = {};
          this.onLoadGetLocalStorage().map((v) => {
            Object[v.pageDataKey] =
              wx.getStorageSync(v.localStorageKey) ||
              (v.default === undefined ? null : v.default);
          });
          this.setData(Object);
        }
        else {
          console.error("错误: onLoadGetLocalStorage return not a Array.");
        };
      }
      else {
        this.onLoadGetLocalStorage && console.error("错误: onLoadGetLocalStorage not a Function.");
      }
    },
    //自动刷新数据执行配置项函数  亦可在各自page里onload处视情况调用此方法
    refreshDataAutoHandel: function(){
      if (this.onShowRefreshDataAuto instanceof Function) {
        if (this.onShowRefreshDataAuto() instanceof Array) {
          console.log("page onShow auto refresh options: ", this.onShowRefreshDataAuto());
          this.onShowRefreshDataAuto().map((v) => {
            $[(v.method || 'get')](v.api, v.query, v.config).then((res) => {

              //此处拦截，是为了阻止后台setData,消耗性能
              if (this.data.$state.route !== this.route) {
                console.warn("已阻止后台setData，以免消耗前台性能。后台route:" + this.route + ",前台route:" + this.data.$state.route);
                return;
              };

              this[v.pageDataKey] = res.data;
              v.callback instanceof Function && v.callback(res);

            })
          });
          this.loaded= true; //表示此页面是否加载过， true表示加载过，此参数 *目的* 在于判断onshow时是否发起自动刷新数据
        }
        else {
          console.error("错误: onShowRefreshDataAuto return not a Array.");
        };
      }
      else {
        this.onShowRefreshDataAuto && console.error("错误: onShowRefreshDataAuto not a Function.");
      }
    },

    //啥事不做的空函数，给阻止默认行为的句柄用的，预防log日志报出错误提示
    nullFun: function(){},

    // 登录校验 - 未登录，自动带参跳转授权页
    isLogin: function(){

      let config = router.CONFIG[this.route] || {};
      console.warn("userInfo", wx.getStorageSync("userInfo") || "未登录状态", config.meta);

      if (config.meta && config.meta.mastLogin === false) return;

      if(!wx.getStorageSync("userInfo")){
        wx.redirectTo({
          url: '/packageScope/pages/scope/index?' + this.tool.objectToArrayKeyValue(this.options).join("&") + '&after=/' + this.route
        });
      };

    },

    //刷新登录状态
    refreshLogin: function(){

    },
    //获取用户最新信息
    getUserInfo: function(){
      return new Promise((reslove, reject)=>{
        this.POST(this.$url.user.getUserInfo).then((data) => {
          if (!(data.data instanceof Object)) return;
          store.setState({
            user: data.data
          });
          wx.setStorageSync("userInfo", data.data);
          reslove(data.data);
        }).catch(reject);
      })     
    },

    //分页请求前的判断 return true则表示可继续请求分页
    pageRequestBefore: function(){
      console.log(this.data.loadmore)
      if(this.data.loadmore=== undefined){
        console.error("loadmore is not fined");
        return false;
      }
      else if (this.data.loadmore === 0){
        return true;
      }
      else{
        console.warn("不能再继续分页请求了！已拦截。");
        return false;
      }
    },
    //分页接口响应后的处理
    pageRequestAfter: function (res) {
      var obj= {};
      //没有任何记录
      if (!res.data.totalCount){
        obj.loadmore= 3;
      } 
      //已无更多数据
      else if (res.data.pageNum * res.data.pageSize >= res.data.totalCount){
        obj.loadmore = 2;
      }
      //还可继续请求分页数据
      else{
        obj.loadmore = 0;
      }
      this.setData(obj);
    },

    makePhoneCall: function(e){
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
      })
    },

    //以防input from表单形式值丢失情况
    onInputFrom: function(e){
      if(!(this.data.fromData instanceof Object)){
        this.setData({ fromData: { }})
      }
      if (!e.currentTarget.dataset.name){
        return console.error("onInputFrom input handel mast has data-name.")
      }
      let obj= {};
      obj['fromData.' + e.currentTarget.dataset.name] = e.detail.value;
      this.setData(obj);
    }

  }
})


export default store;

