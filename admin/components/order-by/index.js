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
    showOrderByBox: false,
    choseIndex: 0, //选中索引值
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showOptions: function () {
      this.setData({
        showOrderByBox: !this.data.showOrderByBox
      })

      var myEventDetail = { showOrderByBox: this.data.showOrderByBox } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent("OrderByHandel", myEventDetail, myEventOption)

    },
    chose: function(e){
      this.setData({
        showOrderByBox: !this.data.showOrderByBox
      });

      if (this.data.choseIndex == e.currentTarget.dataset.index) return false;

      this.setData({
        choseIndex: e.currentTarget.dataset.index
      });
      
      var myEventDetail = Object.assign({ 
        showOrderByBox: this.data.showOrderByBox,
      }, e.currentTarget.dataset);

      var myEventOption = {} ;

      this.triggerEvent("OrderByHandel", myEventDetail, myEventOption);

    }
  }
})
