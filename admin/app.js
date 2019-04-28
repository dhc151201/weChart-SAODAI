import store from './store/index.js';
import wxCapacity from './utils/wx.capacity.js'

App({
  store,
  onLaunch: function (options) {

    console.warn("app onLaunch::: ", options);
    this.globalMethods.updateApp();

    // var info = wx.getStorageSync("userInfo");
    // if(!info.wxPubOpenId){
    //     wx.clearStorageSync()
    // }

    wx.getSystemInfo({
      success: (res)=> {
        console.log("System::: ", res);
        this.globalData.System= res;
        //全面屏手机处理
        if (res.model && res.model.indexOf("iPhone X")> -1 ){
          //提供给组件
          wx.setStorageSync("full-screen", "true");
          //提供给页面
          store.setState({ fullSen: true });
        }
      }
    })

  },
  onShow: function(){

    //初始定位
    this.globalMethods.getLocation().then((res)=>{
      console.log("位置信息", res);
      this.globalData.location= res;
    });
    //授权情况检测
    wx.getSetting({
      success: (res)=> {
        console.log(res.authSetting);
        this.globalData.authSetting= res.authSetting;
      }
    })

    //wxCapacity.mapQQ.reverseGeocoder();

  },
  onPageNotFound(){
    wx.showModal({
      content: "error: page not fined",
    })
  },
  //全局Data
  globalData: {
    System: {},
    authSetting: {},
    location: { wxMarkerData: [{}]}
  },
  //全局Methods
  globalMethods: {
    getLocation:  ()=> {
      return new Promise((relsove, reject)=>{
        wxCapacity.mapQQ.reverseGeocoder().then((res) => {
          store.setState({
            location: res
          });
          relsove(res);
        });
      });
    },
    updateApp: ()=>{
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
    }
  },

})

