// components/loading-image/index.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  properties: {
    src: {
      type: String,
      value: ''
    },
    width: {
      type: String,
      value: "100%"
    },
    height: {
      type: Number,
      value: 200
    },
    slotLoading: {
      type: Boolean,
      value: false
    },
    radius: {
      type: Number,
      value: 0
    },
    //是否启用懒加载 //待支持
    lazyload: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    loading: true,
    loadedStatus: false,
    errorStatus: false
  },

  /**
   * 组件的方法列表
   */
  attached: function () {
    if (!this.properties.src){
      // this.setData({
      //   errorStatus: true,
      //   loading: false
      // })
    }
  },
  methods: {
    loaded: function(){
      this.setData({
        loadedStatus: true,
        loading: false
      })
    },
    error: function(){
      this.setData({
        errorStatus: true,
        loading: false
      })
    }
  }
})
