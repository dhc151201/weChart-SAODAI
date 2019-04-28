import "./utils/Array.extends.class";
import store from './store/index.js';
import {reverseGeocoder} from './utils/wx.capacity.js';

// import "./utils/Request.Class.js";

App({
    store,
    onLaunch: function (options) {
        console.warn("app onLaunch::: ", options);
        this.getSystemInfo();
    },
    onShow: function () {
        this.updateApp();
        this.getNetworkType();
        //初始定位
        this.getLocation();
        //授权情况检测
        this.getSetting();
    },
    onPageNotFound() {
        wx.showModal({
            content: "error: page not fined",
        })
    },
    //全局Data
    globalData: {
        System: {},
        authSetting: {},
        location: {},
        networkType: ""
    },
    getSystemInfo() {
        wx.getSystemInfo({
            success: (res) => {
                console.log("System::: ", res);
                this.globalData.System = res;
                //全面屏手机处理
                if (res.model && res.model.indexOf("iPhone X") > -1) {
                    //提供给组件
                    wx.setStorageSync("full-screen", "true");
                    wx.setStorageSync("fullSenClassName", "fullSen");
                    //提供给页面
                    this.store.setState({
                        fullSen: true,
                        fullSenClassName: "fullSen"
                    });
                    //console.log(store)
                }
            }
        })
    },
    getSetting() {
        wx.getSetting({
            success: (res) => {
                console.log(res.authSetting);
                this.globalData.authSetting = res.authSetting;
            }
        })
    },
    getLocation(lat, lng) {
        return new Promise((reslove, reject) => {
            reverseGeocoder(lat, lng).then((res) => {
                this.store.setState({
                    location: res
                });
                console.log("位置信息", res);
                this.globalData.location = res;
                reslove(res);
            }).catch(() => {
                console.error("qqmap reverseGeocoder fail");
            })
        })
    },
    updateApp: () => {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
            console.warn("请求完新版本信息的回调::: ", res.hasUpdate)
        })
        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                    if (res.confirm) {
                        updateManager.applyUpdate()
                    }
                }
            })
        })
        updateManager.onUpdateFailed(function () {
            console.warn("新版本下载失败");
        })
    },
    //检查网络状态
    getNetworkType: function () {
        wx.getNetworkType({
            success: (res)=> {
                const networkType = res.networkType;
                // this.store.setState({
                //     networkType: networkType
                // });
                this.globalData.networkType = networkType;
            }
        })
    }
})

