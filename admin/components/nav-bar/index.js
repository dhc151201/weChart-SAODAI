const app = getApp()

// components/nav-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activeindex:{
      type: String,
      value: "order-list"
    },
    labels: {
      type: Array,
      value: [0, 0]
    }
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
    hrefgo: function(e){
      let route = getCurrentPages();
      if (route[route.length - 1].route == e.currentTarget.dataset.url.replace("/", '')){
        return;
      }
      this.redirectTo(e.currentTarget.dataset.url)
    }
  }
})
