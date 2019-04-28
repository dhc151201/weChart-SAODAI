// packageShop/typeList/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestChild: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.GET(this.$url.shop.getChilds, {enable: 'yes', parentId: 0}).then(res=> {
      this.setData({
        parentId: res.data[0].id,
        parent: res.data
      })
      this.getChild(res.data[0].id);
    })
  },
  getChild(id){
    this.setData({
      requestChild: true
    })
    this.GET(this.$url.shop.getChilds, {enable: 'yes', parentId: id }).then(res_child=> {
      this.setData({
        children: res_child.data,
        requestChild: false
      })
    })
  },
  tabParent(e){
    if(this.data.parentId== this.getDataset(e).id) return;
    this.setData({
      parentId: this.getDataset(e).id
    })
    this.getChild(this.getDataset(e).id);
  },
  choseTag(e){
    this.setData({
      childId: this.getDataset(e).id
    })
    this.navigateBack("/pages/with-auto/shop-list/index", {
      choseTag: this.data.children[this.getDataset(e).index]
    })
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

  }
})