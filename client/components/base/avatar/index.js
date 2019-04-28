// components/avatar/index.js
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      type: String,
      value: 'http://img0.imgtn.bdimg.com/it/u=2020123712,1433884246&fm=26&gp=0.jpg'
    },
    // large/normal/small/smaller/
    size: {
      type: String,
      value: 'normal'
    },
    shadow: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    loadedStatus: false,
    loading: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loaded: function () {
      this.setData({
        loadedStatus: true,
        loading: false
      })
    }
  }
})
