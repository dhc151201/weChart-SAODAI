// components/loading-image/index.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  properties: {
    src: {
      type: String,
      value: '',
      observer(newVal, oldVal, changedPath) {
        if(!newVal || newVal[0]== '?') return;
        // this.setData({
        //   "_src": newVal
        // })
      }
    },
    width: {
      type: String,
      value: "100%"
    },
    height: {
      type: String,
      value: "200rpx"
    },
    slotLoading: {
      type: Boolean,
      value: false
    },
    radius: {
      type: Number,
      value: 0
    },
    //是否启用懒加载
    lazyload: {
      type: Boolean,
      value: true
    },
    //是否高亮
    light: {
        type: Boolean,
        value: false
    },
      //jpg , bmp , gif , png , webp
      format: {
          type: String,
          value: "jpg"
      },
  },

  /**
   * 组件的初始数据
   */
  data: {
    loading: true,
    loadedStatus: false,
    errorStatus: false,
    _src: "",
  },

  /**
   * 组件的方法列表
   */
  attached: function () {
    if (!this.properties.src){
      // this.setData({
      //   errorStatus: true,
      //   loading: false
      // })
    }
  },
  ready: function(){
    if(!this.io){
      this.io= wx.createIntersectionObserver(this).relativeToViewport({bottom: 10, right: 0 });
      this.io.observe(".box", (res)=>{
        //console.log(res);
        this.setData({
          "_src": this.properties.src+ '/format/'+ this.properties.format
        })
          //this.downFile(this.properties.src)
          this.io.disconnect();
      });
    }
  },
  detached: function(){
    if(this.io){
      this.io.disconnect();
    }
  },
  methods: {
    loaded: function(){
      this.setData({
        loadedStatus: true,
        loading: false
      })
    },
    error: function(){
      this.setData({
        errorStatus: true,
        loading: false
      })
    },
    downFile(url){
        if (wx.getStorageSync("catchImage") instanceof Object && wx.getStorageSync("catchImage")[url] ){
            console.log("使用缓存图片：", wx.getStorageSync("catchImage")[url])
            this.setData({
                "_src": wx.getStorageSync("catchImage")[url]
            })
            return;
        }
        wx.downloadFile({
            url,
            success: (res)=> {
                if (res.statusCode === 200) {
                    //console.log('图片下载成功' + res.tempFilePath)
                    const fs = wx.getFileSystemManager();
                    fs.saveFile({
                        tempFilePath: res.tempFilePath, // 传入一个临时文件路径
                        success: (res)=> {
                            //console.log('图片缓存成功', res.savedFilePath)
                            let catchImage = wx.getStorageSync("catchImage") || {}
                            catchImage[url] = res.savedFilePath
                            wx.setStorageSync("catchImage", catchImage)
                            this.setData({
                                "_src": res.savedFilePath
                            })
                        }
                    })
                } else {
                    console.log('响应失败', res.statusCode)
                }
            }
         })
    }

  }
})
