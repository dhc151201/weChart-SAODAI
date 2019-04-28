// pages/example/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    options = JSON.parse(options.config);

    this.setData({
      title: options.title,
      imageList: options.imageList,
      summaryList: options.summaryList
    })

    /*
    config: 格式如下
    title: "string"
    imageList: [
      {
        src: "***.png",
        width: 300,
        height: 500
      }, .....
    ]
    summaryList: [
      "string", .....
    ]
    */
    
  },
})