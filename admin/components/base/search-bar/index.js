// components/input/index.js
Component({
  options: {
    addGlobalClass: true
  },
  /**
  /**
   * 组件的属性列表
   */
  properties: {
    // top / bottom
    fixed: {
      type: String,
      value: ''
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
    onInput: function(e){
      this.triggerEvent("input", e.detail, true)
    }
  }
})
