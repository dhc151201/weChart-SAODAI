// components/base/avatar-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    max: {
      type: Number,
      value: 5
    },
    data: {
      type: Array,
      value: []
    },
    width: {
      type: Number,
      value: 72
    },
    height: {
      type: Number,
      value: 72
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: []
  },

  attached(){
    this.setData({
      list: this.properties.data.slice(0, this.properties.max)
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
