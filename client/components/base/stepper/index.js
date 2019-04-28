// components/base/stepper/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value:{
      type: Number,
      value: 0
    },
    min: {
      type: Number,
      value: 1
    },
    max: {
      type: Number,
      value: 100
    },
    step: {
      type: Number,
      value: 1
    },
    disable: {
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
    minus() {
      if (this.data.disable){
        return this.moreChose();
      }
      this.setData({
        value: this.data.value - this.data.step
      }, this.change);
    },
    add(){
      if (this.data.disable) {
        return this.moreChose();
      }
      this.setData({
        value: this.data.value + this.data.step
      }, this.change );
    },
    change(){
      this.triggerEvent('change', { value: this.data.value })
    },
    moreChose(){
      this.triggerEvent('moreChose', { })
    }
  }
})
