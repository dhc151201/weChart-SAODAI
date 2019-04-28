import { $sdaiMask } from "./../index.js"
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    fixed: {
      type: Boolean,
      value: true
    },
    mask: {
      type: Boolean,
      value: true
    },
    background: {
      type: String,
      value: "rgba(0,0,0,.3)"
    },
    // loading/ error/ empty
    type:{
      type: String,
      value: 'loading'
    },
    show: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    hide: function(){
      this.setData({
        show: false
      })
    }
  }
})
