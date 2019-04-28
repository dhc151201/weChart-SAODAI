const Store = require('./store.js');
import config from './../utils/global.config.js'
import router from './../utils/router.js'
import behavior from './../utils/behavior.js'
import {
    objectToArrayKeyValue,
    filters,
    getDataset,
    getProptry,
    makePhoneCall,
    deepCopy
} from './../utils/public.tool.js'
import {get, post} from './../utils/wx.request.js'
import * as $url from './../utils/url.config.js'
import watch from "./../utils/watch.js"
import {reverseGeocoder} from './../utils/wx.capacity.js'

let store = new Store({

    state: {
        //配置信息 静态资源图片路径
        assetsUrl: config.ASSETSURL,
        //是否全屏手机
        fullSen: false,
        fullSenClassName: "",
        //定位信息
        location: {},
        location_indexhelp: {},
        location_indexauto: {},
        //用户登录后相关信息
        user: wx.getStorageSync("userInfo") || {},
    },

    //全局页面生命周期监听,将会优先执行此监听
    pageLisener: {
        onLoad(options) {
            console.warn(this.route+ ", onLoad::: ", options);
            wx.hideShareMenu();
            //watch启动
            if (this.watch instanceof Object) {
                watch.setWatcher(this);
            }
            //参数自动挂载
            this.options = options;
            store.setState({
                parms: objectToArrayKeyValue(options).join("&")
            });
            if (options.share == 'true') {
                this.setData({"share": options.share})
            }
            //登录校验
            //this.isLogin();
            // onLoad时自动调取本地缓存数据 onLoadGetLocalStorage
            this.getLocalStorageHandel();
        },
        onShow() {
            //登录校验
            this.isLogin();
            //store状态管理器 记录当前路由
            store.setState({
                route: this.route
            });
            //自动刷新数据
            this.loaded && this.refreshDataAutoHandel();
        },
        onHide() {
            //表示此页面是否加载过， true表示加载过，此参数 *目的* 在于判断onshow时是否发起自动刷新数据
            this.loaded = true;
        }
    },

    //全局方法
    methods: {

        //--------------------- about 接口api config
        $url,

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
        GET: get,
        POST: post,

        getProptry: getProptry,
        filters: filters,
        getDataset: getDataset,
        makePhoneCall: makePhoneCall,

        //自动读取本地数据执行配置项函数  亦可在各自page里其他周期函数处视情况调用此方法
        getLocalStorageHandel: function () {

            //取消自动读取缓存
            return;

            if (this.onLoadGetLocalStorage instanceof Function) {
                let loadGetLocalStorage = this.onLoadGetLocalStorage();
                if (loadGetLocalStorage instanceof Array) {
                    console.log("page onLoad auto load stroage: ", loadGetLocalStorage);

                    loadGetLocalStorage.map((v) => {
                        wx.getStorage({
                            key: v.localStorageKey,
                            success: (res)=> {
                                console.log("getStorage, key: "+ v.localStorageKey, res)
                                let Object = {};
                                Object[v.pageDataKey] = res.data || (v.default === undefined ? null : v.default);
                                this.setData(Object);
                            }
                        })
                        // Object[v.pageDataKey] =
                        //     wx.getStorage(v.localStorageKey || '') ||
                        //     (v.default === undefined ? null : v.default);
                    });

                }
                else {
                    console.error("错误: onLoadGetLocalStorage return not a Array.");
                }
            }
            else {
                this.onLoadGetLocalStorage && console.error("错误: onLoadGetLocalStorage not a Function.");
            }
        },

        //自动刷新数据执行配置项函数  亦可在各自page里onload处视情况调用此方法
        refreshDataAutoHandel: function () {
            if (this.onShowRefreshDataAuto instanceof Function) {
                let refreshDataAuto = this.onShowRefreshDataAuto();
                if (trefreshDataAuto instanceof Array) {
                    console.log("page onShow auto refresh options: ", refreshDataAuto);
                    refreshDataAuto.map((v) => {
                        $[(v.method || 'get')](v.api, v.query, v.config).then((res) => {

                            //此处拦截，是为了阻止后台setData,消耗性能
                            if (this.data.$state.route !== this.route) {
                                console.warn("已阻止后台setData，以免消耗前台性能。后台route:" + this.route + ",前台route:" + this.data.$state.route);
                                return;
                            }

                            this[v.pageDataKey] = res.data;
                            v.callback instanceof Function && v.callback(res);

                        })
                    });
                }
                else {
                    console.error("错误: onShowRefreshDataAuto return not a Array.");
                }
            }
            else {
                this.onShowRefreshDataAuto && console.error("错误: onShowRefreshDataAuto not a Function.");
            }
        },

        //啥事不做的空函数，给阻止默认行为的句柄用的，预防log日志报出错误提示
        nullFun: function () {
            return;
        },

        // 登录校验 - 未登录，自动带参跳转授权页
        isLogin: function () {

            let config = router.CONFIG[this.route] || {};
            console.warn("userInfo", wx.getStorageSync("userInfo") || "未登录状态", config.meta);

            if (config.meta && config.meta.mastLogin === false) return;

            if (!wx.getStorageSync("userInfo")) {
                wx.redirectTo({
                    url: '/packageScope/pages/scope/index?' + objectToArrayKeyValue(this.options).join("&") + '&after=/' + this.route
                });
            }

        },

        //刷新登录状态
        refreshLogin: function () {

        },
        //获取用户最新信息
        getUserInfo: function () {
            return new Promise((reslove, reject) => {
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
        pageRequestBefore: function (loadmoreKey = "loadmore") {
            console.log(loadmoreKey, this.data[loadmoreKey])
            if (this.data[loadmoreKey] === undefined) {
                console.error("loadmore is not fined");
                return false;
            }
            else if (this.data[loadmoreKey] === 0) {
                let obj = {};
                obj[loadmoreKey] = 1;
                this.setData(obj)
                return true;
            }
            else {
                console.warn("不能再继续分页请求了！已拦截。");
                return false;
            }
        },
        //分页接口响应后的处理
        pageRequestAfter: function (res, loadmoreKey = "loadmore") {
            var obj = {};
            //没有任何记录
            if (!res.data.totalCount) {
                obj[loadmoreKey] = 3;
            }
            //已无更多数据
            else if (res.data.pageNum * res.data.pageSize >= res.data.totalCount) {
                obj[loadmoreKey] = 2;
            }
            //还可继续请求分页数据
            else {
                obj[loadmoreKey] = 0;
            }
            this.setData(obj);
        },

        //分页数据设置
        setPageList(pageDataKey, list = [], pageConfig) {

            let obj = {spinShow: false}, index = 0;

            list.forEach((v, i) => {
                index = (pageConfig.pageNum - 1) * pageConfig.pageSize + i;
                obj[pageDataKey + "[" + index + "]"] = v;
            })
            if (pageConfig.pageNum == 1) {
                let obj_ = {};
                obj_[pageDataKey] = [];
                this.setData(obj_);
            }
            this.setData(obj);
        },
        //检查网络状态
        networkType: function(){
            const app= getApp();
            if (app.globalData.networkType == 'none') {
                //记录参数
                wx.setStorageSync("parms", store.$state.parms);
                wx.redirectTo({
                    url: '/pages/no-network/index?after=/' + this.route,
                })
                return false;

            }
            return true;
        },
        //获取经纬度 promise , 某些依赖经纬度的接口专用
        getLatlng() {
            return new Promise((reslove, reject) => {

                if (!this.networkType()) return reject();

                if (store.$state.location.location) {
                    reslove(deepCopy(store.$state.location.location));
                }
                else {
                    console.warn("getLatlng::: 位置信息，渠道：在页面中获取。");
                    reverseGeocoder().then((res) => {
                        store.setState({
                            location: res
                        });
                        reslove(deepCopy(res.location));
                    }).catch(reject);
                }
            })
        },
        getCityCode() {
            return new Promise((reslove, reject) => {

                if (!this.networkType()) return reject();

                if (store.$state.location.ad_info) {
                    reslove(+(store.$state.location.ad_info.adcode.toString().slice(0, 4) + "00"));
                }
                else {
                    console.warn("getCityCode::: 位置信息，渠道：在页面中获取。");
                    reverseGeocoder().then((res) => {
                        store.setState({
                            location: res
                        });
                        reslove(+(res.ad_info.adcode.toString().slice(0, 4) + "00"));
                    }).catch(reject);
                }
            })
        },
        getDistrictCode() {
            return new Promise((reslove, reject) => {

                if (!this.networkType()) return reject();

                if (store.$state.location.ad_info) {
                    reslove(+store.$state.location.ad_info.adcode);
                }
                else {
                    console.warn("getDistrictCode::: 位置信息，渠道：在页面中获取。");
                    reverseGeocoder().then((res) => {
                        store.setState({
                            location: res
                        });
                        reslove(+res.ad_info.adcode);
                    }).catch(reject);
                }
            })
        },

        //以防input from表单形式值丢失情况
        onInputFrom: function (e) {
            if (!(this.fromData instanceof Object)) {
                this.fromData = {}
            }
            if (!e.currentTarget.dataset.hasOwnProperty('name')) {
                console.error("onInputFrom input handel mast has data-name.");
                return;
            }
            this.fromData[e.currentTarget.dataset.name] = e.detail.value;
        },


        //弱化分享入口前往主页按钮
        hideSideToIndexComp() {
            this.sideToIndexComp && this.sideToIndexComp.sideOut();
        },
        //强化分享入口前往主页按钮
        showSideToIndexComp() {
            clearTimeout(this.timeout);
            this.timeout = null;
            this.timeout = setTimeout(() => {
                this.sideToIndexComp && this.sideToIndexComp.sideIn();
            }, 2000)
        },

        /*
        // 文件名指定 worker 的入口文件路径，绝对路径
        createWorker(scriptPath){
            try{
                store.$state.worker && 
                store.$state.worker.terminate();
            }finally{
                let obj= {};
                obj.worker= wx.createWorker(scriptPath);
                store.setState(obj);
            }
        },
        onMessage(fun){
            store.$state.worker.onMessage( fun )
        },
        postMessage(data= {}, page){
            store.$state.worker.postMessage(data, page)
        }

        */


    }
});


export default store;

