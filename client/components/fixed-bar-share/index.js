// components/fixed-bar-share/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      //是否显示引导分享
      isShowGuide:{
        type: Boolean,
        value: false,
        observer(newVal, oldVal, changedPath) {
          this.setData({
            _isShowGuide: newVal,
          })
        }
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _isShowGuide: false,
    fullSen: wx.getStorageSync("full-screen")
  },
  attached(){
    setTimeout(()=>{
      this.setData({
        _isShowGuide: false,
      })
    }, 5000);
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    shareHandel: function(e){
      this.triggerEvent("shareHandel",  e.currentTarget.dataset, {}) 
    }
  }
})
