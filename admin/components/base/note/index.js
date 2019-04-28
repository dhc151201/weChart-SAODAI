// components/base/note/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    color: {
      type: String,
      value: "rgb(255, 172, 26)"
    },
    bordercolor: {
      type: String,
      value: "rgba(255, 172, 26, .1)"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  attached(){
    if (!this.properties.bordercolor){
      this.properties.bordercolor = this.properties.color;
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
