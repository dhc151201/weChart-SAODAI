const app = getApp();

import { $sdaiActionSheet } from "./../../../components/base/index.js"
import {shares} from "./../../../utils/shop.configs.js"

Page({
    data: {
        canvas: {
            width: "",
            height: ""
        },
        code:{
            width: "",
            height: ""
        },
        spinShow: true,
    },
    onLoad: function (options) {

        if(!this.options.category || this.options.category== 'undefined' || this.options.category== 'null' ){
            this.setData({spinShow: false});
            return this.toast("参数：category 缺失");
        }

        if (!shares[this.options.category]){
            this.options.category= "其他";
        }

        this.canvas = wx.createCanvasContext('share');

        this.setCanvasLayout();
        this.getCanvasBgimage();

        this.getWeiChatCode().then((res)=>{
            this.imgWeChat= "https://" + res.data.cdnHttp + '/' + res.data.fileName + "?imageView2/1/w/100/h/100/q/100";
            console.log("codeImage url: ", this.imgWeChat);
            this.canvasDrow(); //开始绘图
        })

    },
    onShareAppMessage: function () {

    },
    //canvas 布局
    setCanvasLayout(){
        this.setData({
            "canvas.width": app.globalData.System.screenWidth,
            "canvas.height": app.globalData.System.screenWidth * 1.61,
            "code.width": app.globalData.System.screenWidth* 0.2,
            "code.height": app.globalData.System.screenWidth* 0.2
        });
        if (app.globalData.System.screenHeight / app.globalData.System.screenWidth > 1.8 ){ 
            this.setData({
                "canvas.height": app.globalData.System.screenWidth * 1.96
            });
        }
    },
    //绘画背景图获取
    getCanvasBgimage(){
        //长图
        if (app.globalData.System.screenHeight / app.globalData.System.screenWidth > 1.8 ){ 
            this.imgBg= this.data.$state.assetsUrl + shares[this.options.category].imageBg.long+ '?d='+ (new Date()).getTime();
        }
        //短图
        else{
            this.imgBg= this.data.$state.assetsUrl + shares[this.options.category].imageBg.normal+ '?d='+ (new Date()).getTime();
        }
    },
    //获取二维码图片地址
    getWeiChatCode(){
        return this.POST(this.$url.bus.weiChatCode, {
            scene: `${this.options.tripId},${this.options.from},true`,
            page: "packageTrip/detail/index",
            size: "280",
            autoColor: false,
            lineColor: [255, 255, 255],
            isHyaline: true
        })
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

        Promise.all([
            this.downloadFile(this.imgBg),
            this.downloadFile(this.imgWeChat),
        ]).then(([backgroundImage, weiChatCode]) => {

            this.canvas.drawImage(
                backgroundImage, 0, 0,
                this.data.canvas.width, this.data.canvas.height
            );

            this.canvas.drawImage(
                weiChatCode,
                this.data.canvas.width * 0.5 - this.data.code.width/2, 
                this.data.$state.fullSen ? 
                    this.data.canvas.height - this.data.code.height* 1.7 : 
                    this.data.canvas.height - this.data.code.height* 1.4, 
                this.data.code.width, this.data.code.height
            );

            this.canvas.draw();

            this.setData({spinShow: false})

        })

    },
    //url保存到相册
    saveImageToPhotosAlbum(){
        wx.saveImageToPhotosAlbum({
            filePath: this.tempFilePath,
            success:  (data)=> {
                $sdaiActionSheet().hide();
                wx.showModal({
                    showCancel: false,
                    content: '保存成功',
                })
                // this.toast({
                //     type: 'success',
                //     duration: 3000,
                //     color: '#fff',
                //     text: '保存成功'
                // })
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
            destWidth: this.data.canvas.width* 3,
            destHeight: this.data.canvas.height * 3,
            canvasId: "share",
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
