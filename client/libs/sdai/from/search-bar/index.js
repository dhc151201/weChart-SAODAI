// components/input/index.js
Component({
  properties: {
    // top / bottom  此属性在外部容器实现
    // fixed: {
    //     type: String,
    //     value: ''
    // },
    //是否记录历史输入 此属性在外部容器实现
    // showHistory: {
    //     type: Boolean,
    //     value: false
    // },
    placeholder: {
      type: String,
      value: "请输入关键字"
    },
    //是否显示搜索图标
    showSearch: {
      type: Boolean,
      value: false
    },
    //是否显示取消图标
    showCancel: {
        type: Boolean,
        value: false
    },
    bordercolor: {
      type: String,
      value: "transparent"
    },
    backgroundcolor: {
      type: String,
      value: "rgb(240, 241, 246)"
    },
    //预设值
    value: {
      type: String,
      value: "",
      observer(newVal, oldVal, changedPath) {
        this.setData({
          _showCancel: newVal
        })
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    _showCancel: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput: function(e){
      if(e.detail.value && this.properties.showCancel){
        this.setData({
          _showCancel: true,
        })
      }else if(!e.detail.value){
        this.setData({
          _showCancel: false,
        })
      }
      this.triggerEvent("input", e.detail, true)
    },
    onClear: function(){
      this.setData({
        _showCancel: false,
        value: "",
      })
      this.triggerEvent("input", {value: ''})
      this.triggerEvent("confirm", {value: ''})
    },
    onFocus(){
      this.triggerEvent("focus", {})
    },
    onBlur(){
      this.triggerEvent("blur", {})
    },
    onConfirm(){
      this.triggerEvent("confirm", {})
    }
  }
})
