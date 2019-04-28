// components/no-data-placeholder/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    height: {
      type: String,
      value: "0rpx"
    },
    image: {
      type: String,
      value: ""
    },
    imagewidth: {
      type: Number,
      value: 184
    },
    imageheight: {
      type: Number,
      value: 216
    },
    placeholder: {
      type: String,
      value: "空空如也～"
    },
    placeholderSmiple: {
      type: String,
      value: ""
    },
    buttontext: {
      type: String,
      value: ""
    },
    href: {
      type: String,
      value: ""
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
      submit(){
          if (this.properties.href){
              this.navigateTo(this.properties.href);
          }else{
              this.triggerEvent("submit", {})
          }

      }
  }
})
