// pages/share/in/shop/index.js
const app= getApp();
Page({
  onLoad(options){

    if (app.globalData.System.screenHeight / app.globalData.System.screenWidth > 1.8) {
      this.setData({
        longImage: true
      })
    }

    app.store.setState({
      typeIn: 1
    });
    
  },
  addShopHandel(){
    this.redirectTo("/pages/shop/add/index");
  }
})