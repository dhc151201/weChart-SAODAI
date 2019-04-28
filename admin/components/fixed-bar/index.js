// components/share-bar-fixed/index.js
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    background: {
      type: String,
      value: "#fff"
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    fullSen: wx.getStorageSync("full-screen")
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
