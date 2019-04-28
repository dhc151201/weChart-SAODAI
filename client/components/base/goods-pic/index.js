// components/base/goods-pic/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      type: String,
      value: ""
    },
    width: {
      type: String,
      value: "144rpx"
    },
    height: {
      type: String,
      value: "144rpx"
    },
    raidus: {
      type: Number,
      value: 10
    },
    note: {
      type: Array,
      value: [{
        name: "新品"
      }],
      observer(newVal, oldVal, changedPath) {

        let val= newVal.map((v, i)=>{
          if(i) return;
          if (v.name.includes('新品')) {
            v.type = "new"
            v.className = "green"
          } else {
            v.type = "hot"
            v.className = "hot"
          }
          return v;
        })
        
        this.setData({
          _note: val
        })

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    "_note": []
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
