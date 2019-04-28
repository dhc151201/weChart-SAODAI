Component({
  // 组件对外暴露的属性
  properties: {
    // 背景颜色
    bgcolor: {
      type: String,
      value: '#FFF'
    },
    //骨架节点背景色
    blockbgcolor: {
      type: String,
      value: '#f5f5f5'
    },
    // 渲染的根节点的类名
    selector: {
      type: String,
      value: 'skeleton'
    },
    // 渲染的相对根节点的类名
    relativeselector: {
      type: String,
      value: ''
    },
    // 加载动画
    loading: {
      type: String,
      value: 'spin'
    }
  },
  data: {
    loadingAni: ['spin', 'chiaroscuro'],
    systemInfo: {},
    skeletonRectLists: [],
    skeletonCircleLists: [],
    relTop: 0,
  },
  attached: function () {
    //默认的首屏宽高，防止内容闪现
    const systemInfo = wx.getSystemInfoSync();
    // 获取系统的信息，作为skeleton的宽和高
    this.setData({
      systemInfo: {
        width: systemInfo.windowWidth,
        height: systemInfo.windowHeight
      },
      // 设置动画
      loading: this.data.loadingAni.includes(this.data.loading) ? this.data.loading : 'spin'
    })

  },
  ready: function () {
    const that = this;

    //绘制背景
    // selectAll: 在当前页面下选择匹配选择器 selector 的所有节点。
    if (this.data.relativeselector){
      wx.createSelectorQuery().selectAll(`.${
        this.data.relativeselector
      }`).boundingClientRect().exec(function (res) {
        //console.log(res);
        that.setData({
          'systemInfo.height': res[0][0].height,
          relTop: res[0][0].top
        })
      });
    }else{
      wx.createSelectorQuery().selectAll(`.${
        this.data.selector
        }`).boundingClientRect().exec(function (res) {
          //console.log(res);
          if (res[0][0].height + res[0][0].top > that.data.systemInfo.height)
          that.setData({
            'systemInfo.height': res[0][0].height + res[0][0].top
          })
        });
    }
    

    //绘制矩形
    this.rectHandle();

    //绘制圆形
    this.radiusHandle();
  },
  methods: {
    rectHandle: function () {
      const that = this;

      //绘制不带样式的节点
      // 选择所有 .skeleton-rect的节点
      wx.createSelectorQuery().selectAll(`.${this.data.selector} .${
        this.data.selector
      }-rect`).boundingClientRect().exec(function (res) {
          //console.log(res);
          // 保存数据，一维数组是节点，二维数组是节点的信息
          that.setData({
            skeletonRectLists: res[0]
          })

          //console.log(that.data);
        });
    },
    radiusHandle: function () {
      const that = this;
      // 同样地选择所有的 .skeleton-radius节点
      wx.createSelectorQuery().selectAll(`.${this.data.selector} .${
        this.data.selector
      }-radius`).boundingClientRect().exec(function (res) {
          //console.log(res);
          that.setData({
            skeletonCircleLists: res[0]
          })
          //console.log(that.data);
        });
    },
  }
})
