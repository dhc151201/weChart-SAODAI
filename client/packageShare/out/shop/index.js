const app = getApp();
import { $sdaiActionSheet } from "./../../../components/base/index.js"

Page({
  data: {
    showLoading: true,
    bgImage: "",
    weiChatCode: "",
    canvas: {
      width: "",
      height: ""
    }
  },
  onLoad(){
    //确定长图还是短图
    if (app.globalData.System.screenHeight / app.globalData.System.screenWidth > 1.8 ){
      this.setData({
        longImage: true,
        share: this.options.share,
        "canvas.width": app.globalData.System.screenWidth,
        "canvas.height": app.globalData.System.screenWidth * 1.96,
        bgImage: this.data.$state.assetsUrl + "share_bg_invite_x.png"+ '?d='+ (new Date()).getTime()
      })
    }
    else{
      this.setData({
        share: this.options.share,
        "canvas.width": app.globalData.System.screenWidth,
        "canvas.height": app.globalData.System.screenWidth * 1.61,
        bgImage: this.data.$state.assetsUrl + "share_bg_invite.png"+ '?d='+ (new Date()).getTime()
      })
    }

    //请求生成二维码url
    this.POST(this.$url.bus.weiChatCode, {
      scene: `${this.data.$state.user.recommandCode}`,
      page: "packageShare/in/shop/index",
      size: "280",
      autoColor: false,
      lineColor: [255, 255, 255],
      isHyaline: false
    }).then((res)=>{
        this.setData({
          showLoading: false,
          weiChatCode: "https://" + res.data.cdnHttp + '/' + res.data.fileName + "?imageView2/1/w/300/h/300/q/100"
        }, this.canvasDrow )
    })
    
  },
  onShow(){
    if (this.setting){
      this.saveHandel();
      this.setting= false;
    }
  },
  onShareAppMessage: function (e) {
    //console.log(e)
    if (e.from== "button"){
      //dataset小写转驼峰
      e.target.dataset.imageUrl = e.target.dataset.imageurl;
      //返回自定义数据对象
      return Object.assign({
        success: ()=>{
          this.alert("分享成功")
        }
      }, e.target.dataset); 
      
    }
  },
  //下载网络图片，转化路径
  downloadFile(imgSrc){

    return new Promise((resolve, reject)=>{
      wx.downloadFile({
        url: imgSrc,
        success:  (res)=> {
          resolve(res.tempFilePath);
        }
      });
    })
    
  },
  //canvas画图
  canvasDrow() {

    const context = wx.createCanvasContext('canvas');

    Promise.all([
      this.downloadFile(this.data.bgImage),
      this.downloadFile(this.data.weiChatCode)

    ]).then(([backgroundImage, weiChatCode]) => {

      context.drawImage(
        backgroundImage, 0, 0,
        this.data.canvas.width, this.data.canvas.height
      );

      context.drawImage(
        weiChatCode,
        this.data.canvas.width * .39, 
        this.data.canvas.height * (this.data.longImage ? .58 : .605),
        this.data.canvas.width * .23, this.data.canvas.width * .23
      );

      context.draw();

    })

  },
  //url保存到相册
  saveImageToPhotosAlbum(){
    wx.saveImageToPhotosAlbum({
      filePath: this.tempFilePath,
      success:  (data)=> {
        $sdaiActionSheet().hide();
        this.toast({
          type: 'success',
          duration: 3000,
          color: '#fff',
          text: '保存成功'
        })
      },
      fail:  (err)=> {
        console.log(err);
        if (err.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
          console.log("当初用户拒绝，再次发起授权");
          this.setting= true;
          $sdaiActionSheet().show();
        }
      }
    })
  },
  //canvas转化为url路径
  canvasToTempFilePath(){

    wx.canvasToTempFilePath({
      destWidth: this.data.canvas.width* 2,
      destHeight: this.data.canvas.height * 2,
      canvasId: "canvas",
      fileType: "jpg",
      quality: 1,
      success: ({ tempFilePath })=>{
        this.tempFilePath = tempFilePath;
        this.saveImageToPhotosAlbum();
      }
    })

  },
  //保存handel
  saveHandel(){

    if (!this.tempFilePath){
      this.canvasToTempFilePath();
    }
    else{
      this.saveImageToPhotosAlbum();
    }

  },
  openSetting(){
    wx.openSetting();
  }
})