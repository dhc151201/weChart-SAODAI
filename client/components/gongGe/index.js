// components/gongGe/index.js
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      value: [],
      observer(newVal, oldVal, changedPath) {
        this.setData({
          "list[0]": newVal.slice(0, 4),
          "list[1]": newVal.slice(4, 7)
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [
      [], []
    ]
  },
  methods: {

  }
})
