// components/base/avatar-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    max: {
      type: Number,
      value: 5
    },
    data: {
      type: Array,
      value: [],
      observer(newVal) {
        this.setData({
          list: newVal.slice(0, this.properties.max)
        })
      }
    },
    width: {
      type: Number,
      value: 56,
      observer() {
        this.setStyle();
      }
    },
    height: {
      type: Number,
      value: 56,
      observer() {
        this.setStyle();
      }
    },
    //是否需要覆盖原生层
    cover: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    _style: ''
  },

  attached(){
    this.setStyle();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setStyle(){
      const {width, height}= this.properties;
      this.setData({
        _style: `width: ${width}rpx; height: ${height}rpx;`,
        _marginleft: `margin-left: -${width/3}rpx;`
      })
    }
  }
})
