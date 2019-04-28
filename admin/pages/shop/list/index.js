import { $stopWuxRefresher } from './../../../libs/wux/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    requested: false,
    merchantInfo: {},
    enteredShops: [],
    waitEnteredShops: [],
    stateStr: ["审核中", "审核通过", "审核未通过", "待认证"]
  },
  onLoadGetLocalStorage() {
    return [
      {
        pageDataKey: "enteredShops",
        localStorageKey: "shop-list-enteredShops",
        default: []
      },
      {
        pageDataKey: "waitEnteredShops",
        localStorageKey: "shop-list-waitEnteredShops",
        default: []
      },
      {
        pageDataKey: "merchantInfo",
        localStorageKey: "merchant-info",
        default: {}
      }
    ]
  },
  onLoad: function (options) {
    this.requestAll();
  },
  onShow(){
    this.loaded && this.requestAll();
  },
  onPulling() {
    //console.log('onPulling')
  },
  onRefresh() {
    //console.log('onRefresh');
    this.requestAll();
    setTimeout(() => {
      
      $stopWuxRefresher()
    }, 2000)
  },
  onUnload(){
    // wx.reLaunch({
    //   url: '/pages/user/index/index',
    // })
  },
  requestAll(){
    Promise.all([
      this.GET(this.$url.shop.queryMerchantShopList, { merchantId: this.data.$state.user.merchantId }),
      this.GET(this.$url.user.getMerchant, { merhcantId: this.data.$state.user.merchantId })
    ]).then(([res, res_info]) => {

      wx.setStorageSync("shop-list-enteredShops", res.data.enteredShops.slice(0, 10));
      wx.setStorageSync("shop-list-waitEnteredShops", res.data.waitEnteredShops.slice(0, 10));
      wx.setStorageSync("merchant-info", res_info.data);

      this.setData({
        enteredShops: res.data.enteredShops,
        waitEnteredShops: res.data.waitEnteredShops,
        merchantInfo: res_info.data,
        requested: true
      })

    })
  }
})