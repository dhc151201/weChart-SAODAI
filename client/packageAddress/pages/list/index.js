const app = getApp()

// packageAddress/pages/list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spinShow: true,
  },
  onLoadGetLocalStorage(){
    return [
        {
            pageDataKey: "list",
            localStorageKey: "user-addressList"
        }
    ]
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    this.get_addressList();
  },
  onShow: function () {
    this.loaded && this.get_addressList();
  },
  get_addressList(){
    this.GET(this.$url.user.addressList).then((res)=>{
      this.setData({
        list: res.data,
        spinShow: false
      })

      wx.setStorageSync("user-addressList", (res.data || []).slice(0, 10));
      
    })
  },
  chose(e){
    wx.setStorageSync("choseAddress-order", this.data.list[e.currentTarget.dataset.index]);
    this.navigateBack(this.options.after, {
      choseAddress: this.data.list[e.currentTarget.dataset.index]
    })
  },
  edit(e){
    this.navigateTo("/packageAddress/pages/add/index", {
      id: this.data.list[e.currentTarget.dataset.index].id,
      info: JSON.stringify(this.data.list[e.currentTarget.dataset.index])
    })
  },
})