// components/swiper/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    width: {
      type: String,
      value: "100%"
    },
    height: {
      type: Number,
      value: 400
    },
    showNum: {
      type: Number,
      value: 1
    },
    split: {
      type: Number,
      value: 0
    },
    previousmargin: {
      type: Number,
      value: 0
    },
    nextmargin: {
      type: Number,
      value: 0
    },
    raidus: {
      type: Number,
      value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrls: [
      'http://img0.imgtn.bdimg.com/it/u=2020123712,1433884246&fm=26&gp=0.jpg',
      'http://img0.imgtn.bdimg.com/it/u=2020123712,1433884246&fm=26&gp=0.jpg',
      'http://img0.imgtn.bdimg.com/it/u=2020123712,1433884246&fm=26&gp=0.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    loop: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tap: function(e){
      let data = e.currentTarget.dataset
      console.log(data)
    }
  }
})
