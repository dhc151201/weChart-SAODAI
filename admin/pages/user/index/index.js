// pages/user/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    merchant: wx.getStorageSync("merchant-info"),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //未登录
    if (!this.data.$state.user.id) {
      return wx.reLaunch({
        url: "/packageScope/pages/scope/index?after=/pages/user/index/index"
      })
      return;
    }
    //未入驻商户
    if (!this.data.$state.user.merchantId) {
      //正式入驻
      if (this.data.$state.typeIn == 0) {
        wx.reLaunch({
          url: "/pages/user/join/index"
        })
        return;
      } else {
        wx.reLaunch({
          url: "/pages/shop/add/index"
        })
        return;
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("merchant-info::: ", this.data.merchant);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
  formSubmit(e){
    console.log("formId::: ", e.detail.formId)
    // this.POST("http://172.16.80.104:8012/v1/command/wechat/test", {
    //   form_id: e.detail.formId
    // })
  }
  
})