import config from "./../../../utils/global.config.js"
const app= getApp();
Page({
  onLoad(options){


    //分享本人打开的跳转路径
    if (this.options.scene && this.options.scene == this.data.$state.user.recommandCode){
        //由webview分享而来
        if (options.url) {
            this.redirectTo("/pages/webview/index?url=" + options.url + "&share=true");
        }
        //其他
        else this.redirectTo("/packageShare/out/shop/index?share=true");
    }

    if (app.globalData.System.screenHeight / app.globalData.System.screenWidth > 1.8) {
      this.setData({
        longImage: true
      })
    }

    app.store.setState({
      typeIn: 1
    });

    console.warn("page/index/index?recommandCode="+ this.options.scene);

  },
  addShopHandel(){

    // this.redirectTo("/pages/shop/add/index");
    wx.navigateToMiniProgram({
      appId: "wx13363befd3bf9007",
      path: "pages/shop/add/index?recommandCode="+ this.options.scene,
      envVersion: config.environment.includes("test") ? "trial" : "release",
      success: ()=>{
          wx.reLaunch({
              url: "/pages/with-help/index/index"
          })
        //this.redirectTo("/pages/with-help/index/index");
      }
    })
  }
})
