// components/fixed-bar-pay/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String,
      value: "0.00"
    }
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
    payHandel: function (e) {
      this.triggerEvent("payHandel", e.currentTarget.dataset, {})
    }
  }
})
