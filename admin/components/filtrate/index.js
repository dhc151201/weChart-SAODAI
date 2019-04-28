// components/filtrate/index.js
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    absoluteRight: {
      type: Number,
      value: 0
    },
    absoluteTop: {
      type: Number,
      value: 30
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    right: 0,
    showOptionBox: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showOptions: function(){
      this.setData({
        showOptionBox: !this.data.showOptionBox
      })
      
      var myEventDetail = { showOptionBox: this.data.showOptionBox} // detail对象，提供给事件监听函数
      var myEventOption = { } // 触发事件的选项
      this.triggerEvent("OptionBoxHandel", myEventDetail, myEventOption) 
      
    }
  }
})
